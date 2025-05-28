#!/bin/bash

CERT_NAME="localhost"
KEY_FILE="${CERT_NAME}-key.pem"
CERT_FILE="${CERT_NAME}-cert.pem"

# Només genera si no existeixen
if [[ -f "$KEY_FILE" && -f "$CERT_FILE" ]]; then
  echo "🔒 Ja existeixen els certificats ($KEY_FILE, $CERT_FILE)."
  exit 0
fi

echo "🔧 Generant certificat SSL autofirmat per https://localhost ..."
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -days 365 \
  -subj "/CN=localhost"

echo "✅ Certificats creats:"
echo "  🔑 $KEY_FILE"
echo "  📄 $CERT_FILE"
