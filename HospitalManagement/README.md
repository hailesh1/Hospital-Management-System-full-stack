# Hospital Management System (Restored)

This is the restored Hospital Management System project with complete integration of Keycloak, MinIO, and PostgreSQL.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL
- **Authentication**: Keycloak (OAuth2/JWT)
- **File Storage**: MinIO
- **Build Tool**: Maven

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Keycloak JS

## Project Structure

```
Restored_Project/
├── backend/               # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   ├── docker-compose.yml
│   ├── hms-realm.json    # Keycloak realm configuration
│   └── keycloak-23.0.3/  # Keycloak distribution
└── frontend/             # Next.js frontend
    ├── app/
    ├── components/
    ├── contexts/
    ├── lib/
    └── package.json
```

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker (optional, for running services)

### Option 1: Using Docker Compose (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start all services (PostgreSQL, Keycloak, MinIO):
   ```bash
   docker-compose up -d
   ```

3. Start the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

4. Start the frontend (in a new terminal):
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

### Option 2: Manual Setup

#### PostgreSQL Setup
```bash
# Create database
psql -U postgres
CREATE DATABASE hospital_management;
CREATE USER hospital_user WITH PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;
```

#### Keycloak Setup
```bash
cd backend
# Start Keycloak
./start_keycloak.bat  # or start_keycloak.sh on Linux/Mac
# Import realm: hms-realm.json via admin console at http://localhost:8180
```

#### MinIO Setup
```bash
cd backend
./start_minio.bat
# Access console at http://localhost:9001
# Create bucket: hospital-files
```

## Default Users (Keycloak)

All users have password: `password`

| Role | Username | Email |
|------|----------|-------|
| Admin | admin | admin@hms.com |
| Doctor | hiwot.ketma | hiwot.ketma@hms.com |
| Doctor | dawit.kebede | dawit.kebede@hms.com |
| Patient | alem.tadesse | alem.tadesse@hms.com |
| Patient | metsi.yohannes | metsi.yohannes@hms.com |
| Receptionist | haile.adugna | haile.adugna@hms.com |
| Receptionist | sara.tekelle | sara.tekelle@hms.com |

## Service URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Keycloak**: http://localhost:8180
- **MinIO Console**: http://localhost:9001
- **PostgreSQL**: localhost:5432

## Environment Configuration

### Backend (`backend/src/main/resources/application.yml`)
- Database connection
- Keycloak issuer URI
- MinIO endpoint and credentials

### Frontend (`frontend/.env`)
- Set `NEXT_PUBLIC_USE_DEV_AUTH=false` to use real Keycloak
- Set `NEXT_PUBLIC_USE_DEV_AUTH=true` for development fallback

## Features

- ✅ User authentication via Keycloak (Admin, Doctor, Patient, Receptionist)
- ✅ Patient management
- ✅ Appointment scheduling
- ✅ Medical records with file uploads (MinIO)
- ✅ Billing and invoicing
- ✅ Lab tests and prescriptions
- ✅ Staff management
- ✅ Vital signs tracking
- ✅ Attendance tracking
- ✅ Role-based access control

## Restored Components

The following components were missing and have been restored:

1. **AttendanceRepository** - JPA repository for attendance tracking
2. **VitalSignsRepository** - JPA repository for vital signs
3. **VitalSignsService** - Business logic for vital signs management
4. **VitalSignsController** - REST API endpoints for vital signs
5. **VitalSigns DTOs** - Request and response data transfer objects

## Development Notes

- The backend uses JWT tokens from Keycloak for authentication
- MinIO is used for storing medical record files
- The frontend has a development fallback mode when Keycloak is unavailable
- All entities use UUID as primary keys
- Database schema is auto-generated via Hibernate DDL

## Troubleshooting

### Keycloak not starting
- Check if port 8180 is available
- Verify Java 17+ is installed
- Check `backend/keycloak-23.0.3/data` for errors

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration in `backend/src/main/java/com/hospital/management/config/WebConfig.java`

### Database connection issues
- Verify PostgreSQL is running
- Check credentials in `application.yml`
- Ensure database `hospital_management` exists
