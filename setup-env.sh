#!/bin/bash

# Production Environment Setup for Income Stacking Registration
# Run this script to set up environment variables for secure deployment

echo "🔧 Setting up production environment variables..."

# Webinar Fuel Configuration
export WEBINAR_FUEL_API_KEY="Dp2kG9Vucpyq5t5RVPqvDxfU"
export WEBINAR_FUEL_SESSION_TUESDAY="66235"
export WEBINAR_FUEL_SESSION_SATURDAY="66238"
export WEBINAR_FUEL_WIDGET_ID="75116"
export WEBINAR_FUEL_WIDGET_VERSION="126465"
export WEBINAR_FUEL_REGISTRATION_WIDGET="hgtM93jQogXFn9gdLT1dSjUA"
export WEBINAR_FUEL_HIDDEN_DATE_WIDGET="KvKUagFa1nobkfcZGaSK3KiP"
export WEBINAR_FUEL_CONFIRMATION_WIDGET="xCo1kQcuJZKwRwTTXcySfXJc"

# Infusionsoft Configuration
export INFUSIONSOFT_ACCOUNT_ID="yv932"
export INFUSIONSOFT_FORM_XID="2d6fbc78abf8d18ab3268c6cfa02e974"

echo "✅ Environment variables set successfully!"
echo ""
echo "📋 For hosting platforms like Vercel/Netlify, add these as environment variables:"
echo "WEBINAR_FUEL_API_KEY=${WEBINAR_FUEL_API_KEY}"
echo "WEBINAR_FUEL_SESSION_TUESDAY=${WEBINAR_FUEL_SESSION_TUESDAY}"
echo "WEBINAR_FUEL_SESSION_SATURDAY=${WEBINAR_FUEL_SESSION_SATURDAY}"
echo "INFUSIONSOFT_ACCOUNT_ID=${INFUSIONSOFT_ACCOUNT_ID}"
echo "INFUSIONSOFT_FORM_XID=${INFUSIONSOFT_FORM_XID}"
echo ""
echo "🔒 For maximum security, remove fallback values from config.js after setting these!"