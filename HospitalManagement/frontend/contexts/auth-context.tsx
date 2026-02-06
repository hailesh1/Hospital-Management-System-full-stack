'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import Keycloak from 'keycloak-js';

type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (options?: Keycloak.KeycloakLoginOptions) => void;
  register: (options?: Keycloak.KeycloakLoginOptions, devUserData?: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  forgotPassword: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'HMS',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'hms-client',
};

// Development mode fallback - set to true to bypass Keycloak when it's unreachable
const USE_DEV_FALLBACK = process.env.NEXT_PUBLIC_USE_DEV_AUTH === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const router = useRouter();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initKeycloak = async () => {
      // Development fallback mode - skip Keycloak if enabled
      if (USE_DEV_FALLBACK) {
        console.warn('🔧 Development mode: Keycloak bypassed. Using mock authentication.');
        console.warn('To enable Keycloak, set NEXT_PUBLIC_USE_DEV_AUTH=false in .env');

        // Load user from localStorage if it exists
        const savedUser = localStorage.getItem('user');
        console.log('🔍 Auth-init: Checking localStorage...', { savedUser: savedUser ? 'Found' : 'Not found' });
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            console.log('🔍 Auth-init: Restoring mock user session', parsed);
            setUser(parsed);
          } catch (e) {
            console.error('Failed to parse saved user:', e);
            localStorage.removeItem('user');
          }
        } else {
          console.log('🔍 Auth-init: No mock session found');
        }

        setIsLoading(false);
        return;
      }

      try {
        const kc = new Keycloak(keycloakConfig);

        // Create a timeout promise to prevent infinite hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Keycloak initialization timeout')), 10000);
        });

        // Race between Keycloak init and timeout
        const authenticated = await Promise.race([
          kc.init({
            onLoad: 'check-sso',
            checkLoginIframe: false,
            pkceMethod: 'S256',
          }),
          timeoutPromise
        ]) as boolean;

        setKeycloak(kc);

        if (authenticated) {
          // Avoid web call to loadUserProfile to prevent CORS issues
          // const profile = await kc.loadUserProfile();
          const profile = kc.idTokenParsed || {};

          // Map Keycloak roles to UserRole
          // This is a simplified mapping. In a real app, you'd check kc.realmAccess?.roles
          let role: UserRole = 'patient';
          if (kc.realmAccess?.roles.includes('admin')) role = 'admin';
          else if (kc.realmAccess?.roles.includes('doctor')) role = 'doctor';
          else if (kc.realmAccess?.roles.includes('receptionist')) role = 'receptionist';

          const userData: User = {
            id: kc.subject || '',
            email: profile.email || '',
            name: profile.name || `${profile.given_name} ${profile.family_name}` || 'User',
            role,
            token: kc.token || '',
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          // Sync patient data with database if role is patient
          if (role === 'patient') {
            try {
              console.log('🔄 Auth: Syncing patient profile with database...', userData.id);
              const nameParts = userData.name.split(' ');
              const fName = nameParts[0] || 'User';
              const lName = nameParts.slice(1).join(' ') || 'Patient';

              await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: userData.id, // Use Keycloak ID
                  firstName: fName,
                  lastName: lName,
                  email: userData.email,
                  status: 'ACTIVE',
                  createdBy: 'SYSTEM-AUTO'
                })
              });
            } catch (err) {
              console.error('Failed to sync patient profile:', err);
            }
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
        // Allow app to continue even if Keycloak fails
        // User can still try to login manually
        setUser(null);
        localStorage.removeItem('user');

        // Show user-friendly error in console
        if (error instanceof Error && error.message.includes('timeout')) {
          console.warn('⚠️ Keycloak server is not responding. Please check if Keycloak is running at:', keycloakConfig.url);
          console.warn('💡 TIP: Set NEXT_PUBLIC_USE_DEV_AUTH=true in .env to use development fallback mode');
        } else {
          console.warn('⚠️ Could not connect to Keycloak. You can still try to login.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = (options?: Keycloak.KeycloakLoginOptions) => {
    // Development fallback mode - simulate login
    if (USE_DEV_FALLBACK) {
      const username = options?.loginHint || 'admin';

      // Map username to role
      let role: UserRole = 'admin';
      if (username.toLowerCase().includes('doctor')) role = 'doctor';
      else if (username.toLowerCase().includes('patient')) role = 'patient';
      else if (username.toLowerCase().includes('receptionist') || username.toLowerCase().includes('reception')) role = 'receptionist';

      const mockUser: User = {
        id: `dev-${username}`,
        email: `${username}@dev.local`,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role,
        token: 'dev-mock-token',
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      console.log('🔧 Development login successful:', { username, role });
      return;
    }

    if (keycloak) {
      keycloak.login(options);
    }
  };

  const register = (options?: Keycloak.KeycloakLoginOptions, devUserData?: Partial<User>) => {
    // Development fallback mode - simulate registration
    if (USE_DEV_FALLBACK) {
      console.log('🔧 Development registration: Simulating new patient registration');
      // In dev mode, just log them in as a new patient or use provided data
      const mockUser: User = {
        id: `dev-new-patient-${Date.now()}`,
        email: devUserData?.email || 'new.patient@dev.local',
        name: devUserData?.name || 'New Patient',
        role: (devUserData?.role as UserRole) || 'patient',
        token: 'dev-mock-token-register',
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Automate patient creation in database for dev mode
      if (mockUser.role === 'patient') {
        const nameParts = mockUser.name.split(' ');
        const fName = nameParts[0] || 'User';
        const lName = nameParts.slice(1).join(' ') || 'Patient';

        fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: mockUser.id,
            firstName: fName,
            lastName: lName,
            email: mockUser.email,
            status: 'ACTIVE',
            createdBy: 'DEV-REGISTER'
          })
        }).catch(err => console.error('Dev mode auto-patient creation failed:', err));
      }
      return;
    }

    if (keycloak) {
      keycloak.register(options);
    }
  };

  const logout = () => {
    console.log('🚪 Auth-logout: Starting logout process...');
    // Clear local state regardless of whether Keycloak is used
    console.log('🚪 Auth-logout: Removing user from localStorage and state');
    localStorage.removeItem('user');
    setUser(null);

    if (keycloak) {
      console.log('🚪 Auth-logout: Keycloak detected, calling keycloak.logout()');
      keycloak.logout({ redirectUri: window.location.origin + '/login' });
    } else {
      console.log('🚪 Auth-logout: Dev mode detected, redirecting to /login');
      // In dev mode, manually redirect to login
      router.push('/login');
    }
  };

  const forgotPassword = () => {
    if (USE_DEV_FALLBACK) {
      toast.info("Password Reset Unavailable", {
        description: "Please contact the system administrator to reset your password. (Development Mode)",
      });
      return;
    }

    if (keycloak) {
      // Keycloak account management URL or redirect to reset credentials
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'HMS';
      const url = `${keycloakConfig.url}/realms/${realm}/login-actions/reset-credentials?client_id=${keycloakConfig.clientId}`;
      window.location.href = url;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
