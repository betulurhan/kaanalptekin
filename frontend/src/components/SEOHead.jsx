import { useEffect } from 'react';
import { useSEO } from '../context/SEOContext';

export const SEOHead = ({ title, description, type = 'website' }) => {
  const { seoSettings, updateDocumentMeta, getStructuredData } = useSEO();

  useEffect(() => {
    if (seoSettings) {
      updateDocumentMeta({ title, description });
      
      // Inject structured data
      let structuredDataScript = document.getElementById('structured-data');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.id = 'structured-data';
        structuredDataScript.type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.innerHTML = JSON.stringify(getStructuredData());
    }
  }, [seoSettings, title, description]);

  return null;
};

export default SEOHead;
