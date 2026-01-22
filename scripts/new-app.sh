#!/bin/bash

# PUBLICWORKS - New React/Vite App Scaffolding Script
# Usage: ./scripts/new-app.sh <app-name> "<description>"

set -e

APP_NAME=$1
DESCRIPTION=${2:-"A new PUBLICWORKS project"}

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./scripts/new-app.sh <app-name> \"<description>\""
  echo "Example: ./scripts/new-app.sh my-cool-app \"An interactive visualization\""
  exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
APPS_DIR="$ROOT_DIR/apps"
APP_DIR="$APPS_DIR/$APP_NAME"

# Check if app already exists
if [ -d "$APP_DIR" ]; then
  echo "Error: App '$APP_NAME' already exists at $APP_DIR"
  exit 1
fi

echo "Creating new React/Vite app: $APP_NAME"
echo "Description: $DESCRIPTION"
echo ""

# Create the app using Vite
cd "$APPS_DIR"
npm create vite@latest "$APP_NAME" -- --template react-ts

cd "$APP_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install framer-motion

# Update vite.config.ts with correct build output
cat > vite.config.ts << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/projects/$APP_NAME/',
  build: {
    outDir: '../../projects/$APP_NAME',
    emptyOutDir: true,
  },
})
EOF

# Update index.css with Tailwind
cat > src/index.css << EOF
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
}
EOF

# Get the next project number
PROJECTS_FILE="$ROOT_DIR/data/projects.json"
LAST_NUMBER=$(cat "$PROJECTS_FILE" | grep '"number"' | tail -1 | sed 's/.*"\([0-9]*\)".*/\1/')
NEXT_NUMBER=$(printf "%03d" $((10#$LAST_NUMBER + 1)))

echo ""
echo "========================================="
echo "App created successfully!"
echo "========================================="
echo ""
echo "Location: $APP_DIR"
echo ""
echo "Next steps:"
echo "1. cd apps/$APP_NAME"
echo "2. npm run dev        # Start development server"
echo "3. npm run build      # Build to projects/$APP_NAME"
echo ""
echo "Don't forget to add to data/projects.json:"
echo ""
echo "  {"
echo "    \"id\": \"$APP_NAME\","
echo "    \"number\": \"$NEXT_NUMBER\","
echo "    \"name\": \"Your App Name\","
echo "    \"description\": \"$DESCRIPTION\","
echo "    \"status\": \"live\","
echo "    \"url\": \"projects/$APP_NAME/\","
echo "    \"date\": \"$(date +%Y-%m)\""
echo "  }"
echo ""
