#!/bin/bash

# ===========================================
# HIZLI DEPLOYMENT - TEK KOMUT
# ===========================================
# Bu scripti kendi bilgisayarinizdan calistirin
# ===========================================

# Sunucu bilgileri
SERVER_IP="185.149.102.39"
SERVER_USER="root"
SERVER_PORT="35342"
REMOTE_DIR="/opt/kaanalptekin"

echo "================================================"
echo "  KAAN ALP TEKIN - HIZLI DEPLOYMENT"
echo "================================================"

# Deployment dosyalarini yukle
echo "[1/3] Dosyalar yukleniyor..."
scp -P $SERVER_PORT -r ./* $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

# Deployment scriptini calistir
echo "[2/3] Deployment baslatiliyor..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && chmod +x deploy.sh && ./deploy.sh"

echo "[3/3] Tamamlandi!"
echo "================================================"
echo "  Site Adresi: http://$SERVER_IP"
echo "  Admin Panel: http://$SERVER_IP/admin"
echo "================================================"
