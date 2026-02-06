#!/bin/bash

# 1. Get Token (assuming admin/admin as per guide)
echo "Getting Access Token..."
TOKEN=$(curl -s -X POST "http://localhost:8180/realms/hospital-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=hospital-client" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin" | jq -r .access_token)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to get token. Check Keycloak is running and admin/admin exists."
    exit 1
fi
echo "Got Token!"

# 2. Create Staff (Doctor)
echo "Creating Staff..."
curl -s -X POST "http://localhost:8080/api/staff" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Gregory",
    "lastName": "House",
    "role": "DOCTOR",
    "specialization": "Diagnostic Medicine",
    "phone": "+1999888777",
    "email": "house@hospital.com",
    "department": "Diagnostic"
  }' | jq .
echo -e "\nStaff Created."

# 3. Create Patient
echo "Creating Patient..."
curl -s -X POST "http://localhost:8080/api/patients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "James",
    "lastName": "Wilson",
    "dateOfBirth": "1980-05-20",
    "gender": "MALE",
    "bloodType": "A_POSITIVE",
    "phone": "+1555444333",
    "email": "wilson@patient.com",
    "address": "221B Baker St",
    "emergencyName": "Gregory House",
    "emergencyPhone": "+1999888777",
    "emergencyRelationship": "Friend"
  }' | jq .
echo -e "\nPatient Created."
