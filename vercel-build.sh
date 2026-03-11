#!/bin/bash
# Simple build script for Vercel static site deployment
# This copies all static files to the expected output directory

# Create the output directory structure
mkdir -p .vercel/output/static

# Copy all HTML, JS, CSS, and asset files to the static output
# Exclude node_modules and other build artifacts
rsync -av --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.vercel' \
  --exclude='funnel-builder' \
  --include='*/' \
  --include='*.html' \
  --include='*.js' \
  --include='*.css' \
  --include='*.json' \
  --include='*.png' \
  --include='*.jpg' \
  --include='*.jpeg' \
  --include='*.gif' \
  --include='*.svg' \
  --include='*.ico' \
  --include='*.webp' \
  --exclude='*' \
  . .vercel/output/static/

# Create the config file
cat > .vercel/output/config.json <<EOF
{
  "version": 3
}
EOF

echo "✓ Static site files prepared for deployment"
