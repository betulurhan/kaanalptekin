// Helper function to resolve image URLs
// Handles both relative URLs (from uploads) and absolute URLs (from external sources)
export const resolveImageUrl = (url) => {
  if (!url) return null;
  
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

export default resolveImageUrl;
