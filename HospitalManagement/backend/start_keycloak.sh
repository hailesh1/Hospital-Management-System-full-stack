#!/bin/bash

# Keycloak Version
KC_VERSION="23.0.3"
KC_DIR="keycloak-${KC_VERSION}"
KC_ZIP="${KC_DIR}.zip"
DOWNLOAD_URL="https://github.com/keycloak/keycloak/releases/download/${KC_VERSION}/${KC_ZIP}"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java 17+ first."
    exit 1
fi

# Download Keycloak if not present
if [ ! -d "$KC_DIR" ]; then
    if [ ! -f "$KC_ZIP" ]; then
        echo "Downloading Keycloak ${KC_VERSION}..."
        wget "$DOWNLOAD_URL"
    fi
    echo "Unzipping Keycloak..."
    unzip "$KC_ZIP"
fi

# Start Keycloak
echo "Starting Keycloak on port 8180..."
# -Djboss.socket.binding.port-offset=100 shifts default 8080 to 8180
# start-dev runs in development mode
./${KC_DIR}/bin/kc.sh start-dev --http-port=8180
