import React, { createContext, useContext, useState, useEffect } from 'react';
import { contentAPI } from '../services/api';

const SEOContext = createContext(null);

export const SEOProvider = ({ children }) => {
  const [seoSettings, setSeoSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const settings = await contentAPI.getSEOSettings();
      setSeoSettings(settings);
      
      // Inject Google Analytics if ID exists
      if (settings.google_analytics_id) {
        injectGoogleAnalytics(settings.google_analytics_id);
      }
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const injectGoogleAnalytics = (gaId) => {
    // Check if already injected
    if (document.getElementById('ga-script')) return;

    // Add Google Analytics script
    const script1 = document.createElement('script');
    script1.id = 'ga-script';
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(script2);
  };

  const updateDocumentMeta = (pageMeta) => {
    if (!seoSettings) return;

    // Update title
    const title = pageMeta.title || seoSettings.site_title;
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = pageMeta.description || seoSettings.site_description;

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seoSettings.site_keywords;

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.href;
  };

  const getStructuredData = () => {
    if (!seoSettings) return null;

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${window.location.origin}/#organization`,
          "name": seoSettings.organization_name,
          "url": window.location.origin,
          "telephone": seoSettings.organization_phone,
          "email": seoSettings.organization_email,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": seoSettings.organization_address
          }
        },
        {
          "@type": "RealEstateAgent",
          "@id": `${window.location.origin}/#realestate`,
          "name": seoSettings.organization_name,
          "url": window.location.origin,
          "telephone": seoSettings.organization_phone,
          "email": seoSettings.organization_email,
          "priceRange": "₺₺₺",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": seoSettings.organization_address
          }
        },
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          "url": window.location.origin,
          "name": seoSettings.site_title,
          "description": seoSettings.site_description,
          "publisher": {
            "@id": `${window.location.origin}/#organization`
          }
        }
      ]
    };
  };

  return (
    <SEOContext.Provider value={{ 
      seoSettings, 
      loading, 
      updateDocumentMeta, 
      getStructuredData,
      refreshSEO: loadSEOSettings 
    }}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
};
