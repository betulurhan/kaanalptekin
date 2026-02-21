import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminContent from "./pages/admin/AdminContent";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminCarousel from "./pages/admin/AdminCarousel";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/hakkimda" element={<><Navbar /><About /><Footer /></>} />
            <Route path="/projeler" element={<><Navbar /><Projects /><Footer /></>} />
            <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
            <Route path="/iletisim" element={<><Navbar /><Contact /><Footer /></>} />

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
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
