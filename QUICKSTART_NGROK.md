# Quick Start - Ngrok Deployment

## Trên VPS Ubuntu

```bash
# 1. Clone hoặc upload code
git clone <your-repo> QuizMaster
cd QuizMaster

# 2. Chạy deployment script
chmod +x deploy-ngrok.sh
./deploy-ngrok.sh

# 3. Setup Ngrok authtoken (chỉ 1 lần)
# - Đăng ký: https://dashboard.ngrok.com/signup
# - Lấy token: https://dashboard.ngrok.com/get-started/your-authtoken
ngrok config add-authtoken YOUR_AUTH_TOKEN

# 4. Start Ngrok tunnel
ngrok http 80

# 5. Copy URL và share
# Ví dụ: https://abc123.ngrok.io
```

## Verification

```bash
# Check services
docker-compose ps
curl http://localhost/api/health

# View logs
docker-compose logs -f
```

## Stop

```bash
# Stop Ngrok: Ctrl+C hoặc
pkill ngrok

# Stop containers
docker-compose down
```

## Full Documentation

Xem [NGROK_DEPLOYMENT.md](./NGROK_DEPLOYMENT.md) cho hướng dẫn chi tiết.
