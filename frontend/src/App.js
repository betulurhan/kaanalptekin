import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hakkimda" element={<About />} />
          <Route path="/projeler" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/iletisim" element={<Contact />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
