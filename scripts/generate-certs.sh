#!/bin/bash
# Generate self-signed certificates for local HTTPS development
# WARNING: Only for development. Use Let's Encrypt for production.

mkdir -p certs
openssl req -nodes -new -x509 -keyout certs/server.key -out certs/server.cert -days 365 -subj "/C=ZA/ST=Gauteng/L=Johannesburg/O=DevStartUp/OU=IT/CN=localhost"

echo "✅ Self-signed SSL certificates generated in ./certs/"
