# PRD — Kaan Alp Tekin Real Estate Portfolio & CMS

## Original Problem Statement
Build a full-stack real estate portfolio website and CMS for "Kaan Alp Tekin" (Antalya). Requirements:
- WordPress-like admin panel for full content management
- Cloudinary for persistent image storage
- Consolidated API architecture (single `/api/content/init` for SSR-like fast load)
- Performance-optimized (memory caching, lazy sections, code-splitting)
- Production deployed to user's custom VDS via Docker Compose + GitHub workflow
- Turkish language UI

## User Personas
- **End-user (visitor)**: browses projects, resale listings, blog, market trends, contacts agent.
- **Admin (Kaan Alp Tekin)**: full CMS — manages projects, blog, carousel, resale, forms, market data, content, SEO.

## Tech Stack
- Frontend: React 19 + Vite-style CRA, TailwindCSS, shadcn/ui, lucide-react, Sonner toasts
- Backend: FastAPI + Motor (async MongoDB), JWT auth (HS256), Cloudinary SDK
- Deployment: Docker Compose on custom VDS (user-managed); workflow = Emergent → GitHub → VDS pull

## Implemented Features
### ✅ Completed (current session — Feb 2026)
1. **Backend route fixes** — `resale_routes`, `forms_routes`, `market_trends_routes` now use `verify_token` + lazy `_db()` (server was crashing earlier due to broken `from auth import get_current_user` and `from database import db` imports).
2. **Resale (2. El) Listings module**
   - Public page: `/guncel-ilanlar` (filters: type/location/price; clicking "İletişim" goes to `/iletisim`)
   - Admin: `/admin/resale` with full CRUD + image upload via Cloudinary
   - API: `/api/resale` (GET public; POST/PUT/DELETE admin)
3. **Market Trends visualization**
   - Embedded on Home page (`<MarketTrends />`)
   - Desktop: bar chart + region tabs; Mobile: horizontally swipeable region cards + bottom region summary cards
   - Admin: `/admin/market-trends` — table editor for year/value/change + auto-recalculate change %
   - API: `GET /api/market-trends` (public), `PUT /api/market-trends` (admin) — pydantic→dict serialization fixed for BSON
4. **SLA Forms (Talep & Ekspertiz)**
   - Public: Tabs on `/iletisim` page + modal trigger from `/guncel-ilanlar` CTA
   - Both forms display "3 gün içinde dönüş" SLA banner; success state shows confirmation modal with green check
   - Admin: `/admin/forms` with stats cards, status select (pending/contacted/in_progress/completed), delete
   - API: `/api/forms/talep`, `/api/forms/ekspertiz` (POST public; GET/PUT/DELETE admin)
5. **Mobile UX**
   - Sticky WhatsApp button (`md:hidden`) — slide-up chat widget with quick message → `wa.me/{phone}` deep link
   - Instagram link in mobile menu (gradient pill button below grid)
   - "Güncel İlanlar" added to main Navbar
6. **Removed** — old static stats box under hero slider on Home page
7. **Admin sidebar** — 3 new items (Güncel İlanlar, Piyasa Trendi, Form Başvuruları); sidebar made scrollable with flex layout
8. **test_credentials.md** updated

### Earlier (previous sessions — recap)
- VDS deployment via Docker Compose + nginx
- MongoDB data migration (projects, settings, carousel, about, contact)
- Cloudinary upload path bug fix
- Pydantic Carousel `image_url` ↔ `image` fix

## Verification Status
- **Backend**: 45/45 pytest tests passed (testing_agent v3, iteration 9). 100% success.
- **Frontend**: Manual smoke tests passed — admin login, sidebar links, /guncel-ilanlar, /iletisim with forms tabs, "3 Gün İçinde Dönüş Garantisi" badge.

## Roadmap (Prioritized Backlog)
### P0 — Code Quality & Security (NOT YET ADDRESSED — still pending from previous handoff)
- XSS fixes in `BlogDetail.jsx` and `SiteDataContext.jsx` (dangerouslySetInnerHTML with unsanitized content)
- React hook dependency warnings: `AdminProjects.jsx`, `ProjectDetail.jsx`, `Projects.jsx`, `Home.jsx`, `BlogDetail.jsx`
- Backend `content_routes.py:231` uninitialized variable

### P1 — Feature Enhancements
- Mevduat Faizi API integration on `Hesaplama.jsx` (live banking rates)
- Rich Text editor (TipTap) in `AdminBlog.jsx`
- "Featured Project" toggle in `AdminProjects.jsx` for homepage curation
- Resale listing detail page (`/guncel-ilanlar/:id`) — currently links to `/iletisim`
- Email notifications on form submissions (Resend / SendGrid)

### P2 — Refactor
- Break down oversized components: `AdminContent.jsx` (768), `Hesaplama.jsx` (682), `AdminProjects.jsx` (588)
- Move backend tests to `/app/backend/tests/` (already started by testing agent)

## Key API Endpoints
- `GET /api/content/init` — single bundled init payload (cached)
- `GET/POST/PUT/DELETE /api/projects`
- `GET/POST/PUT/DELETE /api/resale`
- `POST /api/forms/talep` (public), `GET/PUT/DELETE /api/forms/talep` (admin)
- `POST /api/forms/ekspertiz` (public), `GET/PUT/DELETE /api/forms/ekspertiz` (admin)
- `GET /api/market-trends` (public), `PUT /api/market-trends` (admin)
- Auth: `POST /api/auth/login` → `{access_token, token_type}`

## DB Collections
projects, blog_posts, carousel_slides, site_settings, contact_info, seo_settings, hero_features, home_stats, home_cta, about_content, ilce_data, users, messages, **resale_listings** (NEW), **talep_forms** (NEW), **ekspertiz_forms** (NEW), **market_trends** (NEW)

## Workflow
Emergent edits → "Save to GitHub" → user pulls to VDS → docker-compose rebuild
