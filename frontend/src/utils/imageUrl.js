// Helper function to resolve and optimize image URLs
// Handles Cloudinary URLs with automatic optimization
export const resolveImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  // Skip dead preview URLs from old containers
  if (url.includes('.preview.emergentagent.com/api/upload')) {
    return null;
  }
  
  // Optimize Unsplash URLs - add width/quality params
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    const w = width || 800;
    // Remove existing w= params and add optimized ones
    const cleanUrl = url.replace(/[?&]w=\d+/g, '').replace(/[?&]q=\d+/g, '');
    const sep = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${sep}w=${w}&q=75&auto=format`;
  }
  
  // If it's a Cloudinary URL, add optimizations
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    // Check if already has transformations
    if (url.includes('/upload/')) {
      const transforms = [];
      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      transforms.push(`q_${quality}`);
      transforms.push(`f_${format}`);
      
      const transformStr = transforms.join(',');
      
      // Insert transformations after /upload/
      if (!url.includes('/upload/c_') && !url.includes('/upload/w_') && !url.includes('/upload/q_')) {
        return url.replace('/upload/', `/upload/${transformStr}/`);
      }
    }
    return url;
  }
  
  // If already an absolute URL (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL (starts with /), prepend the API base URL
  if (url.startsWith('/')) {
    return `${process.env.REACT_APP_BACKEND_URL}${url}`;
  }
  
  // Otherwise return as is
  return url;
};

// Lazy loading helper - returns placeholder until image loads
export const getPlaceholderUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Return a tiny blurred version for placeholder
  return url.replace('/upload/', '/upload/w_50,q_10,e_blur:1000/');
};

// Get responsive image srcset for Cloudinary
export const getResponsiveSrcSet = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  const sizes = [400, 800, 1200, 1600];
  return sizes.map(w => {
    const optimizedUrl = url.replace('/upload/', `/upload/w_${w},q_auto,f_auto/`);
    return `${optimizedUrl} ${w}w`;
  }).join(', ');
};

export default resolveImageUrl;
