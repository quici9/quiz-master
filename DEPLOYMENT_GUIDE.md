Hướng Dẫn Triển Khai QuizMaster Lên Server
Tài liệu này hướng dẫn chi tiết cách triển khai ứng dụng QuizMaster lên server production.

📋 Yêu Cầu Hệ Thống
Phần Cứng
CPU: Tối thiểu 2 cores
RAM: Tối thiểu 2GB (khuyến nghị 4GB)
Ổ Đĩa: Tối thiểu 10GB dung lượng trống
Băng Thông: Kết nối internet ổn định
Phần Mềm
Hệ Điều Hành: Ubuntu 20.04/22.04 LTS (khuyến nghị) hoặc CentOS 8+
Docker: Phiên bản 20.10 trở lên
Docker Compose: Phiên bản 2.0 trở lên
Git: Để clone source code
Nginx (tùy chọn): Để làm reverse proxy và HTTPS
🚀 Phương Pháp Triển Khai
Phương Pháp 1: Triển Khai Bằng Docker (Khuyến Nghị)
Docker là phương pháp đơn giản và nhanh nhất để triển khai QuizMaster.

Bước 1: Cài Đặt Docker và Docker Compose
Trên Ubuntu/Debian:
# Update package index
sudo apt update
# Cài đặt các gói cần thiết
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
# Thêm Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# Thêm Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# Cài đặt Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
# Kiểm tra cài đặt
docker --version
docker compose version
# Thêm user vào group docker (để chạy docker không cần sudo)
sudo usermod -aG docker $USER
newgrp docker
Trên CentOS/RHEL:
# Gỡ bỏ phiên bản cũ (nếu có)
sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
# Cài đặt yum-utils
sudo yum install -y yum-utils
# Thêm Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# Cài đặt Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
# Khởi động Docker
sudo systemctl start docker
sudo systemctl enable docker
# Kiểm tra
docker --version
Bước 2: Clone Source Code
# Tạo thư mục cho ứng dụng
sudo mkdir -p /opt/quizmaster
cd /opt/quizmaster
# Clone repository (thay YOUR_REPO_URL bằng URL repository của bạn)
git clone YOUR_REPO_URL .
# Hoặc nếu bạn đã có source code, upload lên server bằng scp/rsync:
# scp -r /path/to/QuizMaster user@server:/opt/quizmaster
Bước 3: Cấu Hình Environment Variables
# Copy file mẫu
cp env.example .env
# Chỉnh sửa file .env
nano .env
Cấu hình .env cho production:

# ===========================================
# CẤU HÌNH DATABASE
# ===========================================
POSTGRES_USER=quizmaster_user
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE  # ⚠️ THAY ĐỔI BẮT BUỘC!
POSTGRES_DB=quizmaster_db
POSTGRES_PORT=5432
# ===========================================
# CẤU HÌNH BACKEND
# ===========================================
BACKEND_PORT=4000
NODE_ENV=production
# ===========================================
# CẤU HÌNH JWT (BẢO MẬT)
# ===========================================
# Tạo JWT secret bằng lệnh: openssl rand -base64 32
JWT_SECRET=YOUR_VERY_LONG_RANDOM_SECRET_KEY_HERE  # ⚠️ THAY ĐỔI BẮT BUỘC!
JWT_REFRESH_SECRET=YOUR_ANOTHER_LONG_RANDOM_SECRET_HERE  # ⚠️ THAY ĐỔI BẮT BUỘC!
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
# ===========================================
# CẤU HÌNH CORS
# ===========================================
# Thay đổi thành domain của bạn
CORS_ORIGIN=https://your-domain.com  # hoặc http://your-server-ip:3000
# ===========================================
# CẤU HÌNH FRONTEND
# ===========================================
FRONTEND_PORT=3000
# Thay đổi thành URL backend của bạn
VITE_API_URL=https://api.your-domain.com/api  # hoặc http://your-server-ip:4000/api
# ===========================================
# CẤU HÌNH UPLOAD
# ===========================================
MAX_FILE_SIZE=10485760  # 10MB
# ===========================================
# CẤU HÌNH BUILD
# ===========================================
BUILD_TARGET=production
Tạo JWT secrets an toàn:

# Tạo JWT_SECRET
openssl rand -base64 32
# Tạo JWT_REFRESH_SECRET
openssl rand -base64 32
# Tạo POSTGRES_PASSWORD
openssl rand -base64 16
Bước 4: Khởi Động Ứng Dụng
# Build và khởi động các services
docker compose up -d --build
# Xem logs để kiểm tra
docker compose logs -f
# Kiểm tra trạng thái các container
docker compose ps
Các container sẽ được khởi động:

quiz-db - PostgreSQL database
quiz-backend - NestJS API server
quiz-frontend - React frontend (chạy trên Nginx)
Bước 5: Kiểm Tra Ứng Dụng
# Kiểm tra backend
curl http://localhost:4000/api
# Kiểm tra frontend
curl http://localhost:3000
# Xem logs
docker compose logs backend
docker compose logs frontend
docker compose logs db
Truy cập ứng dụng:

Frontend: http://your-server-ip:3000
Backend API: http://your-server-ip:4000/api
Tài khoản admin mặc định (được tạo tự động từ seed):

Email: admin@example.com
Password: admin123
⚠️ LƯU Ý: Đổi mật khẩu admin ngay sau khi đăng nhập lần đầu!

Phương Pháp 2: Triển Khai Với Nginx Reverse Proxy + HTTPS
Để có domain riêng và HTTPS, bạn cần cấu hình Nginx làm reverse proxy.

Bước 1: Cài Đặt Nginx
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx
# CentOS/RHEL
sudo yum install -y nginx
# Khởi động Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
Bước 2: Cấu Hình Nginx
Tạo file cấu hình cho QuizMaster:

sudo nano /etc/nginx/sites-available/quizmaster
Cấu hình Nginx (HTTP):

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (nếu cần)
        add_header 'Access-Control-Allow-Origin' 'https://your-domain.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }
}
Enable cấu hình:

# Tạo symlink
sudo ln -s /etc/nginx/sites-available/quizmaster /etc/nginx/sites-enabled/
# Kiểm tra cấu hình
sudo nginx -t
# Reload Nginx
sudo systemctl reload nginx
Bước 3: Cài Đặt SSL Certificate (HTTPS)
Sử dụng Let's Encrypt để có SSL certificate miễn phí:

# Cài đặt Certbot
sudo apt install -y certbot python3-certbot-nginx
# Tạo SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
# Certbot sẽ tự động cấu hình Nginx cho HTTPS
# Certificate sẽ tự động gia hạn
# Kiểm tra auto-renewal
sudo certbot renew --dry-run
Cập nhật .env sau khi có HTTPS:

CORS_ORIGIN=https://your-domain.com
VITE_API_URL=https://api.your-domain.com/api
Rebuild frontend với cấu hình mới:

# Stop services
docker compose down
# Rebuild với cấu hình mới
docker compose up -d --build
Phương Pháp 3: Triển Khai Manual (Không Dùng Docker)
Nếu không muốn dùng Docker, bạn có thể triển khai trực tiếp.

Bước 1: Cài Đặt Node.js
# Cài đặt Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
# Kiểm tra
node --version
npm --version
Bước 2: Cài Đặt PostgreSQL
# Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib
# Khởi động PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
# Tạo database và user
sudo -u postgres psql << EOF
CREATE DATABASE quizmaster_db;
CREATE USER quizmaster_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quizmaster_db TO quizmaster_user;
\q
EOF
Bước 3: Triển Khai Backend
cd /opt/quizmaster/backend
# Cài đặt dependencies
npm ci --production
# Tạo file .env
cat > .env << EOF
DATABASE_URL="postgresql://quizmaster_user:your_password@localhost:5432/quizmaster_db"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_EXPIRATION="1h"
JWT_REFRESH_EXPIRATION="7d"
PORT=4000
NODE_ENV="production"
CORS_ORIGIN="http://localhost:3000"
EOF
# Generate Prisma client
npx prisma generate
# Chạy migrations
npx prisma db push
# Seed database
npx prisma db seed
# Build backend
npm run build
# Khởi động backend với PM2
sudo npm install -g pm2
pm2 start dist/src/main.js --name quizmaster-backend
pm2 save
pm2 startup
Bước 4: Triển Khai Frontend
cd /opt/quizmaster/frontend
# Cài đặt dependencies
npm ci
# Tạo file .env
echo "VITE_API_URL=http://localhost:4000/api" > .env
# Build frontend
npm run build
# Copy build files to Nginx
sudo cp -r dist /var/www/quizmaster
# Cấu hình Nginx (xem Phương pháp 2)
🔧 Quản Lý và Bảo Trì
Xem Logs
Docker:

# Xem tất cả logs
docker compose logs -f
# Xem logs của service cụ thể
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
# Xem 100 dòng log cuối
docker compose logs --tail=100 backend
PM2 (manual deployment):

pm2 logs quizmaster-backend
pm2 logs --lines 100
Restart Services
Docker:

# Restart tất cả services
docker compose restart
# Restart service cụ thể
docker compose restart backend
docker compose restart frontend
PM2:

pm2 restart quizmaster-backend
Cập Nhật Ứng Dụng
Docker:

cd /opt/quizmaster
# Pull code mới
git pull origin main
# Rebuild và restart
docker compose down
docker compose up -d --build
# Hoặc chỉ rebuild service cụ thể
docker compose up -d --build --no-deps backend
Manual:

cd /opt/quizmaster
# Pull code mới
git pull origin main
# Cập nhật backend
cd backend
npm install
npm run build
pm2 restart quizmaster-backend
# Cập nhật frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/quizmaster/
Backup Database
Docker:

# Backup
docker compose exec -T db pg_dump -U quizmaster_user quizmaster_db > backup_$(date +%Y%m%d_%H%M%S).sql
# Restore
docker compose exec -T db psql -U quizmaster_user quizmaster_db < backup.sql
Manual:

# Backup
sudo -u postgres pg_dump quizmaster_db > backup_$(date +%Y%m%d_%H%M%S).sql
# Restore
sudo -u postgres psql quizmaster_db < backup.sql
Tự động backup hàng ngày:

# Tạo script backup
sudo nano /opt/scripts/backup-quizmaster.sh
#!/bin/bash
BACKUP_DIR="/opt/backups/quizmaster"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
# Backup database
docker compose -f /opt/quizmaster/docker-compose.yml exec -T db \
  pg_dump -U quizmaster_user quizmaster_db > $BACKUP_DIR/db_$DATE.sql
# Giữ lại 7 backup gần nhất
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
echo "Backup completed: db_$DATE.sql"
# Cho phép thực thi
sudo chmod +x /opt/scripts/backup-quizmaster.sh
# Thêm vào crontab (chạy hàng ngày lúc 2 giờ sáng)
sudo crontab -e
# Thêm dòng:
0 2 * * * /opt/scripts/backup-quizmaster.sh >> /var/log/quizmaster-backup.log 2>&1
Monitoring
Kiểm tra tình trạng containers:

docker compose ps
docker stats
Kiểm tra disk space:

df -h
docker system df
Dọn dẹp Docker:

# Xóa images không dùng
docker image prune -a
# Xóa volumes không dùng
docker volume prune
# Xóa tất cả (cẩn thận!)
docker system prune -a --volumes
🔒 Bảo Mật
Checklist Bảo Mật
✅ Đổi tất cả mật khẩu mặc định (admin, database, JWT secrets)
✅ Sử dụng HTTPS (SSL certificate)
✅ Cấu hình firewall (chỉ mở port cần thiết)
✅ Cập nhật CORS_ORIGIN đúng domain
✅ Không expose database port ra ngoài (xóa mapping port 5432 trong docker-compose.yml production)
✅ Regular security updates
✅ Backup định kỳ
✅ Monitor logs để phát hiện hoạt động bất thường
Cấu Hình Firewall
UFW (Ubuntu):

# Enable firewall
sudo ufw enable
# Cho phép SSH
sudo ufw allow 22/tcp
# Cho phép HTTP và HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# Nếu không dùng Nginx, cho phép port trực tiếp
sudo ufw allow 3000/tcp
sudo ufw allow 4000/tcp
# Kiểm tra rules
sudo ufw status
FirewallD (CentOS):

# Khởi động firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
# Cho phép HTTP và HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
# Hoặc cho phép ports cụ thể
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=4000/tcp
# Reload
sudo firewall-cmd --reload
Ẩn Database Port (Production)
Chỉnh sửa 
docker-compose.yml
:

# Xóa hoặc comment dòng này trong service db:
services:
  db:
    # ports:
    #   - "${POSTGRES_PORT:-5432}:5432"  # ← Comment hoặc xóa dòng này
Điều này đảm bảo PostgreSQL chỉ accessible từ bên trong Docker network, không expose ra internet.

🚨 Troubleshooting
Lỗi: Port đã được sử dụng
# Kiểm tra process đang dùng port
sudo lsof -i :4000
sudo lsof -i :3000
# Kill process
sudo kill -9 <PID>
# Hoặc đổi port trong .env
Lỗi: Database connection failed
# Kiểm tra database đang chạy
docker compose ps db
# Kiểm tra logs
docker compose logs db
# Kiểm tra DATABASE_URL trong .env
# Reset database
docker compose down -v
docker compose up -d
Lỗi: Frontend không kết nối được Backend
Kiểm tra CORS_ORIGIN trong backend 
.env
Kiểm tra VITE_API_URL trong frontend 
.env
Rebuild frontend sau khi đổi VITE_API_URL:
docker compose up -d --build --no-deps frontend
Lỗi: Out of Memory
# Kiểm tra memory
free -h
# Tạo swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Tự động mount khi reboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
Reset Toàn Bộ Ứng Dụng
# Dừng tất cả services
docker compose down -v
# Xóa volumes
docker volume prune
# Xóa images
docker compose down --rmi all
# Khởi động lại
docker compose up -d --build
📊 Performance Optimization
Cấu Hình Resource Limits
Chỉnh sửa 
docker-compose.yml
:

services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
  
  frontend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
Enable Nginx Caching
# Thêm vào nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;
server {
    location /api {
        proxy_cache api_cache;
        proxy_cache_valid 200 10m;
        proxy_cache_bypass $http_cache_control;
        proxy_pass http://localhost:4000;
    }
}
📞 Hỗ Trợ
Thông Tin Hệ Thống
# Kiểm tra phiên bản
docker --version
docker compose version
node --version
nginx -v
# Kiểm tra resource usage
docker stats
free -h
df -h
Log Files
Nginx logs: /var/log/nginx/access.log, /var/log/nginx/error.log
Docker logs: docker compose logs
PM2 logs: ~/.pm2/logs/
Các Lệnh Hữu Ích
# Xem tất cả containers
docker ps -a
# Xem images
docker images
# Xem networks
docker network ls
# Xem volumes
docker volume ls
# Enter vào container
docker compose exec backend sh
docker compose exec db psql -U quizmaster_user -d quizmaster_db
# Chạy Prisma Studio
docker compose exec backend npx prisma studio
🎯 Kết Luận
Chúc bạn triển khai thành công! Nếu gặp vấn đề:

Kiểm tra logs: docker compose logs -f
Kiểm tra cấu hình 
.env
Xem lại phần Troubleshooting
Đảm bảo tất cả yêu cầu hệ thống được đáp ứng
Default URLs sau khi triển khai:

Frontend: http://your-server-ip:3000 hoặc https://your-domain.com
Backend: http://your-server-ip:4000 hoặc https://api.your-domain.com
Default Admin Login:

Email: admin@example.com
Password: admin123 (⚠️ nhớ đổi!)