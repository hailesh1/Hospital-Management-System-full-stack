# Hospital Management System - Backend API

Spring Boot REST API for Hospital Management System with Keycloak authentication, MinIO file storage, and PostgreSQL database.

## Tech Stack

- **Framework**: Spring Boot 3.2.1
- **Database**: PostgreSQL
- **Authentication**: Keycloak
- **File Storage**: MinIO
- **Java Version**: 17

## Project Structure

```
BACKEND/
├── src/
│   ├── main/
│   │   ├── java/com/hospital/management/
│   │   │   ├── HospitalManagementApplication.java
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST Controllers
│   │   │   ├── service/             # Business logic
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── entity/              # JPA entities
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── request/         # Request DTOs
│   │   │   │   └── response/        # Response DTOs
│   │   │   └── exception/           # Exception handling
│   │   └── resources/
│   │       └── application.yml      # Configuration
│   └── test/
└── pom.xml
```

## Features

### Core Modules

1. **Patients Management** - CRUD operations for patient records
2. **Staff Management** - Manage hospital staff (doctors, nurses, admin, receptionist)
3. **Appointments** - Schedule and manage patient appointments
4. **Lab Tests** - Order and track lab test results
5. **Prescriptions** - Manage patient prescriptions
6. **Medical Records** - Store and manage medical records with file attachments
7. **Invoices/Billing** - Generate and manage patient invoices
8. **Scheduling** - Staff scheduling and attendance tracking
9. **Analytics** - Dashboard statistics and reports

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `POST /api/appointments/{id}/check-in` - Check in patient
- `POST /api/appointments/{id}/complete` - Mark as completed
- `POST /api/appointments/{id}/cancel` - Cancel appointment

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/{id}` - Get staff by ID
- `POST /api/staff` - Create staff
- `PUT /api/staff/{id}` - Update staff
- `DELETE /api/staff/{id}` - Delete staff

### Lab Tests
- `GET /api/lab-tests` - Get all lab tests
- `GET /api/lab-tests/{id}` - Get lab test by ID
- `POST /api/lab-tests` - Create lab test
- `PUT /api/lab-tests/{id}` - Update lab test
- `PUT /api/lab-tests/{id}/status` - Update test status

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/{id}` - Get prescription by ID
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/{id}` - Update prescription

### Medical Records
- `GET /api/medical-records` - Get all medical records
- `GET /api/medical-records/{id}` - Get medical record by ID
- `POST /api/medical-records` - Create medical record
- `POST /api/medical-records/{id}/files` - Upload file to medical record

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}/status` - Update invoice status

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/{id}` - Get schedule by ID
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/{id}` - Update schedule

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics

## Configuration

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE hospital_management;
```

2. Update `application.yml` with your database credentials:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hospital_management
    username: your_username
    password: your_password
```

### Keycloak Setup

1. Install and start Keycloak server
2. Create a realm: `hospital-realm`
3. Create a client: `hospital-client`
4. Update `application.yml`:
```yaml
keycloak:
  realm: hospital-realm
  auth-server-url: http://localhost:8080/auth
  resource: hospital-client
  public-client: true
```

### MinIO Setup

1. Install and start MinIO server (default: http://localhost:9000)
2. Create bucket: `hospital-files`
3. Update `application.yml`:
```yaml
minio:
  endpoint: http://localhost:9000
  access-key: your_access_key
  secret-key: your_secret_key
  bucket-name: hospital-files
```

## Running the Application

1. **Prerequisites**:
   - Java 17+
   - Maven 3.6+
   - PostgreSQL
   - Keycloak (for authentication)
   - MinIO (for file storage)

2. **Build the project**:
```bash
mvn clean install
```

3. **Run the application**:
```bash
mvn spring-boot:run
```

4. **Access the API**:
   - Base URL: `http://localhost:8080/api`
   - Health Check: `http://localhost:8080/api/health`

## Security

All endpoints are protected by Keycloak authentication except:
- `/api/health` - Health check endpoint
- `/api/public/**` - Public endpoints (if any)

### Roles
- `ADMIN` - Full access
- `DOCTOR` - Access to patients, appointments, medical records
- `NURSE` - Access to patients, appointments
- `RECEPTIONIST` - Access to patients, appointments, invoices

## Database Schema

The application uses JPA with automatic schema generation (`ddl-auto: update`). Tables are created automatically on startup.

### Main Entities
- `patients` - Patient information
- `staff` - Hospital staff
- `appointments` - Patient appointments
- `lab_tests` - Lab test orders and results
- `prescriptions` - Patient prescriptions
- `medical_records` - Medical records with file attachments
- `invoices` - Billing invoices
- `schedules` - Staff schedules
- `attendances` - Staff attendance

## Development

### Adding a New Entity

1. Create Entity class in `entity/` package
2. Create Repository interface in `repository/` package
3. Create Request/Response DTOs in `dto/` package
4. Create Service class in `service/` package
5. Create Controller class in `controller/` package

## License

This project is part of the Hospital Management System.



