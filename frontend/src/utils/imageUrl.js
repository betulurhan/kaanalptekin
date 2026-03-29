// Helper function to resolve and optimize image URLs
// Handles Cloudinary URLs with automatic optimization
export const resolveImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  const { width, height, quality, format } = options;
  
  // Skip dead preview URLs from old containers
  if (url.includes('.preview.emergentagent.com/api/upload')) {
    return null;
  }
  
  // Optimize Unsplash URLs - aggressive optimization with WebP
  if (url.includes('unsplash.com')) {
    const w = width || 600;
    const q = quality || 60;
    // Strip all existing params
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${w}&q=${q}&fm=webp&auto=compress`;
  }
  
  // If it's a Cloudinary URL, add optimizations
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    if (url.includes('/upload/')) {
      const transforms = [];
      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      transforms.push(`q_${quality || 'auto'}`);
      transforms.push(`f_${format || 'webp'}`);
      
      const transformStr = transforms.join(',');
      
      if (!url.includes('/upload/c_') && !url.includes('/upload/w_') && !url.includes('/upload/q_')) {
        return url.replace('/upload/', `/upload/${transformStr}/`);
      }
    }
    return url;
  }
  
  // If already an absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If relative URL, prepend API base
  if (url.startsWith('/')) {
    return `${process.env.REACT_APP_BACKEND_URL}${url}`;
  }
  
  return url;
};

// Lazy loading helper - returns placeholder until image loads
export const getPlaceholderUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_50,q_10,e_blur:1000/');
};

export default resolveImageUrl;
