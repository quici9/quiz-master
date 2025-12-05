# Quick Start - Ngrok Deployment

## Trên VPS Ubuntu

```bash
# 1. Clone hoặc upload code
git clone <your-repo> QuizMaster
cd QuizMaster

# 2. Chạy deployment script
chmod +x deploy-ngrok.sh
./deploy-ngrok.sh

# 3. Start Ngrok tunnel
ngrok http 80

# 4. Copy URL và share
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
