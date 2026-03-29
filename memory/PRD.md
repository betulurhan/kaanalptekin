# Kaan Alp Tekin - Gayrimenkul Portfolyo ve CMS

## Problem Statement
Full-stack real estate portfolio website and CMS for "Kaan Alp Tekin" in Antalya. Includes WordPress-like admin panel for full content management (Projects, Blogs, SEO, Calculators, Homepage content).

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn/UI, React Router
- **Backend**: FastAPI, Motor (Async MongoDB), Passlib (Bcrypt)
- **Database**: MongoDB
- **Image Storage**: Cloudinary (Cloud Name: dzj1dswdt)
- **Auth**: JWT-based admin authentication

## Architecture
- Frontend on port 3000, Backend on port 8001
- All API routes prefixed with `/api`
- Cloudinary for persistent image storage (NOT local container storage)

## Admin Credentials
- Username: admin
- Password: admin123
- Auto-created on startup via server.py

## Completed Features

### Core Pages (Public)
- Homepage with hero carousel, stats, projects grid, CTA
- Projects listing with filter tabs (type + status)
- Project detail with image gallery, units table, tabs
- Blog listing with featured post and category filter
- Blog detail page with custom creation dates
- About page with bio, stats, values, expertise
- Contact page with form and Google Maps
- Hesaplama (Calculator) page with Rental Yield calculator
- Gizlilik Politikasi (Privacy Policy) page
- Kullanim Kosullari (Terms of Use) page

### Admin Panel
- Dashboard
- Carousel management
- Projects CRUD
- Blog CRUD
- Content management (About, Contact, Hero, Stats, CTA)
- Messages inbox
- User management
- SEO settings
- Ilce (District) data management

### Integrations
- Cloudinary image upload/delete
- Dynamic sitemap/robots.txt
- SEO metadata management

### Performance Optimization (Mar 2026)
- **Single /api/content/init endpoint**: ALL data in 1 API call (siteSettings + contact + seoSettings + carousel + projects + heroFeatures + homeStats + homeCTA)
- **SiteDataContext**: Fetches everything ONCE on app boot, distributes to all components. No more waterfall
- **StrictMode guard (useRef)**: Prevents double-fetch in development mode
- **Home.jsx zero API calls**: Reads all data from SiteDataContext context
- React.lazy code splitting for all page components
- Aggressive image optimization: WebP format, responsive sizes (640w mobile, 1280w desktop), quality 40-50
- Carousel lazy loading - only loads active slide on mobile
- Homepage projects reduced from 6 to 3
- Preconnect/dns-prefetch hints for Unsplash/Cloudinary/Fonts
- HTML loading skeleton for instant first paint
- Production build: 236KB total gzip (JS 185KB + CSS 13KB + API 5KB + image 30KB)
- Estimated production load: ~1.5s on 1.5Mbps mobile, <0.5s on 4G

### Bug Fixes (Feb 2026)
- P0: Fixed responsive layout and image rendering (dead carousel/about images, mobile hero overlapping trust indicators, CTA buttons, carousel arrows)
- P0: Fixed AdminBlog.jsx - was using old local uploadAPI instead of Cloudinary (blog images would be lost on deployment)
- Fixed Production Admin Login (startup script + passlib bcrypt)
- Fixed N+1 queries in project/ilce routes
- Fixed broken preview URLs (migrated to Cloudinary)

## Upcoming Tasks (P1)
- Mevduat Faizi (Deposit Interest) API integration for Hesaplama page
- Rich Text Editor (TipTap) for Blog creation in admin
- "Featured Project" system with is_featured toggle

## Backlog (P2)
- Admin logo change area
- Code cleanup and refactoring (unify image rendering strategy)
