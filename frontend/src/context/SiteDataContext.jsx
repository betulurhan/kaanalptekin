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
    loaded: false,
  });
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent StrictMode double-fetch
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    contentAPI.getInit().then(res => {
      setData({
        siteSettings: res.siteSettings,
        contactInfo: res.contact,
        seoSettings: res.seoSettings,
        carousel: res.carousel || [],
        projects: res.projects || [],
        heroFeatures: res.heroFeatures,
        homeStats: res.homeStats,
        homeCTA: res.homeCTA,
        loaded: true,
      });

      // Inject Google Analytics
      if (res.seoSettings?.google_analytics_id) {
        const gaId = res.seoSettings.google_analytics_id;
        if (!document.getElementById('ga-script')) {
          const s1 = document.createElement('script');
          s1.id = 'ga-script';
          s1.async = true;
          s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(s1);
          const s2 = document.createElement('script');
          s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
          document.head.appendChild(s2);
        }
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
