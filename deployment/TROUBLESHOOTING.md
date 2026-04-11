# Hesaplama Sayfası Sorun Giderme Rehberi

## Sorun: Hesaplama sayfası açılmıyor

### Olası Nedenler ve Çözümler

---

## 1. React Router SPA Sorunu (En Yaygın)

**Belirti:** `/hesaplama` gibi iç sayfalara doğrudan gidildiğinde 404 hatası alınıyor.

**Neden:** Nginx, React'ın SPA (Single Page Application) route'larını anlamıyor ve dosya arıyor.

**Çözüm:** Nginx konfigürasyonunda `try_files` ayarını kontrol edin:

```nginx
location / {
    proxy_pass http://frontend;
    proxy_intercept_errors on;
    error_page 404 = @fallback;
}

location @fallback {
    proxy_pass http://frontend;
}
```

---

## 2. API Bağlantı Sorunu

**Belirti:** Sayfa açılıyor ama hesaplama araçları çalışmıyor, ilçe verileri yüklenmiyor.

**Kontrol:**
```bash
# Backend çalışıyor mu?
docker logs kaanalptekin_backend

# API yanıt veriyor mu?
curl http://localhost:8001/api/ilce-verileri

# Nginx üzerinden API çalışıyor mu?
curl http://localhost/api/ilce-verileri
```

**Çözüm:** `docker-compose.yml` ve `nginx.conf` dosyalarındaki backend URL'lerini kontrol edin.

---

## 3. REACT_APP_BACKEND_URL Yanlış Ayarlanmış

**Belirti:** API çağrıları yanlış URL'ye gidiyor.

**Kontrol:** Browser console'da network sekmesini açın, API isteklerinin nereye gittiğini kontrol edin.

**Çözüm:** `.env` dosyasını düzenleyin:
```env
REACT_APP_BACKEND_URL=https://kaanalptekin.com
```

Sonra frontend'i yeniden build edin:
```bash
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

---

## 4. CORS Hatası

**Belirti:** Browser console'da CORS hata mesajı görünüyor.

**Kontrol:**
```bash
# CORS header kontrolü
curl -I -X OPTIONS http://localhost/api/ilce-verileri
```

**Çözüm:** `nginx.conf` dosyasında CORS header'larını kontrol edin:
```nginx
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
```

---

## 5. MongoDB Bağlantısı

**Belirti:** Backend log'larında MongoDB bağlantı hatası var.

**Kontrol:**
```bash
# MongoDB çalışıyor mu?
docker logs kaanalptekin_mongodb

# Bağlantı testi
docker exec kaanalptekin_backend python -c "from motor.motor_asyncio import AsyncIOMotorClient; c = AsyncIOMotorClient('mongodb://mongodb:27017'); print('OK')"
```

**Çözüm:** `docker-compose.yml` dosyasında MongoDB servisinin düzgün tanımlandığından emin olun.

---

## 6. ilce_verileri Collection Boş

**Belirti:** Hesaplama sayfası açılıyor ama ilçe dropdown'ı boş.

**Kontrol:**
```bash
# MongoDB'ye bağlan ve collection'ı kontrol et
docker exec -it kaanalptekin_mongodb mongosh
use kaanalptekin_db
db.ilce_verileri.find().count()
```

**Çözüm:** Admin panelinden `/admin/ilce-verileri` sayfasına gidin ve "Toplu İlçe Ekle" butonuna tıklayın.

Veya API ile:
```bash
TOKEN="your-jwt-token"
curl -X POST http://localhost/api/ilce-verileri/toplu-ekle \
  -H "Authorization: Bearer $TOKEN"
```

---

## Hızlı Debug Komutları

```bash
# Tüm servislerin durumu
docker-compose ps

# Tüm logları görüntüle
docker-compose logs -f

# Sadece backend logları
docker-compose logs -f backend

# Nginx logları
docker exec kaanalptekin_nginx cat /var/log/nginx/error.log

# Backend içine gir ve test et
docker exec -it kaanalptekin_backend /bin/bash
python -c "import requests; print(requests.get('http://localhost:8001/api/ilce-verileri').json())"

# Network bağlantısını test et
docker exec kaanalptekin_frontend ping -c 2 backend
docker exec kaanalptekin_nginx ping -c 2 backend
```

---

## Yeniden Deployment

Sorunları çözdükten sonra:

```bash
cd /opt/kaanalptekin/deployment

# Konteynerleri durdur
docker-compose down

# Cache'siz yeniden build
docker-compose build --no-cache

# Başlat
docker-compose up -d

# Logları izle
docker-compose logs -f
```
