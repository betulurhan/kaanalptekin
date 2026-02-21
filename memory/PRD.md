# Gayrimenkul Danışmanı Website - Product Requirements Document

## Original Problem Statement
Gayrimenkul danışmanı için websitesi. Websitesinde hakkımda, blog, projeler, iletişim kısımları. Ana sayfada kısa hakkımda yazısı ve projeler görsellerle süslensin. Güven veren ve tasarımsal olarak güzel bir yapı. Mobil kullanımda tamamlanan, devam eden projeler, hakkımda gibi kısımlar dashboard tarzında butonlar şeklinde kullanıcı deneyimine uygun vaziyette olsun.

Referans site: https://www.ozpinarlar.com.tr/

## User Choices & Inputs
- **İlk aşama**: Sadece frontend tasarımı (mock data ile)
- **Renk paleti**: Profesyonel, güven veren (Navy blue, amber/gold accents, white)
- **Tasarım**: Modern, minimal, lüks
- **Görsel içerik**: 15 adet profesyonel gayrimenkul görseli (Unsplash & Pexels)
- **Proje sayısı**: 8 adet (5 tamamlanmış, 3 devam eden)
- **Blog yazısı**: 6 adet örnek blog post

## Architecture & Tech Stack
- **Frontend**: React 19, React Router v7, Tailwind CSS
- **UI Components**: Shadcn/UI components
- **Icons**: Lucide React
- **State Management**: React hooks
- **Mock Data**: Centralized in `/frontend/src/mock/mockData.js`

## User Personas
1. **Ev Arayan Aileler**: Güvenilir, detaylı bilgi arayan
2. **Yatırımcılar**: ROI odaklı, piyasa analizi isteyen
3. **İlk Kez Ev Alanlar**: Rehberlik ve destek arayan

## Core Requirements (Static)

### Must Have (P0)
- ✅ Ana sayfa (Hero + About preview + Featured projects + Stats + CTA)
- ✅ Hakkımda sayfası (Full bio + Values + Expertise areas)
- ✅ Projeler sayfası (Tamamlanan/Devam eden tabs + Filtering)
- ✅ Blog sayfası (Featured post + Grid + Category filter)
- ✅ İletişim sayfası (Contact form + Info cards + Map + FAQ)
- ✅ Responsive navigation (Desktop menu + Mobile dashboard-style)
- ✅ Footer (Links + Contact info + Social media)

### Nice to Have (P1)
- Proje detay sayfaları
- Blog yazı detay sayfaları
- Görsel galeriler
- Sanal tur entegrasyonu
- Testimonials section
- Newsletter functionality

### Future Considerations (P2)
- Backend API integration
- Admin panel for content management
- User authentication
- Favorites/saved properties
- Search & advanced filtering
- Chat support integration

## What's Been Implemented (December 21, 2024)

### Frontend Structure
```
/app/frontend/src/
├── components/
│   ├── Navbar.jsx (Desktop + Mobile dashboard menu)
│   ├── Footer.jsx (Full footer with links & social)
│   └── ui/ (Shadcn components)
├── pages/
│   ├── Home.jsx (Complete landing page)
│   ├── About.jsx (Full about page with values)
│   ├── Projects.jsx (Tabs with filtering)
│   ├── Blog.jsx (Featured + Grid layout)
│   └── Contact.jsx (Form + Map + FAQ)
├── mock/
│   └── mockData.js (All mock content)
├── App.js (Router setup)
├── App.css (Custom animations & styles)
└── index.css (Tailwind + theme)
```

### Key Features Implemented
1. **Hero Section**: Full-screen with gradient overlay, CTA buttons, scroll indicator
2. **Stats Section**: 4 statistics cards with icons
3. **About Preview**: Two-column layout with image and key points
4. **Featured Projects**: 3-column grid with hover effects
5. **Mobile Navigation**: Dashboard-style 2x3 grid menu
6. **Projects Page**: 
   - Tabs for Completed (5) / Ongoing (3)
   - Type filter (All, Rezidans, Apartman, Villa, Ticari)
   - Project cards with hover animations
7. **Blog Page**: 
   - Featured post with large image
   - Category filtering
   - 6 blog posts grid
8. **Contact Page**: 
   - Working form with toast notifications (frontend only)
   - 4 info cards
   - Embedded map
   - FAQ section
9. **Design Elements**:
   - Smooth animations and transitions
   - Hover effects on cards and images
   - Professional color scheme (slate, amber accents)
   - Glass-morphism effects on mobile menu
   - Shadow and transform animations

### Mock Data
- **About**: Full bio, experience, stats
- **Projects**: 8 projects (5 completed, 3 ongoing)
- **Blog**: 6 posts with categories
- **Contact**: Phone, email, address, hours, social links

## Prioritized Backlog

### Next Tasks (In Order)
1. **User Feedback**: Gather feedback on design and UX
2. **Content Updates**: Replace mock data with real content
3. **Backend Planning**: 
   - Design API contracts for projects, blog posts
   - Database schema design
   - Authentication strategy (if needed)
4. **Backend Implementation**:
   - FastAPI endpoints for CRUD operations
   - MongoDB models
   - File upload for images
5. **Frontend-Backend Integration**:
   - Replace mock data with API calls
   - Add loading states
   - Error handling
6. **Advanced Features**:
   - Project detail pages
   - Blog post detail pages
   - Admin panel for content management
   - Search functionality

## Technical Notes
- All routes use clean URLs (e.g., `/hakkimda`, `/projeler`)
- Images sourced from Unsplash & Pexels (high quality, free)
- Mobile-first responsive design
- No emoji icons used (Lucide React only)
- Form submission currently frontend-only with toast notification
- No backend integration yet (Phase 1 complete)

## Success Metrics (For Future)
- Page load time < 2s
- Mobile responsiveness score > 95
- User engagement (time on site, pages per visit)
- Contact form submission rate
- Project inquiry conversion rate
