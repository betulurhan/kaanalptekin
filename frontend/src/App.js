import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { SiteDataProvider } from "./context/SiteDataContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { WhatsAppButton } from "./components/WhatsAppButton";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Hesaplama = lazy(() => import("./pages/Hesaplama"));
const GizlilikPolitikasi = lazy(() => import("./pages/GizlilikPolitikasi"));
const KullanimKosullari = lazy(() => import("./pages/KullanimKosullari"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const GuncelIlanlar = lazy(() => import("./pages/GuncelIlanlar"));
const DegerArtisi = lazy(() => import("./pages/DegerArtisi"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminCarousel = lazy(() => import("./pages/admin/AdminCarousel"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminIlceVerileri = lazy(() => import("./pages/admin/AdminIlceVerileri"));
const AdminResale = lazy(() => import("./pages/admin/AdminResale"));
const AdminForms = lazy(() => import("./pages/admin/AdminForms"));
const AdminMarketTrends = lazy(() => import("./pages/admin/AdminMarketTrends"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
  </div>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SiteDataProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<><Navbar /><Home /><Footer /><WhatsAppButton /></>} />
                <Route path="/hakkimda" element={<><Navbar /><About /><Footer /><WhatsAppButton /></>} />
                <Route path="/projeler" element={<><Navbar /><Projects /><Footer /><WhatsAppButton /></>} />
                <Route path="/projeler/:id" element={<><Navbar /><ProjectDetail /><Footer /><WhatsAppButton /></>} />
                <Route path="/guncel-ilanlar" element={<><Navbar /><GuncelIlanlar /><Footer /><WhatsAppButton /></>} />
                <Route path="/deger-artisi" element={<><Navbar /><DegerArtisi /><Footer /><WhatsAppButton /></>} />
                <Route path="/blog" element={<><Navbar /><Blog /><Footer /><WhatsAppButton /></>} />
                <Route path="/blog/:id" element={<><Navbar /><BlogDetail /><Footer /><WhatsAppButton /></>} />
                <Route path="/hesaplama" element={<><Navbar /><Hesaplama /><Footer /><WhatsAppButton /></>} />
                <Route path="/iletisim" element={<><Navbar /><Contact /><Footer /><WhatsAppButton /></>} />
                <Route path="/gizlilik-politikasi" element={<><Navbar /><GizlilikPolitikasi /><Footer /><WhatsAppButton /></>} />
                <Route path="/kullanim-kosullari" element={<><Navbar /><KullanimKosullari /><Footer /><WhatsAppButton /></>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="carousel" element={<AdminCarousel />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="seo" element={<AdminSEO />} />
                  <Route path="ilce-verileri" element={<AdminIlceVerileri />} />
                  <Route path="resale" element={<AdminResale />} />
                  <Route path="forms" element={<AdminForms />} />
                  <Route path="market-trends" element={<AdminMarketTrends />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster />
          </BrowserRouter>
        </SiteDataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
