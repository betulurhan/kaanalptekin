import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, FolderOpen, BookOpen, Mail, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteData } from '../context/SiteDataContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteSettings } = useSiteData();
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/hakkimda', label: 'Hakkımda', icon: User },
    { path: '/projeler', label: 'Projeler', icon: FolderOpen },
    { path: '/hesaplama', label: 'Hesaplama', icon: Calculator },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/iletisim', label: 'İletişim', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
          >
            {siteSettings?.navbar_logo && !logoError ? (
              <img 
                src={resolveImageUrl(siteSettings.navbar_logo)} 
                alt={siteSettings?.site_name || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className={`text-2xl font-bold transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
                  : 'text-white'
              }`}>
                {siteSettings?.site_name || 'Kaan Alp Tekin'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-slate-800 text-white'
                    : isScrolled || !isHomePage
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled || !isHomePage
                ? 'hover:bg-slate-100'
                : 'hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-slate-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-slate-700' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dashboard Style */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-white/98 backdrop-blur-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-slate-800 text-white shadow-lg scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
