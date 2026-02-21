# Özpınarlar İnşaat Grubu - Product Requirements Document

## Original Problem Statement
Özpınarlar İnşaat Grubu için gayrimenkul ve inşaat şirketi websitesi. WordPress benzeri admin paneli ile tüm içeriklerin (projeler, blog, görseller, slider) yönetimi yapılabilecek.

## Tech Stack
- **Frontend**: React 19, React Router v7, Tailwind CSS, Shadcn/UI, Axios
- **Backend**: FastAPI, MongoDB (Motor), JWT Auth, Python-Jose, Bcrypt
- **Database**: MongoDB

## Implemented Features ✅

### Phase 1: Public Website
- 5 sayfalık profesyonel web sitesi
- Responsive tasarım (mobil, tablet, masaüstü)
- Ana sayfa carousel/slider (manuel kontrol)
- Kategori bazlı proje filtreleme

### Phase 2: Admin Panel
- JWT tabanlı güvenli authentication
- Proje Yönetimi (CRUD + görsel yükleme + daire yönetimi)
- Blog Yönetimi
- İçerik Yönetimi
- Slider Özellikleri Yönetimi (tüm içerikler düzenlenebilir)
- Mesaj Yönetimi
- Kullanıcı Yönetimi
- Carousel/Slider Yönetimi

### Phase 3: Proje Detay & Daire Yönetimi
- Proje detay sayfası
- Tablo bazlı daire yönetimi UI
- Ünite tipleri gösterimi

### Phase 4: Slider Tam Yönetim (22 Şubat 2026)
- Badge metni düzenlenebilir
- İkinci CTA butonu düzenlenebilir
- Güven göstergeleri (Trust Indicators) düzenlenebilir
- Kart içerikleri düzenlenebilir
- İstatistikler düzenlenebilir

### Phase 5: Güvenlik & Deployment Hazırlık
- JWT Secret Key güçlendirildi
- SQL Injection koruması
- XSS koruması
- Auth bypass koruması
- Varsayılan şifre bilgisi kaldırıldı
- Responsive tasarım %100 uyumlu

## Security Measures
- ✅ JWT ile token-based authentication
- ✅ Güçlü rastgele JWT_SECRET_KEY
- ✅ Bcrypt ile şifre hashleme
- ✅ CORS yapılandırması
- ✅ Input validation (Pydantic)
- ✅ SQL Injection koruması
- ✅ XSS koruması
- ✅ Auth gerektiren endpoint'ler korumalı

## Default Admin Credentials
- **URL**: /admin/login
- **Username**: admin
- **Password**: admin123
- ⚠️ İlk girişte şifreyi değiştirin!

## API Endpoints
- POST `/api/auth/login` - Giriş
- GET `/api/auth/verify` - Token doğrulama
- `/api/projects` - Proje CRUD
- `/api/content/hero-features` - Slider özellikleri
- `/api/carousel` - Carousel slide'ları
- `/api/blog` - Blog CRUD
- `/api/messages` - İletişim mesajları
- `/api/upload` - Dosya yükleme

## Test Reports
- `/app/test_reports/iteration_3.json` - Son test (100% başarılı)

## Remaining Tasks
- P1: Admin şifre değiştirme özelliği
- P2: Rich text editör (Blog için)
- P2: Öne çıkan proje sistemi
