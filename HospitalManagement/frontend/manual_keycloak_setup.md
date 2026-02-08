# How to Add 'Akelilu' to Keycloak Manually

Since Keycloak needs to be running to add users, please follow these steps:

1.  **Start Keycloak**:
    *   Go to `c:\Projects\HospitalManagement\backend`
    *   Double-click `start_keycloak.bat`
    *   Wait until you see `Keycloak ... started` in the window.

2.  **Run the Setup Script**:
    *   Open a new terminal in VS Code.
    *   Run this command:
        ```bash
        node create_keycloak_user.js
        ```

3.  **What this script does**:
    *   Creates user `akelilu` in Keycloak.
    *   Sets password to `password123`.
    *   **AUTOMATICALLY updates your database** so `akelilu` can see the medical records, prescriptions, and billing info we just fixed.

> **Note**: If you cannot start Keycloak now, you can keep using the `dev-akelilu@example.com` login in the meantime. The data is safe.
