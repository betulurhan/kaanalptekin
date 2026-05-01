import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, FolderOpen, BookOpen, Mail, Calculator, Tag, Instagram, TrendingUp, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteData } from '../context/SiteDataContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteSettings, contactInfo } = useSiteData();
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/hakkimda', label: 'Hakkımda', icon: User },
    { path: '/projeler', label: 'Projeler', icon: FolderOpen },
    { path: '/guncel-ilanlar', label: 'Güncel İlanlar', icon: Tag },
    { path: '/deger-artisi', label: 'Değer Artışı', icon: TrendingUp },
    { path: '/hesaplama', label: 'Hesaplama', icon: Calculator },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/iletisim', label: 'İletişim', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  // Build dynamic social media list from contactInfo
  const socialLinks = [
    { key: 'instagram', url: contactInfo?.instagram, label: 'Instagram', icon: Instagram, gradient: 'from-pink-500 via-purple-500 to-amber-500' },
    { key: 'facebook', url: contactInfo?.facebook, label: 'Facebook', icon: Facebook, gradient: 'from-blue-600 to-blue-700' },
    { key: 'youtube', url: contactInfo?.youtube, label: 'YouTube', icon: Youtube, gradient: 'from-red-500 to-red-600' },
    { key: 'linkedin', url: contactInfo?.linkedin, label: 'LinkedIn', icon: Linkedin, gradient: 'from-sky-600 to-sky-700' },
    { key: 'twitter', url: contactInfo?.twitter, label: 'Twitter', icon: Twitter, gradient: 'from-slate-700 to-slate-800' },
  ].filter(s => s.url);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isMobileMenuOpen
          ? 'bg-white shadow-md'
          : isScrolled
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
              isMobileMenuOpen || isScrolled || !isHomePage
                ? 'hover:bg-slate-100'
                : 'hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-slate-700' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay (opaque, scroll-locked) */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-white transition-opacity duration-300 z-[55] ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        data-testid="mobile-menu-overlay"
      >
        <div className="p-6 overflow-y-auto h-full pb-32">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${link.path.replace(/\//g, '-') || 'home'}`}
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

          {/* Social Media Quick Links - dynamic from admin */}
          {socialLinks.length > 0 && (
            <div className="max-w-md mx-auto mt-8" data-testid="mobile-social-links">
              <p className="text-xs uppercase tracking-wider text-slate-500 text-center mb-3 font-semibold">
                Sosyal Medya
              </p>

              {/* Featured Instagram CTA (kept for prominence) */}
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-nav-instagram"
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="font-semibold">Instagram'da Takip Et</span>
                </a>
              )}

              {/* Other social icons */}
              <div className="flex justify-center gap-3 flex-wrap">
                {socialLinks.filter(s => s.key !== 'instagram').map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.key}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label={s.label}
                      data-testid={`mobile-nav-${s.key}`}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.gradient} text-white shadow-md flex items-center justify-center hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
