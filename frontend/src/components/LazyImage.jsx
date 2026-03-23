import React, { useState, useEffect, useRef } from 'react';
import { resolveImageUrl, getPlaceholderUrl } from '../utils/imageUrl';

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width,
  height,
  objectFit = 'cover',
  placeholder = null,
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Resolve and optimize URL
  const optimizedSrc = resolveImageUrl(src, { width, height });
  const placeholderSrc = placeholder || getPlaceholderUrl(src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: '#f1f5f9',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Placeholder / Blur */}
      {!isLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full blur-lg scale-110"
          style={{ objectFit }}
          aria-hidden="true"
        />
      )}
      
      {/* Main Image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
          onLoad={handleLoad}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
      
      {/* Loading spinner */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
