#!/bin/bash

#############################################
# Ngrok Reverse Proxy Verification Script
# Kiểm tra Nginx + Docker containers
#############################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}→ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

echo "============================================"
echo "Ngrok Reverse Proxy Verification"
echo "============================================"
echo ""

#############################################
# 1. Check Docker Containers
#############################################
print_info "1. Kiểm tra Docker Containers..."
echo ""

if ! command -v docker &> /dev/null; then
    print_error "Docker không được cài đặt"
    exit 1
fi

# Check if containers are running
CONTAINERS=$(docker compose ps --format json 2>/dev/null || docker-compose ps --format json 2>/dev/null)

if [ -z "$CONTAINERS" ]; then
    print_error "Không có containers nào đang chạy"
    echo ""
    echo "Chạy lệnh sau để khởi động:"
    echo "  docker compose up -d"
    exit 1
fi

# Show container status
echo "Container Status:"
docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null
echo ""

#############################################
# 2. Check Frontend Container
#############################################
print_info "2. Kiểm tra Frontend (port 3000)..."
echo ""

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    print_success "Frontend đang chạy và phản hồi 200 OK"
else
    print_error "Frontend không phản hồi (HTTP $FRONTEND_STATUS)"
    print_info "Check logs: docker compose logs frontend"
fi
echo ""

#############################################
# 3. Check Backend Container
#############################################
print_info "3. Kiểm tra Backend (port 4000)..."
echo ""

BACKEND_STATUS=$(curl -s http://localhost:4000/api/health 2>/dev/null || echo "error")

if echo "$BACKEND_STATUS" | grep -q "ok"; then
    print_success "Backend đang chạy và health check OK"
    echo "   Response: $BACKEND_STATUS"
else
    print_error "Backend không phản hồi hoặc health check failed"
    print_info "Check logs: docker compose logs backend"
fi
echo ""

#############################################
# 4. Check Nginx Service
#############################################
print_info "4. Kiểm tra Nginx Service..."
echo ""

if ! command -v nginx &> /dev/null; then
    print_error "Nginx không được cài đặt"
    exit 1
fi

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    print_success "Nginx service đang chạy"
else
    print_error "Nginx service không chạy"
    echo ""
    echo "Khởi động Nginx:"
    echo "  sudo systemctl start nginx"
    exit 1
fi

# Check Nginx config
if sudo nginx -t &> /dev/null; then
    print_success "Nginx config hợp lệ"
else
    print_error "Nginx config có lỗi"
    echo ""
    sudo nginx -t
    exit 1
fi
echo ""

#############################################
# 5. Check Nginx Reverse Proxy
#############################################
print_info "5. Kiểm tra Nginx Reverse Proxy..."
echo ""

# Test frontend proxy (/)
PROXY_FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")
if [ "$PROXY_FRONTEND" = "200" ]; then
    print_success "Nginx → Frontend proxy hoạt động (HTTP $PROXY_FRONTEND)"
else
    print_error "Nginx → Frontend proxy FAILED (HTTP $PROXY_FRONTEND)"
fi

# Test backend proxy (/api)
PROXY_BACKEND=$(curl -s http://localhost/api/health 2>/dev/null || echo "error")
if echo "$PROXY_BACKEND" | grep -q "ok"; then
    print_success "Nginx → Backend proxy hoạt động"
    echo "   Response: $PROXY_BACKEND"
else
    print_error "Nginx → Backend proxy FAILED"
    print_info "Response: $PROXY_BACKEND"
fi
echo ""

#############################################
# 6. Check Nginx Config File
#############################################
print_info "6. Kiểm tra Nginx Config File..."
echo ""

if [ -f "/etc/nginx/conf.d/quizmaster.conf" ]; then
    print_success "Config file tồn tại: /etc/nginx/conf.d/quizmaster.conf"
else
    print_error "Config file KHÔNG tồn tại: /etc/nginx/conf.d/quizmaster.conf"
    echo ""
    echo "Copy config file:"
    echo "  sudo cp nginx/quizmaster.conf /etc/nginx/conf.d/"
    exit 1
fi
echo ""

#############################################
# 7. Check Port 80 Listening
#############################################
print_info "7. Kiểm tra Nginx port 80..."
echo ""

if sudo netstat -tlnp | grep -q ":80.*nginx"; then
    print_success "Nginx đang listen trên port 80"
    sudo netstat -tlnp | grep ":80.*nginx"
elif sudo ss -tlnp | grep -q ":80.*nginx"; then
    print_success "Nginx đang listen trên port 80"
    sudo ss -tlnp | grep ":80.*nginx"
else
    print_warning "Nginx có thể không listen trên port 80"
fi
echo ""

#############################################
# Summary
#############################################
echo "============================================"
echo "Tóm Tắt Kiểm Tra"
echo "============================================"
echo ""

ALL_GOOD=true

# Frontend check
if [ "$FRONTEND_STATUS" = "200" ]; then
    print_success "Frontend: OK"
else
    print_error "Frontend: FAILED"
    ALL_GOOD=false
fi

# Backend check
if echo "$BACKEND_STATUS" | grep -q "ok"; then
    print_success "Backend: OK"
else
    print_error "Backend: FAILED"
    ALL_GOOD=false
fi

# Nginx check
if systemctl is-active --quiet nginx; then
    print_success "Nginx Service: OK"
else
    print_error "Nginx Service: FAILED"
    ALL_GOOD=false
fi

# Proxy frontend check
if [ "$PROXY_FRONTEND" = "200" ]; then
    print_success "Nginx → Frontend Proxy: OK"
else
    print_error "Nginx → Frontend Proxy: FAILED"
    ALL_GOOD=false
fi

# Proxy backend check
if echo "$PROXY_BACKEND" | grep -q "ok"; then
    print_success "Nginx → Backend Proxy: OK"
else
    print_error "Nginx → Backend Proxy: FAILED"
    ALL_GOOD=false
fi

echo ""

if [ "$ALL_GOOD" = true ]; then
    echo "============================================"
    print_success "TẤT CẢ KIỂM TRA THÀNH CÔNG!"
    echo "============================================"
    echo ""
    echo "Bạn có thể khởi động Ngrok:"
    echo "  ngrok http 80"
    echo ""
    echo "Hoặc dùng script:"
    echo "  ./ngrok-control.sh start"
    echo ""
else
    echo "============================================"
    print_error "MỘT SỐ KIỂM TRA THẤT BẠI"
    echo "============================================"
    echo ""
    echo "Troubleshooting commands:"
    echo "  - Xem Docker logs: docker compose logs -f"
    echo "  - Xem Nginx logs: sudo tail -f /var/log/nginx/error.log"
    echo "  - Restart Nginx: sudo systemctl restart nginx"
    echo "  - Restart containers: docker compose restart"
    echo ""
    exit 1
fi
