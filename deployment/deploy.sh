#!/bin/bash

# ===========================================
# KAAN ALP TEKIN - VDS DEPLOYMENT SCRIPT
# ===========================================
# Sunucu: 185.149.102.39
# Port: 35342
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  KAAN ALP TEKIN - DEPLOYMENT SCRIPT    ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Lutfen root olarak calistirin: sudo ./deploy.sh${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[1/8] Sistem guncelleniyor...${NC}"
apt-get update && apt-get upgrade -y

echo -e "\n${YELLOW}[2/8] Gerekli paketler yukleniyor...${NC}"
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw

echo -e "\n${YELLOW}[3/8] Docker yukleniyor...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker basariyla yuklendi!${NC}"
else
    echo -e "${GREEN}Docker zaten yuklu.${NC}"
fi

echo -e "\n${YELLOW}[4/8] Docker Compose yukleniyor...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose basariyla yuklendi!${NC}"
else
    echo -e "${GREEN}Docker Compose zaten yuklu.${NC}"
fi

echo -e "\n${YELLOW}[5/8] Firewall ayarlaniyor...${NC}"
ufw allow 22/tcp
ufw allow 35342/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo -e "${GREEN}Firewall kuruldu!${NC}"

echo -e "\n${YELLOW}[6/8] Proje dizini olusturuluyor...${NC}"
PROJECT_DIR="/opt/kaanalptekin"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo -e "\n${YELLOW}[7/8] .env dosyasi kontrol ediliyor...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}.env dosyasi bulunamadi!${NC}"
    echo -e "${YELLOW}Lutfen .env dosyasini olusturun:${NC}"
    echo -e "cp .env.example .env"
    echo -e "nano .env"
    exit 1
fi

echo -e "\n${YELLOW}[8/8] Docker konteynerlar baslatiliyor...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}  DEPLOYMENT TAMAMLANDI!                 ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "\n${BLUE}Servis Durumu:${NC}"
docker-compose ps

echo -e "\n${BLUE}Erisim Adresleri:${NC}"
echo -e "  Frontend: http://185.149.102.39"
echo -e "  Backend:  http://185.149.102.39/api"
echo -e "\n${YELLOW}SSL icin:${NC}"
echo -e "  1. Domain DNS ayarlarinizi yapin"
echo -e "  2. sudo docker-compose run certbot"
echo -e "  3. sudo docker-compose restart nginx"

echo -e "\n${BLUE}Faydali Komutlar:${NC}"
echo -e "  Loglari gor:     docker-compose logs -f"
echo -e "  Servisleri durdur: docker-compose down"
echo -e "  Yeniden baslat:   docker-compose restart"
