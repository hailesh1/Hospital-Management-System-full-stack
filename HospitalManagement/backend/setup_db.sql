-- Create the database
CREATE DATABASE hospital_management;

-- Create the user
CREATE USER hospital_user WITH ENCRYPTED PASSWORD '1234';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;
ALTER DATABASE hospital_management OWNER TO hospital_user;
