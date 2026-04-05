import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { contentAPI } from '../services/api';

const SiteDataContext = createContext(null);

export const SiteDataProvider = ({ children }) => {
  const [data, setData] = useState({
    siteSettings: null,
    contactInfo: null,
    seoSettings: null,
    carousel: [],
    projects: [],
    heroFeatures: null,
    homeStats: null,
    homeCTA: null,
    blogPosts: [],
    aboutContent: null,
    loaded: false,
  });
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    contentAPI.getInit().then(res => {
      setData({
        siteSettings: res?.siteSettings || null,
        contactInfo: res?.contact || null,
        seoSettings: res?.seoSettings || null,
        carousel: res?.carousel || [],
        projects: res?.projects || [],
        heroFeatures: res?.heroFeatures || null,
        homeStats: res?.homeStats || null,
        homeCTA: res?.homeCTA || null,
        blogPosts: res?.blogPosts || [],
        aboutContent: res?.aboutContent || null,
        loaded: true,
      });

      // Inject Google Analytics
      const gaId = res?.seoSettings?.google_analytics_id;
      if (gaId && !document.getElementById('ga-script')) {
        const s1 = document.createElement('script');
        s1.id = 'ga-script';
        s1.async = true;
        s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(s1);
        const s2 = document.createElement('script');
        s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId.replace(/[^a-zA-Z0-9-]/g, '')}');`;
        document.head.appendChild(s2);
      }
    }).catch(err => {
      console.error('Init fetch failed:', err);
      setData(prev => ({ ...prev, loaded: true }));
    });
  }, []);

  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error('useSiteData must be used within SiteDataProvider');
  return context;
};
