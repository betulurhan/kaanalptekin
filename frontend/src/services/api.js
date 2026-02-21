import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await axios.post(`${API}/auth/login`, { username, password });
    return response.data;
  },
  
  verify: async (token) => {
    const response = await axios.get(`${API}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  register: async (username, email, password) => {
    const response = await axios.post(`${API}/auth/register`, { username, email, password });
    return response.data;
  },
  
  getUsers: async (token) => {
    const response = await axios.get(`${API}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  deleteUser: async (token, userId) => {
    const response = await axios.delete(`${API}/auth/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Projects API
export const projectsAPI = {
  getAll: async (statusFilter = null, typeFilter = null) => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status_filter', statusFilter);
    if (typeFilter) params.append('type_filter', typeFilter);
    const response = await axios.get(`${API}/projects?${params}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API}/projects/${id}`);
    return response.data;
  },
  
  create: async (token, data) => {
    const response = await axios.post(`${API}/projects`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  update: async (token, id, data) => {
    const response = await axios.put(`${API}/projects/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  delete: async (token, id) => {
    const response = await axios.delete(`${API}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Blog API
export const blogAPI = {
  getAll: async (category = null) => {
    const params = category ? `?category=${category}` : '';
    const response = await axios.get(`${API}/blog${params}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API}/blog/${id}`);
    return response.data;
  },
  
  create: async (token, data) => {
    const response = await axios.post(`${API}/blog`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  update: async (token, id, data) => {
    const response = await axios.put(`${API}/blog/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  delete: async (token, id) => {
    const response = await axios.delete(`${API}/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Content API
export const contentAPI = {
  getAbout: async () => {
    const response = await axios.get(`${API}/content/about`);
    return response.data;
  },
  
  updateAbout: async (token, data) => {
    const response = await axios.put(`${API}/content/about`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getContact: async () => {
    const response = await axios.get(`${API}/content/contact`);
    return response.data;
  },
  
  updateContact: async (token, data) => {
    const response = await axios.put(`${API}/content/contact`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getHero: async () => {
    const response = await axios.get(`${API}/content/hero`);
    return response.data;
  },
  
  updateHero: async (token, data) => {
    const response = await axios.put(`${API}/content/hero`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getHeroFeatures: async () => {
    const response = await axios.get(`${API}/content/hero-features`);
    return response.data;
  },
  
  updateHeroFeatures: async (token, data) => {
    const response = await axios.put(`${API}/content/hero-features`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  uploadImage: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API}/upload/image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  deleteFile: async (token, filename) => {
    const response = await axios.delete(`${API}/upload/files/${filename}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Messages API
export const messagesAPI = {
  create: async (data) => {
    const response = await axios.post(`${API}/messages`, data);
    return response.data;
  },
  
  getAll: async (token, unreadOnly = false) => {
    const params = unreadOnly ? '?unread_only=true' : '';
    const response = await axios.get(`${API}/messages${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getById: async (token, id) => {
    const response = await axios.get(`${API}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  markAsRead: async (token, id) => {
    const response = await axios.patch(`${API}/messages/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  delete: async (token, id) => {
    const response = await axios.delete(`${API}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getUnreadCount: async (token) => {
    const response = await axios.get(`${API}/messages/stats/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Carousel API
export const carouselAPI = {
  getAll: async (activeOnly = true) => {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await axios.get(`${API}/carousel${params}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API}/carousel/${id}`);
    return response.data;
  },
  
  create: async (token, data) => {
    const response = await axios.post(`${API}/carousel`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  update: async (token, id, data) => {
    const response = await axios.put(`${API}/carousel/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  delete: async (token, id) => {
    const response = await axios.delete(`${API}/carousel/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
