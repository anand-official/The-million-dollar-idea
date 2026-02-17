#!/bin/bash

# AI Business Analytics SaaS - Quick Start Script

echo "🚀 Starting AI Business Analytics SaaS Platform..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
NODE_ENV=development
EOF
    echo "✅ .env file created with secure JWT secret"
else
    echo "✅ .env file already exists"
fi
echo ""

# Create backend .env if doesn't exist
if [ ! -f backend/.env ]; then
    echo "⚙️  Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi
echo ""

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ All services are running!"
    echo ""
    echo "📊 Access your application:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:5000"
    echo "   Health:    http://localhost:5000/health"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Create an account to get started"
    echo "   3. Explore the dashboard and analytics features"
    echo ""
    echo "🛠️  Useful commands:"
    echo "   View logs:        docker-compose logs -f"
    echo "   Stop services:    docker-compose down"
    echo "   Restart:          docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Some services failed to start. Check logs:"
    echo "   docker-compose logs"
fi
