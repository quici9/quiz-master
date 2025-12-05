#!/bin/bash

#############################################
# QuizMaster Ngrok Deployment Script
# Triển khai QuizMaster ra Internet qua Ngrok
#############################################

set -e  # Exit on error

echo "============================================"
echo "QuizMaster Ngrok Deployment Script"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if running on Ubuntu/Debian
if ! command -v apt &> /dev/null; then
    print_error "Script này chỉ hỗ trợ Ubuntu/Debian với apt package manager"
    exit 1
fi

#############################################
# Step 1: Cài đặt Nginx
#############################################
print_info "Step 1: Kiểm tra và cài đặt Nginx..."

if ! command -v nginx &> /dev/null; then
    print_info "Nginx chưa được cài đặt. Đang cài đặt..."
    sudo apt update
    sudo apt install -y nginx
    print_success "Nginx đã được cài đặt"
else
    print_success "Nginx đã có sẵn"
fi

#############################################
# Step 2: Copy Nginx Config
#############################################
print_info "Step 2: Cấu hình Nginx reverse proxy..."

NGINX_CONFIG_SOURCE="./nginx/quizmaster.conf"
NGINX_CONFIG_DEST="/etc/nginx/conf.d/quizmaster.conf"

if [ ! -f "$NGINX_CONFIG_SOURCE" ]; then
    print_error "Không tìm thấy file config: $NGINX_CONFIG_SOURCE"
    print_info "Vui lòng chạy script này từ thư mục gốc của QuizMaster"
    exit 1
fi

sudo cp "$NGINX_CONFIG_SOURCE" "$NGINX_CONFIG_DEST"
print_success "Đã copy Nginx config"

# Test Nginx config
if sudo nginx -t &> /dev/null; then
    print_success "Nginx config hợp lệ"
else
    print_error "Nginx config có lỗi. Vui lòng kiểm tra lại"
    sudo nginx -t
    exit 1
fi

# Reload Nginx
sudo systemctl reload nginx
print_success "Nginx đã được reload"

#############################################
# Step 3: Cài đặt Ngrok
#############################################
print_info "Step 3: Kiểm tra và cài đặt Ngrok..."

if ! command -v ngrok &> /dev/null; then
    print_info "Ngrok chưa được cài đặt. Đang cài đặt..."
    
    # Add Ngrok's official GPG key
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
        sudo tee /etc/apt/trusted.gpg.d/ngrok.asc > /dev/null
    
    # Add Ngrok repository
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
        sudo tee /etc/apt/sources.list.d/ngrok.list > /dev/null
    
    # Install Ngrok
    sudo apt update
    sudo apt install -y ngrok
    
    print_success "Ngrok đã được cài đặt"
else
    print_success "Ngrok đã có sẵn"
fi

#############################################
# Step 4: Khởi động Docker Containers
#############################################
print_info "Step 4: Khởi động QuizMaster Docker containers..."

if [ ! -f "docker-compose.yml" ]; then
    print_error "Không tìm thấy docker-compose.yml"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker chưa được cài đặt. Vui lòng cài đặt Docker trước"
    exit 1
fi

# Stop existing containers
print_info "Dừng containers cũ (nếu có)..."
docker compose down

# Build and start containers
print_info "Build và khởi động containers mới..."
docker compose up --build -d

# Wait for containers to be healthy
print_info "Đợi containers khởi động..."
sleep 10

# Check container status
if docker compose ps | grep -q "Up"; then
    print_success "Containers đã khởi động thành công"
else
    print_error "Có lỗi khi khởi động containers"
    docker compose ps
    exit 1
fi

#############################################
# Step 5: Verify Services
#############################################
print_info "Step 5: Kiểm tra services..."

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    print_success "Frontend đang chạy (port 3000)"
else
    print_error "Frontend không phản hồi"
fi

# Check backend
if curl -s http://localhost:4000/api/health | grep -q "ok"; then
    print_success "Backend đang chạy (port 4000)"
else
    print_error "Backend không phản hồi"
fi

# Check Nginx proxy
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200"; then
    print_success "Nginx proxy hoạt động (port 80)"
else
    print_error "Nginx proxy không hoạt động"
fi

#############################################
# Step 6: Instructions for Ngrok
#############################################
echo ""
echo "============================================"
echo "Cài đặt hoàn tất!"
echo "============================================"
echo ""
print_success "Tất cả services đã sẵn sàng"
echo ""
print_info "BƯỚC TIẾP THEO: Setup Ngrok Authtoken (chỉ cần 1 lần)"
echo ""
echo "1. Đăng ký tài khoản Ngrok (miễn phí):"
echo "   ${GREEN}https://dashboard.ngrok.com/signup${NC}"
echo ""
echo "2. Lấy authtoken:"
echo "   ${GREEN}https://dashboard.ngrok.com/get-started/your-authtoken${NC}"
echo ""
echo "3. Cài authtoken:"
echo "   ${GREEN}ngrok config add-authtoken YOUR_AUTH_TOKEN${NC}"
echo ""
echo "4. Khởi động Ngrok tunnel:"
echo "   ${GREEN}ngrok http 80${NC}"
echo ""
echo "Sau khi chạy, bạn sẽ thấy URL dạng:"
echo "  https://xxxxx.ngrok.io"
echo ""
echo "Mở URL đó trên browser để truy cập QuizMaster!"
echo ""
print_info "Lưu ý: Giữ terminal này mở để Ngrok tiếp tục hoạt động"
echo ""
echo "Để chạy Ngrok trong background, dùng:"
echo "  nohup ngrok http 80 > ngrok.log 2>&1 &"
echo ""
echo "============================================"
