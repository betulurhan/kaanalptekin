# Özpınarlar İnşaat Grubu - Product Requirements Document

## Original Problem Statement
Özpınarlar İnşaat Grubu için gayrimenkul ve inşaat şirketi websitesi. WordPress benzeri admin paneli ile tüm içeriklerin (projeler, blog, görseller, slider, logo) yönetimi yapılabilecek.

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

### Phase 6: Logo Yönetimi & UI İyileştirmeleri (21 Şubat 2026)
- ✅ Logo yönetimi sistemi (SiteSettings model)
- ✅ Admin panelinde Logo sekmesi
- ✅ Navbar logosu yüklenebilir
- ✅ Footer logosu yüklenebilir
- ✅ Site adı düzenlenebilir
- ✅ Slider üzerinde menü yazıları açık renkli (beyaz)
- ✅ Diğer sayfalarda menü yazıları koyu renkli
- ✅ Scroll sonrası navbar renk geçişi

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
- `/api/content/site-settings` - Logo ve site ayarları
- `/api/carousel` - Carousel slide'ları
- `/api/blog` - Blog CRUD
- `/api/messages` - İletişim mesajları
- `/api/upload` - Dosya yükleme

## Test Reports
- `/app/test_reports/iteration_4.json` - Son test (100% başarılı)

## Remaining Tasks
- P1: Admin şifre değiştirme özelliği
- P2: Rich text editör (Blog için)
- P2: Öne çıkan proje sistemi

## SEO Features (21 Şubat 2026)
- ✅ Admin panelinde SEO yönetim sayfası
- ✅ Meta etiketleri (title, description, keywords)
- ✅ Yapısal veri (Schema.org - Organization, RealEstateAgent, WebSite)
- ✅ Sitemap.xml (dinamik oluşturma)
- ✅ robots.txt
- ✅ Canonical URL'ler
- ✅ Google Analytics entegrasyonu (admin panelinden ID girişi)
- ✅ Sayfa bazlı SEO ayarları
- ✅ Kaan Alp Tekin & Antalya için optimize edildi

## Project Multiple Images (22 Şubat 2026)
- ✅ Çoklu kat planı yükleme (floor_plans array)
- ✅ Çoklu proje görseli yükleme (images array)
- ✅ Admin panelinde dosya seçici ile toplu yükleme
- ✅ Proje detay sayfasında grid görünümde kat planları
- ✅ Silme butonu ile görsel kaldırma
