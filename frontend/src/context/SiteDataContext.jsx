import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contentAPI } from '../services/api';

const SiteDataContext = createContext(null);

export const SiteDataProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [seoSettings, setSeoSettings] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSiteData();
  }, []);

  const loadSiteData = async () => {
    try {
      const data = await contentAPI.getSiteData();
      setSiteSettings(data.siteSettings);
      setContactInfo(data.contact);
      setSeoSettings(data.seoSettings);

      // Inject Google Analytics if ID exists
      if (data.seoSettings?.google_analytics_id) {
        injectGoogleAnalytics(data.seoSettings.google_analytics_id);
      }
    } catch (error) {
      console.error('Failed to load site data:', error);
    } finally {
      setLoaded(true);
    }
  };

  const injectGoogleAnalytics = (gaId) => {
    if (document.getElementById('ga-script')) return;
    const script1 = document.createElement('script');
    script1.id = 'ga-script';
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
    document.head.appendChild(script2);
  };

  const refresh = useCallback(() => loadSiteData(), []);

  return (
    <SiteDataContext.Provider value={{
      siteSettings,
      contactInfo,
      seoSettings,
      loaded,
      refresh
    }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
