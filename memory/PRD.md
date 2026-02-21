# Özpınarlar İnşaat Grubu - Product Requirements Document

## Original Problem Statement
Özpınarlar İnşaat Grubu için gayrimenkul ve inşaat şirketi websitesi. WordPress benzeri admin paneli ile tüm içeriklerin (projeler, blog, görseller) yönetimi yapılabilecek. Her proje için detaylı sayfalar, daire bilgileri (m², fiyat, durum), kat planları ve ödeme planları gösterilebilecek.

## Tech Stack
**Frontend**: React 19, React Router v7, Tailwind CSS, Shadcn/UI, Axios
**Backend**: FastAPI, MongoDB (Motor), JWT Auth, Python-Jose, Bcrypt
**File Upload**: Local storage with chunked upload support

## Implemented Features

### Phase 1: Public Website ✅
- 5 sayfalık profesyonel web sitesi (Ana Sayfa, Hakkımda, Projeler, Blog, İletişim)
- Responsive tasarım
- Ana sayfa carousel/slider
- Kategori bazlı proje filtreleme (Rezidans, Apartman, Villa, Ticari)

### Phase 2: Admin Panel ✅
- JWT tabanlı authentication
- Proje Yönetimi (CRUD + görsel yükleme)
- Blog Yönetimi (CRUD)
- İçerik Yönetimi (Hero, About, Contact)
- Mesaj Yönetimi
- Kullanıcı Yönetimi
- Carousel/Slider Yönetimi

### Phase 3: Proje Detay Sayfası ✅
- Proje detay sayfası (/projeler/{id})
- 3'lü görsel grid
- Fiyat ve teslim tarihi bilgi kartları
- Sekmeli içerik (Açıklama, Özellikler, Daireler, Ödeme, Kat Planı)
- Daire listesi tablosu
- Ünite tipleri gösterimi

### Phase 4: Daire Yönetimi Arayüzü ✅ (21 Şubat 2026)
- **JSON textarea yerine tablo bazlı kullanıcı dostu form**
- Her daire için: Daire No, Kat, Tip (dropdown), m², Fiyat, Durum (dropdown), Sil butonu
- Tip seçenekleri: 1+0, 1+1, 2+1, 3+1, 4+1, 5+1
- Durum seçenekleri: Satışta, Satıldı, Rezerve
- Özet bilgiler (Toplam, Satışta, Satıldı, Rezerve)
- Responsive tasarım (mobil ve masaüstü)

## API Endpoints

### Authentication
- POST `/api/auth/token` - Login
- GET `/api/auth/verify` - Token verification
- GET `/api/auth/users` - List users
- DELETE `/api/auth/users/{id}` - Delete user

### Projects
- GET `/api/projects` - List all projects
- GET `/api/projects/{id}` - Get project details
- POST `/api/projects` - Create project
- PUT `/api/projects/{id}` - Update project
- DELETE `/api/projects/{id}` - Delete project

### Blog, Content, Messages, Carousel
- Standard CRUD endpoints

### File Upload
- POST `/api/upload` - Upload image
- Static files served from /api/uploads/

## Database Schema

### projects collection
```json
{
  "id": "uuid",
  "title": "string",
  "location": "string",
  "type": "Rezidans|Apartman|Villa|Ticari",
  "status": "completed|ongoing",
  "image": "url",
  "images": ["url"],
  "description": "string",
  "price": "₺X.XXX.XXX",
  "features": ["string"],
  "completion_date": "2025",
  "payment_plan": "string",
  "floor_plan": "url",
  "units": [
    {
      "unit_number": "A101",
      "floor": 1,
      "rooms": "2+1",
      "area_m2": 120,
      "price": "₺5.500.000",
      "status": "available|sold|reserved"
    }
  ]
}
```

## Default Credentials
- **URL**: /admin/login
- **Username**: admin
- **Password**: admin123

## Completed Tasks ✅
1. ✅ Frontend tasarımı
2. ✅ Admin paneli (tüm CRUD işlemleri)
3. ✅ Backend API entegrasyonu
4. ✅ Görsel yükleme
5. ✅ Ana sayfa carousel
6. ✅ Kategori bazlı proje filtreleme
7. ✅ Proje detay sayfası
8. ✅ Daire yönetimi arayüzü iyileştirmesi

## Next Action Items (Priority Order)

### P1 (High Priority)
1. **Admin Şifre Değiştirme**: İlk girişten sonra şifre değiştirme
2. **Zengin Metin Editörü**: Blog ve içerik için WYSIWYG editör (TipTap/TinyMCE)

### P2 (Nice to Have)
3. **Öne Çıkan Proje Sistemi**: Ana sayfada hangi projelerin gösterileceğini seçme
4. **E-posta Bildirimleri**: Yeni mesaj geldiğinde e-posta uyarısı
5. **SEO Yönetimi**: Sayfa meta tag'leri düzenleme
6. **Çoklu Dil Desteği**: İngilizce/Türkçe dil seçeneği

## Test Reports
- `/app/test_reports/iteration_1.json` - Initial testing
- `/app/test_reports/iteration_2.json` - Daire yönetimi testleri (100% başarılı)
- `/app/backend/tests/test_project_units.py` - Unit tests

## File Structure
```
/app/backend/
├── server.py
├── models.py (ProjectUnit model dahil)
├── auth.py
├── seed_db.py
├── routes/
│   ├── auth_routes.py
│   ├── project_routes.py
│   ├── blog_routes.py
│   ├── content_routes.py
│   ├── message_routes.py
│   ├── carousel_routes.py
│   └── upload_routes.py
└── uploads/

/app/frontend/src/
├── services/api.js
├── context/AuthContext.jsx
├── components/
│   ├── ui/ (Shadcn components)
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── Blog.jsx
│   ├── Contact.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminLayout.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminProjects.jsx (Daire yönetimi dahil)
│       ├── AdminBlog.jsx
│       ├── AdminContent.jsx
│       ├── AdminMessages.jsx
│       ├── AdminCarousel.jsx
│       └── AdminUsers.jsx
```
