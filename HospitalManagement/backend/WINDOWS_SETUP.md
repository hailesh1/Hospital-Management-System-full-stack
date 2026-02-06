# Hospital Management System - Windows Setup Guide

This guide describes how to run the project on Windows using Docker for the database and dependencies.

## Prerequisites

1.  **Java Development Kit (JDK) 17+**
    *   Download and install from: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/).
    *   Verify installation in PowerShell: `java -version`

2.  **Maven 3.6+**
    *   Download from: [Apache Maven](https://maven.apache.org/download.cgi).
    *   Extract and add the `bin` directory to your System PATH environment variable.
    *   Verify: `mvn -v`

3.  **Docker Desktop**
    *   Download and install from: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
    *   Start Docker Desktop and ensure it is running.

## Running the Application

### 1. Start Support Services (PostgreSQL, Keycloak, MinIO)

Open PowerShell in the project directory (where `docker-compose.yml` is located) and run:

```powershell
docker-compose up -d
```

This starts:
*   **PostgreSQL** (Database) on port `5432` with user `hospital_user` and password `1234`.
*   **Keycloak** (Auth Server) on port `8180`.
*   **MinIO** (File Storage) on port `9000` (console on `9001`).

To check if they are running:

```powershell
docker ps
```

### 2. Configure the Application

Ensure `src/main/resources/application.yml` has the correct database settings (which match the Docker configuration):

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hospital_management
    username: ${DB_USERNAME:hospital_user}
    password: ${DB_PASSWORD:1234}
```

### 3. Build and Run

Run these commands in PowerShell:

**Build:**
```powershell
mvn clean install
```

**Run:**
```powershell
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

### 4. Verify

Open a new PowerShell window and run:

```powershell
curl -v http://localhost:8080/api/health
```

Or open your browser and navigate to: [http://localhost:8080/api/health](http://localhost:8080/api/health)

## Troubleshooting

*   **Port Conflicts:** If ports 5432, 8080, or 9000 are in use, you may need to stop other services or change the mapping in `docker-compose.yml`.
*   **Docker not starting:** Ensure WSL 2 (Windows Subsystem for Linux) is enabled if required by Docker Desktop.
*   **"Ident authentication failed":** This happens if you try to use a local PostgreSQL installation instead of Docker. Use the Docker container to avoid this.
