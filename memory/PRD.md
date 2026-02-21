# Gayrimenkul Danışmanı Website - Product Requirements Document

## Original Problem Statement
Gayrimenkul danışmanı için tam özellikli CMS (WordPress benzeri) admin paneli ile yönetilebilir websitesi. Kullanıcı adı ve şifre ile admin paneline giriş yapılacak. Admin panelinden projeler, blog, hakkımda, iletişim bilgileri ve ana sayfa görsellerinin yönetimi yapılabilecek.

## Tech Stack
**Frontend**: React 19, React Router v7, Tailwind CSS, Shadcn/UI, Axios
**Backend**: FastAPI, MongoDB (Motor), JWT Auth, Python-Jose, Bcrypt
**File Upload**: Local storage with chunked upload support

## Implemented Features (December 21, 2024)

### Phase 1: Frontend with Mock Data ✅
- 5 sayfalık profesyonel web sitesi (Ana Sayfa, Hakkımda, Projeler, Blog, İletişim)
- Responsive tasarım ve mobil dashboard-style menü
- Profesyonel görsel ve içeriklerle tam çalışır frontend

### Phase 2: Full-Stack Admin Panel ✅
**Backend API**:
- ✅ JWT tabanlı authentication (login, token verification)
- ✅ Multi-user support (user CRUD operations)
- ✅ Projects API (CRUD with filters)
- ✅ Blog API (CRUD with categories)
- ✅ Content Management API (About, Contact, Hero sections)
- ✅ Contact Messages API (create, read, mark as read, delete)
- ✅ File Upload API (image upload with size/type validation)
- ✅ Database seeding (default admin + initial content)

**Admin Panel Frontend**:
- ✅ Login page with authentication
- ✅ Protected routes with JWT
- ✅ Admin Dashboard (statistics, quick actions)
- ✅ Projects Management (add, edit, delete, image upload)
- ✅ Blog Management (add, edit, delete with categories)
- ✅ Content Editor (Hero, About, Contact info)
- ✅ Messages Inbox (view, mark as read, delete)
- ✅ User Management (add, delete users)
- ✅ Responsive admin layout with sidebar

**Public Site Integration**:
- ✅ Contact form integrated with backend
- 🔄 Projects/Blog/Content still using mock data (to be integrated)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new admin user
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/auth/verify` - Verify JWT token
- GET `/api/auth/users` - Get all users (protected)
- DELETE `/api/auth/users/{id}` - Delete user (protected)

### Projects
- GET `/api/projects` - Get all projects (optional filters)
- GET `/api/projects/{id}` - Get single project
- POST `/api/projects` - Create project (protected)
- PUT `/api/projects/{id}` - Update project (protected)
- DELETE `/api/projects/{id}` - Delete project (protected)

### Blog
- GET `/api/blog` - Get all blog posts
- POST `/api/blog` - Create blog post (protected)
- PUT `/api/blog/{id}` - Update blog post (protected)
- DELETE `/api/blog/{id}` - Delete blog post (protected)

### Content
- GET `/api/content/about` - Get about content
- PUT `/api/content/about` - Update about content (protected)
- GET `/api/content/contact` - Get contact info
- PUT `/api/content/contact` - Update contact info (protected)
- GET `/api/content/hero` - Get hero content
- PUT `/api/content/hero` - Update hero content (protected)

### Messages
- POST `/api/messages` - Create message (public)
- GET `/api/messages` - Get all messages (protected)
- GET `/api/messages/{id}` - Get single message (protected)
- PATCH `/api/messages/{id}/read` - Mark as read (protected)
- DELETE `/api/messages/{id}` - Delete message (protected)
- GET `/api/messages/stats/unread-count` - Get unread count (protected)

### File Upload
- POST `/api/upload/image` - Upload image (protected)
- GET `/api/upload/files/{filename}` - Get uploaded file
- DELETE `/api/upload/files/{filename}` - Delete file (protected)

## Default Credentials
- **Username**: admin
- **Password**: admin123
- ⚠️ Change after first login!

## Next Action Items (Priority Order)

### P0 (Critical)
1. **Backend Testing**: Test all API endpoints with testing_agent_v3
2. **Frontend Integration**: Connect Projects, Blog, About pages to backend API
3. **Image Management**: Test file upload functionality thoroughly

### P1 (High Priority)
4. **Email Notifications**: Add email alerts for new contact messages
5. **Password Change**: Add change password functionality
6. **Rich Text Editor**: Add WYSIWYG editor for blog content
7. **Image Gallery**: Multiple images per project

### P2 (Nice to Have)
8. **Activity Logs**: Track admin actions
9. **Dashboard Analytics**: Visitor stats, popular content
10. **Backup/Export**: Export content as JSON
11. **SEO Management**: Meta tags editor for each page

## Security Features
- JWT tokens with 24-hour expiration
- Bcrypt password hashing
- Protected routes (authentication required)
- File upload validation (size, type)
- CORS enabled for frontend

## File Structure
```
/app/backend/
├── server.py (Main FastAPI app)
├── models.py (Pydantic models)
├── auth.py (JWT utilities)
├── seed_db.py (Database seeding)
├── routes/
│   ├── auth_routes.py
│   ├── project_routes.py
│   ├── blog_routes.py
│   ├── content_routes.py
│   ├── message_routes.py
│   └── upload_routes.py
└── uploads/ (Uploaded files)

/app/frontend/src/
├── services/api.js (API client)
├── context/AuthContext.jsx
├── components/ProtectedRoute.jsx
├── pages/admin/
│   ├── AdminLogin.jsx
│   ├── AdminLayout.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminProjects.jsx
│   ├── AdminBlog.jsx
│   ├── AdminContent.jsx
│   ├── AdminMessages.jsx
│   └── AdminUsers.jsx
└── pages/ (Public pages)
```
