# Ngrok Deployment - Quick Commands

## Verification

```bash
# Automated check
./verify-proxy.sh

# Manual checks
docker compose ps                      # Check containers
curl http://localhost:3000             # Test frontend
curl http://localhost:4000/api/health  # Test backend
curl http://localhost/                 # Test Nginx → Frontend
curl http://localhost/api/health       # Test Nginx → Backend
sudo nginx -t                          # Validate Nginx config
```

## Ngrok Management

```bash
# Using control script
./ngrok-control.sh start    # Start
./ngrok-control.sh stop     # Stop
./ngrok-control.sh restart  # Restart
./ngrok-control.sh status   # Check status
./ngrok-control.sh url      # Get public URL
./ngrok-control.sh logs     # View logs

# Manual
ngrok http 80              # Start foreground
nohup ngrok http 80 &      # Start background
pkill ngrok                # Stop
```

## Common Issues

```bash
# Ngrok authtoken required
ngrok config add-authtoken YOUR_TOKEN

# Ngrok version too old
ngrok update
# OR
sudo apt remove ngrok && sudo apt install ngrok

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check Docker logs
docker compose logs -f
```

## Full Workflow

```bash
# 1. Deploy
./deploy-ngrok.sh

# 2. Verify
./verify-proxy.sh

# 3. Setup Ngrok (first time only)
ngrok config add-authtoken YOUR_TOKEN

# 4. Start Ngrok
./ngrok-control.sh start

# 5. Get URL
./ngrok-control.sh url
```
