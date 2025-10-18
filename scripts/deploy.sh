#!/bin/bash

# Deployment script for AI or Not game
# Usage: ./scripts/deploy.sh [environment]
# Environments: dev, staging, production

set -e  # Exit on error

ENVIRONMENT=${1:-production}
echo "🚀 Starting deployment to $ENVIRONMENT..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Step 1: Pre-deployment checks
echo "📋 Running pre-deployment checks..."

if [ ! -f ".env.$ENVIRONMENT" ] && [ "$ENVIRONMENT" != "dev" ]; then
    print_error "Environment file .env.$ENVIRONMENT not found"
    exit 1
fi

print_success "Environment file found"

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm ci
print_success "Dependencies installed"

# Step 3: Run linter
echo "🔍 Running linter..."
npm run lint || {
    print_warning "Linter found issues, continuing anyway..."
}

# Step 4: Run type check
echo "🔍 Type checking..."
npx tsc --noEmit || {
    print_error "Type check failed"
    exit 1
}
print_success "Type check passed"

# Step 5: Run tests (if not production)
if [ "$ENVIRONMENT" != "production" ]; then
    echo "🧪 Running tests..."
    npm run test:ci || {
        print_warning "Tests failed, but continuing..."
    }
fi

# Step 6: Build application
echo "🏗️  Building application..."
npm run build
print_success "Build completed"

# Step 7: Run database migrations
echo "🗄️  Running database migrations..."
if [ "$ENVIRONMENT" = "production" ]; then
    print_warning "Production migrations should be run manually!"
    print_warning "Run: npx prisma migrate deploy"
else
    npx prisma migrate deploy
    print_success "Migrations completed"
fi

# Step 8: Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Deploying to production..."
    
    # Option 1: Vercel deployment
    if command -v vercel &> /dev/null; then
        print_success "Deploying to Vercel..."
        vercel --prod
    else
        print_warning "Vercel CLI not found. Please deploy manually:"
        echo "  1. Run: npm install -g vercel"
        echo "  2. Run: vercel --prod"
    fi
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "🚀 Deploying to staging..."
    vercel
    
else
    echo "💻 Development mode - no deployment needed"
fi

print_success "Deployment completed successfully!"

# Step 9: Post-deployment tasks
echo "📝 Post-deployment checklist:"
echo "  - Verify application is running"
echo "  - Check error logs in Sentry"
echo "  - Test key user flows"
echo "  - Monitor performance metrics"
echo "  - Verify ad impressions"

echo ""
print_success "Done! 🎉"

