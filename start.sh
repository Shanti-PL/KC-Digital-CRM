#!/bin/bash

echo "🚀 Starting KC Digital CRM..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo "MONGODB_URI=mongodb://localhost:27017/kc-digital-crm" > .env.local
    echo "✅ Environment file created!"
fi

# Check if MongoDB is running (optional)
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    echo "MongoDB CLI found. You can connect using: mongosh kc-digital-crm"
elif command -v mongo &> /dev/null; then
    echo "MongoDB CLI found. You can connect using: mongo kc-digital-crm"
else
    echo "⚠️  MongoDB CLI not found. Make sure MongoDB is installed and running."
    echo "   You can install MongoDB from: https://www.mongodb.com/try/download/community"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Starting development server..."
echo "   Open http://localhost:3000 in your browser"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
