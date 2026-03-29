import { useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export const SEOHead = ({ title, description, type = 'website' }) => {
  const { seoSettings } = useSiteData();

  useEffect(() => {
    if (!seoSettings) return;

    // Update title
    document.title = title || seoSettings.site_title || '';

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || seoSettings.site_description || '';

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seoSettings.site_keywords || '';

    // Update canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.href;

    // Structured data
    let structuredDataScript = document.getElementById('structured-data');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "RealEstateAgent",
          "name": seoSettings.organization_name,
          "url": window.location.origin,
          "telephone": seoSettings.organization_phone,
          "email": seoSettings.organization_email,
          "address": { "@type": "PostalAddress", "addressLocality": seoSettings.organization_address }
        },
        {
          "@type": "WebSite",
          "url": window.location.origin,
          "name": seoSettings.site_title,
          "description": seoSettings.site_description
        }
      ]
    });
  }, [seoSettings, title, description]);

  return null;
};

export default SEOHead;
