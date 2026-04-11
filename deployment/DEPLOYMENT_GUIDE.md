# Kaan Alp Tekin - VDS Deployment Rehberi

## Sunucu Bilgileri
- **IP Adresi:** 185.149.102.39
- **Kullanici Adi:** root
- **Port:** 35342

---

## Adim 1: Sunucuya Baglanma

```bash
ssh -p 35342 root@185.149.102.39
```

Parola sordugunda girin.

---

## Adim 2: Proje Dosyalarini Yukleme

### Secenck A: GitHub Kullanarak (Onerilir)
```bash
# Git yukle
apt-get update && apt-get install -y git

# Proje dizinini olustur
mkdir -p /opt/kaanalptekin
cd /opt/kaanalptekin

# Repoyu klonla (GitHub'a kaydettiginiz URL)
git clone https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git .
```

### Secenek B: SCP ile Manuel Yukleme
Kendi bilgisayarinizdan:
```bash
# Tum deployment klasorunu yukle
scp -P 35342 -r ./deployment/* root@185.149.102.39:/opt/kaanalptekin/

# Backend kodlarini yukle
scp -P 35342 -r ./backend/* root@185.149.102.39:/opt/kaanalptekin/backend/

# Frontend kodlarini yukle
scp -P 35342 -r ./frontend/* root@185.149.102.39:/opt/kaanalptekin/frontend/
```

---

## Adim 3: Environment Dosyasini Ayarlama

```bash
cd /opt/kaanalptekin

# Ornek dosyayi kopyala
cp .env.example .env

# Duzenle
nano .env
```

Asagidaki degerleri ayarlayin:
```env
JWT_SECRET_KEY=guclu-bir-secret-key-buraya
SITE_URL=https://kaanalptekin.com
CLOUDINARY_CLOUD_NAME=dzj1dswdt
CLOUDINARY_API_KEY=394333181223262
CLOUDINARY_API_SECRET=CpGQem8Lpw0xT3ETNKkizwHIIqc
REACT_APP_BACKEND_URL=https://kaanalptekin.com
```

---

## Adim 4: Deployment Scriptini Calistirma

```bash
chmod +x deploy.sh
./deploy.sh
```

Bu script otomatik olarak:
- Docker ve Docker Compose yukler
- Firewall ayarlarini yapar
- Konteynerlari baslatir

---

## Adim 5: SSL Sertifikasi (Let's Encrypt)

Domain DNS ayarlarinizi yaptiktan sonra:

```bash
cd /opt/kaanalptekin

# Certbot ile SSL al
docker-compose run --rm certbot

# Nginx'i yeniden baslat
docker-compose restart nginx
```

---

## Faydali Komutlar

### Servisleri Yonetme
```bash
# Tum servisleri gor
docker-compose ps

# Loglari takip et
docker-compose logs -f

# Sadece backend loglarini gor
docker-compose logs -f backend

# Servisleri durdur
docker-compose down

# Servisleri yeniden baslat
docker-compose restart

# Tek bir servisi yeniden baslat
docker-compose restart backend
```

### Veritabani Yedekleme
```bash
# MongoDB yedek al
docker exec kaanalptekin_mongodb mongodump --out /dump
docker cp kaanalptekin_mongodb:/dump ./backup_$(date +%Y%m%d)

# Yedegi geri yukle
docker cp ./backup_YYYYMMDD kaanalptekin_mongodb:/dump
docker exec kaanalptekin_mongodb mongorestore /dump
```

### Guncelleme Yapma
```bash
cd /opt/kaanalptekin

# En son kodu cek (GitHub kullaniyorsaniz)
git pull

# Konteynerlari yeniden olustur
docker-compose build --no-cache
docker-compose up -d
```

---

## Sorun Giderme

### Konteyner Baslamiyor
```bash
# Detayli log gor
docker-compose logs backend
docker-compose logs frontend

# Konteynerin icine gir
docker exec -it kaanalptekin_backend /bin/bash
```

### Port Cakismasi
```bash
# Kullanilan portlari gor
netstat -tlnp | grep -E '80|443|8001|3000'

# Cakisan servisi durdur
systemctl stop apache2  # eger Apache varsa
systemctl stop nginx    # eger sistem Nginx'i varsa
```

### MongoDB Baglanti Hatasi
```bash
# MongoDB konteynerini kontrol et
docker logs kaanalptekin_mongodb

# MongoDB'ye baglan
docker exec -it kaanalptekin_mongodb mongosh
```

---

## Dosya Yapisi

```
/opt/kaanalptekin/
├── docker-compose.yml
├── .env
├── deploy.sh
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── server.py
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
└── nginx/
    ├── nginx.conf
    └── ssl/
```

---

## Destek

Herhangi bir sorun yasarsaniz:
1. `docker-compose logs -f` ile loglari kontrol edin
2. Firewall ayarlarini kontrol edin: `ufw status`
3. Portlarin acik oldugunu dogrulayin: `netstat -tlnp`
