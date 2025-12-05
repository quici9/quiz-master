# Hướng Dẫn Triển Khai QuizMaster ra Internet qua Ngrok

## Tổng Quan

Hướng dẫn này giúp bạn expose ứng dụng QuizMaster từ VPS Ubuntu ra Internet sử dụng **Ngrok** (miễn phí) kết hợp **Nginx reverse proxy**.

### Kiến Trúc

```
Internet (Public Users)
    ↓
Ngrok Tunnel (https://xxxxx.ngrok.io)
    ↓
Nginx Reverse Proxy (Port 80)
    ↓
    ├── / → Frontend Container (React, port 3000)
    └── /api → Backend Container (NestJS, port 4000)
```

### Yêu Cầu

- ✅ VPS Ubuntu 20.04+ hoặc Debian-based Linux
- ✅ Docker & Docker Compose đã cài đặt
- ✅ QuizMaster source code
- ✅ Quyền sudo trên VPS

---

## Phương Án 1: Triển Khai Tự Động (Khuyến Nghị)

### Bước 1: Upload Code lên VPS

```bash
# Trên máy local
cd /path/to/QuizMaster
scp -r . user@your-vps-ip:/home/user/QuizMaster

# Hoặc dùng git
ssh user@your-vps-ip
git clone <your-repo-url>
cd QuizMaster
```

### Bước 2: Chạy Deployment Script

```bash
# Trên VPS
cd /home/user/QuizMaster
chmod +x deploy-ngrok.sh
./deploy-ngrok.sh
```

Script sẽ tự động:
- ✅ Cài đặt Nginx
- ✅ Cấu hình reverse proxy
- ✅ Cài đặt Ngrok
- ✅ Khởi động Docker containers
- ✅ Verify tất cả services

### Bước 3: Khởi Động Ngrok Tunnel

Sau khi script chạy xong, chạy lệnh:

```bash
ngrok http 80
```

**Output mẫu:**
```
ngrok                                                                                    

Session Status    online
Account           Free (Limited)
Version           3.x.x
Region            United States (us)
Latency           -
Web Interface     http://127.0.0.1:4040
Forwarding        https://abc123xyz.ngrok.io -> http://localhost:80

Connections       ttl     opn     rt1     rt5     p50     p90
                  0       0       0.00    0.00    0.00    0.00
```

**Public URL của bạn:** `https://abc123xyz.ngrok.io` ← Đây là URL để share

### Bước 4: Truy Cập Ứng Dụng

Mở browser và truy cập: `https://abc123xyz.ngrok.io`

✅ Bạn sẽ thấy trang QuizMaster  
✅ Có thể đăng ký, đăng nhập, upload quiz, làm quiz  
✅ Tất cả API calls hoạt động bình thường

---

## Phương Án 2: Triển Khai Thủ Công

### Bước 1: Cài Đặt Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Bước 2: Cấu Hình Nginx

```bash
# Copy config file
sudo cp nginx/quizmaster.conf /etc/nginx/conf.d/quizmaster.conf

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Bước 3: Cài Đặt Ngrok

```bash
# Add Ngrok repository
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
    sudo tee /etc/apt/trusted.gpg.d/ngrok.asc > /dev/null

echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
    sudo tee /etc/apt/sources.list.d/ngrok.list > /dev/null

# Install
sudo apt update
sudo apt install -y ngrok
```

### Bước 4: Khởi Động Docker Containers

```bash
# Tạo .env file (nếu chưa có)
cp .env.example .env

# Edit .env nếu cần thay đổi passwords, JWT secrets, etc.
nano .env

# Build và start containers
docker-compose down
docker-compose up --build -d

# Check status
docker-compose ps
```

### Bước 5: Verify Services

```bash
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:4000/api/health

# Check Nginx proxy
curl http://localhost/
curl http://localhost/api/health
```

### Bước 6: Khởi Động Ngrok

```bash
ngrok http 80
```

---

## Quản Lý Ngrok

### Chạy Ngrok trong Background

```bash
# Sử dụng nohup
nohup ngrok http 80 > ngrok.log 2>&1 &

# Hoặc sử dụng screen
screen -S ngrok
ngrok http 80
# Nhấn Ctrl+A, D để detach

# Quay lại session
screen -r ngrok
```

### Lấy Ngrok URL từ API

```bash
# Ngrok có web interface local
curl http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

### Tạo Ngrok Config File (Optional)

Tạo file `~/.ngrok.yml`:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN  # Optional, get from ngrok.com
tunnels:
  quizmaster:
    proto: http
    addr: 80
    bind_tls: true
```

Chạy với config:

```bash
ngrok start quizmaster
```

### Đăng Ký Ngrok Account (Free)

Để có features tốt hơn:

1. Đăng ký tại: https://ngrok.com/signup
2. Lấy authtoken
3. Chạy: `ngrok config add-authtoken YOUR_TOKEN`

**Benefits:**
- ✅ URL không timeout nhanh
- ✅ Có thể xem request logs
- ✅ Tùy chỉnh subdomain (paid plan)

---

## Troubleshooting

### 1. Nginx không khởi động

```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check config syntax
sudo nginx -t

# Check port 80 có bị chiếm không
sudo netstat -tlnp | grep :80
```

### 2. Docker containers không start

```bash
# Check logs
docker-compose logs -f

# Check individual container
docker logs quiz-frontend
docker logs quiz-backend
docker logs quiz-db
```

### 3. Frontend không kết nối được Backend

**Kiểm tra:**
- Backend có chạy không: `curl http://localhost:4000/api/health`
- Nginx proxy có hoạt động: `curl http://localhost/api/health`
- CORS settings trong docker-compose.yml phải là `*`
- Frontend build với `VITE_API_URL=/api`

**Fix:**
```bash
# Rebuild frontend với API URL đúng
docker-compose up --build -d frontend
```

### 4. Ngrok tunnel bị disconnect

```bash
# Check Ngrok logs
cat ngrok.log

# Restart Ngrok
pkill ngrok
ngrok http 80
```

### 5. CORS Errors trong Browser Console

**Nguyên nhân:** Backend chưa accept Ngrok domain

**Fix:** Đảm bảo `docker-compose.yml` có:
```yaml
CORS_ORIGIN: ${CORS_ORIGIN:-*}
```

Rebuild backend:
```bash
docker-compose up --build -d backend
```

### 6. File Upload Không Hoạt Động

**Nguyên nhân:** Nginx default max body size = 1MB

**Fix:** Đã được cấu hình trong `nginx/quizmaster.conf`:
```nginx
client_max_body_size 10M;
```

Nếu vẫn lỗi, kiểm tra backend `MAX_FILE_SIZE` trong docker-compose.yml

---

## Monitoring & Logs

### Xem Logs Real-time

```bash
# Tất cả containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ngrok web interface
# Mở browser: http://localhost:4040
```

### Check Container Health

```bash
# Status tất cả containers
docker-compose ps

# Inspect specific container
docker inspect quiz-backend

# Check resource usage
docker stats
```

---

## Dừng Services

### Dừng Ngrok

```bash
# Nếu chạy foreground: Ctrl+C

# Nếu chạy background
pkill ngrok
```

### Dừng Docker Containers

```bash
# Dừng nhưng giữ data
docker-compose stop

# Dừng và xóa containers (giữ volumes)
docker-compose down

# Dừng và xóa tất cả (bao gồm data)
docker-compose down -v
```

### Dừng Nginx

```bash
sudo systemctl stop nginx
```

---

## Security Considerations

> [!CAUTION]
> **Lưu ý bảo mật khi expose ra Internet:**

1. **Thay đổi JWT Secrets:**
   ```bash
   nano .env
   # Thay đổi JWT_SECRET và JWT_REFRESH_SECRET
   ```

2. **Thay đổi Database Password:**
   ```bash
   nano .env
   # Thay đổi POSTGRES_PASSWORD
   ```

3. **Giới hạn CORS khi có domain cố định:**
   ```yaml
   # docker-compose.yml
   CORS_ORIGIN: https://your-fixed-domain.com
   ```

4. **Rate Limiting (Optional):**
   Thêm vào Nginx config:
   ```nginx
   limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
   limit_req zone=one burst=20;
   ```

5. **Không expose Database port:**
   Docker-compose đã config đúng (chỉ expose 80, 4000, 3000)

---

## Performance Tips

### 1. Enable Nginx Caching (Optional)

Thêm vào `nginx/quizmaster.conf`:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 1h;
    # ... existing config
}
```

### 2. Enable Gzip Compression

Thêm vào server block:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_comp_level 6;
```

### 3. Database Connection Pooling

Đã được config sẵn trong NestJS backend

---

## Upgrade từ Ngrok Free sang Paid (Optional)

**Benefits:**
- Custom subdomain: `quizmaster.ngrok.io` (không đổi mỗi lần restart)
- Không giới hạn time
- IP whitelisting
- More bandwidth

**Pricing:** $8/month cho Basic plan

**Setup:**
```bash
# Sau khi subscribe
ngrok config add-authtoken YOUR_TOKEN

# Chạy với custom subdomain
ngrok http 80 --subdomain=quizmaster
```

---

## FAQ

**Q: URL có thay đổi mỗi lần restart Ngrok không?**  
A: Có (free tier). Upgrade paid để có fixed subdomain.

**Q: Có thể dùng domain riêng không?**  
A: Cần Ngrok paid plan hoặc dùng Cloudflare Tunnel (free, cần domain).

**Q: Ngrok có secure không?**  
A: Có, Ngrok tự động cung cấp HTTPS.

**Q: Giới hạn bandwidth của Ngrok free?**  
A: Không giới hạn bandwidth, chỉ giới hạn 40 connections/phút.

**Q: Production nên dùng gì thay Ngrok?**  
A: Cloudflare Tunnel (free) hoặc VPS với IP public + domain + SSL.

**Q: Backend có cần cấu hình gì thêm không?**  
A: Không, chỉ cần CORS_ORIGIN=* trong docker-compose.yml

**Q: Frontend có cần rebuild không?**  
A: Có, vì đổi VITE_API_URL từ localhost sang /api

---

## Cheat Sheet - Quick Commands

```bash
# Deploy toàn bộ
./deploy-ngrok.sh

# Start Ngrok
ngrok http 80

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f

# Stop all
docker-compose down && pkill ngrok

# Rebuild frontend only
docker-compose up --build -d frontend

# Rebuild backend only
docker-compose up --build -d backend

# Get Ngrok URL
curl http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

---

## Liên Hệ & Support

Nếu gặp vấn đề, check logs và reference:
- Docker logs: `docker-compose logs -f`
- Nginx logs: `/var/log/nginx/error.log`
- Ngrok dashboard: `http://localhost:4040`

---

**Chúc bạn triển khai thành công! 🚀**
