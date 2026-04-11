# ============================================
# KAAN ALP TEKIN - VDS DEPLOYMENT
# Hızlı ve Kolay Kurulum Rehberi
# ============================================

## SUNUCU BİLGİLERİ
# IP: 185.149.102.39
# Kullanıcı: root
# Port: 35342

# ============================================
# ADIM 1: SUNUCUYA BAĞLANMA
# ============================================

# Windows PowerShell veya Mac/Linux Terminal:
ssh -p 35342 root@185.149.102.39

# Parola: ZXR@B99u0dWC

# ============================================
# ADIM 2: TEK SATIRDA KURULUM (Tüm Komutlar)
# ============================================

# Aşağıdaki komutları KOPYALA-YAPIŞTIR yapın:

apt-get update && apt-get install -y git curl && \
curl -fsSL https://get.docker.com | sh && \
systemctl enable docker && systemctl start docker && \
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
chmod +x /usr/local/bin/docker-compose && \
mkdir -p /opt/kaanalptekin && cd /opt/kaanalptekin && \
echo "Docker kurulumu tamamlandı!"

# ============================================
# ADIM 3: PROJE DOSYALARINI YÜKLEME
# ============================================

# Seçenek A: GitHub'dan (Önerilir)
# Önce Emergent'ta "Save to Github" yapın, sonra:
cd /opt/kaanalptekin
git clone https://github.com/KULLANICI/REPO.git .

# Seçenek B: Manuel yükleme (SCP ile)
# Kendi bilgisayarınızdan çalıştırın:
# scp -P 35342 -r /path/to/project/* root@185.149.102.39:/opt/kaanalptekin/

# ============================================
# ADIM 4: ENVIRONMENT AYARLAMA
# ============================================

cd /opt/kaanalptekin

# .env dosyası oluştur
cat > .env << 'EOF'
# Backend
JWT_SECRET_KEY=kaan-alp-tekin-super-secret-key-2024-change-this
SITE_URL=https://kaanalptekin.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=dzj1dswdt
CLOUDINARY_API_KEY=394333181223262
CLOUDINARY_API_SECRET=CpGQem8Lpw0xT3ETNKkizwHIIqc

# Frontend
REACT_APP_BACKEND_URL=https://kaanalptekin.com
EOF

echo ".env dosyası oluşturuldu!"

# ============================================
# ADIM 5: DOCKER COMPOSE BAŞLATMA
# ============================================

cd /opt/kaanalptekin/deployment

# İlk kez çalıştırma
docker-compose build --no-cache
docker-compose up -d

# Durumu kontrol et
docker-compose ps

# ============================================
# ADIM 6: SSL SERTİFİKASI (HTTPS)
# ============================================

# Önce domain DNS'i ayarlayın:
# kaanalptekin.com -> A Record -> 185.149.102.39
# www.kaanalptekin.com -> A Record -> 185.149.102.39

# DNS yayıldıktan sonra (5-30 dakika):
docker-compose run --rm certbot

# Nginx'i yeniden başlat
docker-compose restart nginx

# ============================================
# FAYDALI KOMUTLAR
# ============================================

# Logları izle
docker-compose logs -f

# Servisleri yeniden başlat
docker-compose restart

# Servisleri durdur
docker-compose down

# Güncellemeden sonra
docker-compose build --no-cache && docker-compose up -d
