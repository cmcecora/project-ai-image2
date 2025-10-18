#!/bin/bash

# Health check script for monitoring deployed application
# Usage: ./scripts/health-check.sh [url]

URL=${1:-http://localhost:3005}
echo "🏥 Running health checks on $URL..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Track results
PASSED=0
FAILED=0

# Check 1: Homepage loads
echo "Checking homepage..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")
if [ "$HTTP_CODE" -eq 200 ]; then
    print_success "Homepage loads (HTTP $HTTP_CODE)"
    ((PASSED++))
else
    print_error "Homepage failed (HTTP $HTTP_CODE)"
    ((FAILED++))
fi

# Check 2: API endpoint
echo "Checking API..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/images/random")
if [ "$HTTP_CODE" -eq 200 ]; then
    print_success "API responds (HTTP $HTTP_CODE)"
    ((PASSED++))
else
    print_error "API failed (HTTP $HTTP_CODE)"
    ((FAILED++))
fi

# Check 3: Leaderboard page
echo "Checking leaderboard..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/leaderboard")
if [ "$HTTP_CODE" -eq 200 ]; then
    print_success "Leaderboard loads (HTTP $HTTP_CODE)"
    ((PASSED++))
else
    print_error "Leaderboard failed (HTTP $HTTP_CODE)"
    ((FAILED++))
fi

# Check 4: Response time
echo "Checking response time..."
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null "$URL/")
RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc | cut -d'.' -f1)
if [ "$RESPONSE_MS" -lt 2000 ]; then
    print_success "Response time: ${RESPONSE_MS}ms"
    ((PASSED++))
else
    print_warning "Response time slow: ${RESPONSE_MS}ms (target: <2000ms)"
    ((FAILED++))
fi

# Check 5: SSL Certificate (if HTTPS)
if [[ $URL == https://* ]]; then
    echo "Checking SSL certificate..."
    DOMAIN=$(echo "$URL" | sed -e 's|^https://||' -e 's|/.*||')
    SSL_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "$SSL_EXPIRY" ]; then
        print_success "SSL certificate valid until: $SSL_EXPIRY"
        ((PASSED++))
    else
        print_error "SSL certificate check failed"
        ((FAILED++))
    fi
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Health Check Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Passed: $PASSED"
if [ "$FAILED" -gt 0 ]; then
    print_error "Failed: $FAILED"
    exit 1
else
    print_success "All checks passed!"
    exit 0
fi

