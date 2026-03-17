#!/bin/bash
# Security Audit Script
# Runs npm audit and checks for Known Vulnerabilities in dependencies

echo "🔍 Running NPM Security Audit..."
npm audit

if [ $? -eq 0 ]; then
    echo "✅ No known vulnerabilities found."
else
    echo "⚠️ Vulnerabilities detected. Consider running 'npm audit fix'"
fi
