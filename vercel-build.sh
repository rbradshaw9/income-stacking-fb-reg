#!/bin/bash
# Simple build script for Vercel static site deployment
# This copies all static files to the expected output directory

set -e

# Create the output directory structure
mkdir -p .vercel/output/static

# Copy all directories and files, excluding build artifacts
echo "Copying static files..."

# Copy HTML files
find . -maxdepth 1 -name "*.html" -exec cp {} .vercel/output/static/ \;

# Copy JavaScript directory
if [ -d "js" ]; then
  cp -r js .vercel/output/static/
fi

# Copy assets directory
if [ -d "assets" ]; then
  cp -r assets .vercel/output/static/
fi

# Copy funnel directories (all directories except node_modules, .git, etc.)
for dir in 2026-predictions 2026-predictions-rd ai-takeover high-probability-trading income-stacking; do
  if [ -d "$dir" ]; then
    cp -r "$dir" .vercel/output/static/
  fi
done

# Copy root config files
cp vercel.json .vercel/output/static/ 2>/dev/null || true

# Create the Vercel Build Output API config file
cat > .vercel/output/config.json <<EOF
{
  "version": 3
}
EOF

echo "✓ Static site files prepared for deployment"
find .vercel/output/static -type f | wc -l | xargs echo "✓ Total files copied:"
