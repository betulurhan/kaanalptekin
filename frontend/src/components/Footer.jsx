import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { contentAPI } from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settings, contact] = await Promise.all([
        contentAPI.getSiteSettings(),
        contentAPI.getContact()
      ]);
      setSiteSettings(settings);
      setContactInfo(contact);
    } catch (error) {
      console.error('Failed to load footer data:', error);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            {siteSettings?.footer_logo && !logoError ? (
              <img 
                src={resolveImageUrl(siteSettings.footer_logo)} 
                alt={siteSettings?.site_name || 'Logo'} 
                className="h-12 w-auto object-contain mb-4"
                onError={() => setLogoError(true)}
              />
            ) : (
              <h3 className="text-white text-xl font-bold mb-4">
                {siteSettings?.site_name || 'Kaan Alp Tekin'}
              </h3>
            )}
            <p className="text-sm leading-relaxed">
              Antalya'da profesyonel gayrimenkul danışmanlığı, yatırım danışmanlığı ve proje koordinatörlüğü hizmetleri.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hakkimda" className="text-sm hover:text-white transition-colors">
                  Hakkımda
                </Link>
              </li>
              <li>
                <Link to="/projeler" className="text-sm hover:text-white transition-colors">
                  Projeler
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-sm hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim Bilgileri</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{contactInfo?.phone || ''}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{contactInfo?.email || ''}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{contactInfo?.address || ''}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{contactInfo?.working_hours || ''}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Bizi Takip Edin</h4>
            <div className="flex gap-3">
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {contactInfo?.linkedin && (
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {contactInfo?.twitter && (
                <a
                  href={contactInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {currentYear} {siteSettings?.site_name || 'Kaan Alp Tekin'}. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/gizlilik-politikasi" className="hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-kosullari" className="hover:text-white transition-colors">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
