#!/bin/sh

echo ""
echo "Restoring frontend npm packages"
echo ""

npm install
if [ $? -ne 0 ]; then
    echo "Failed to restore frontend npm packages"
    exit $?
fi

echo ""
echo "Building frontend"
echo ""

echo "VITE_API_BACKEND=$VITE_API_BACKEND" > .env.production

npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build frontend"
    exit $?
fi
