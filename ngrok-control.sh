#!/bin/bash

#############################################
# Ngrok Control Script
# Quản lý Ngrok tunnel dễ dàng
#############################################

show_help() {
    echo "Usage: ./ngrok-control.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start Ngrok in background"
    echo "  stop      - Stop Ngrok"
    echo "  restart   - Restart Ngrok"
    echo "  status    - Check Ngrok status"
    echo "  url       - Get public URL"
    echo "  logs      - View Ngrok logs"
    echo ""
}

start_ngrok() {
    if pgrep -x "ngrok" > /dev/null; then
        echo "❌ Ngrok đang chạy rồi!"
        echo "Run './ngrok-control.sh status' để xem thông tin"
        exit 1
    fi
    
    echo "🚀 Starting Ngrok..."
    nohup ngrok http 80 > ngrok.log 2>&1 &
    
    sleep 3
    
    if pgrep -x "ngrok" > /dev/null; then
        echo "✅ Ngrok đã khởi động thành công!"
        get_url
    else
        echo "❌ Lỗi khi khởi động Ngrok"
        echo "Check logs: tail -f ngrok.log"
        exit 1
    fi
}

stop_ngrok() {
    if ! pgrep -x "ngrok" > /dev/null; then
        echo "⚠️  Ngrok không chạy"
        exit 0
    fi
    
    echo "🛑 Stopping Ngrok..."
    pkill ngrok
    
    sleep 2
    
    if ! pgrep -x "ngrok" > /dev/null; then
        echo "✅ Ngrok đã dừng"
    else
        echo "⚠️  Force killing..."
        pkill -9 ngrok
        echo "✅ Ngrok đã dừng (force)"
    fi
}

restart_ngrok() {
    echo "🔄 Restarting Ngrok..."
    stop_ngrok
    sleep 2
    start_ngrok
}

check_status() {
    if pgrep -x "ngrok" > /dev/null; then
        echo "✅ Ngrok đang chạy"
        echo ""
        echo "Process info:"
        ps aux | grep ngrok | grep -v grep
        echo ""
        get_url
    else
        echo "❌ Ngrok không chạy"
        echo "Run './ngrok-control.sh start' để khởi động"
    fi
}

get_url() {
    if ! pgrep -x "ngrok" > /dev/null; then
        echo "❌ Ngrok không chạy"
        exit 1
    fi
    
    sleep 2
    
    echo "🌐 Public URL:"
    if command -v jq &> /dev/null; then
        URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
        echo "   $URL"
    else
        echo "   Check: http://localhost:4040"
        echo "   Or install jq: sudo apt install jq"
    fi
}

view_logs() {
    if [ ! -f "ngrok.log" ]; then
        echo "❌ Không tìm thấy ngrok.log"
        exit 1
    fi
    
    echo "📋 Ngrok logs (Ctrl+C để thoát):"
    echo ""
    tail -f ngrok.log
}

# Main script
case "$1" in
    start)
        start_ngrok
        ;;
    stop)
        stop_ngrok
        ;;
    restart)
        restart_ngrok
        ;;
    status)
        check_status
        ;;
    url)
        get_url
        ;;
    logs)
        view_logs
        ;;
    *)
        show_help
        ;;
esac
