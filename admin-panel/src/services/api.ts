const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => {
  return localStorage.getItem('adminToken') || localStorage.getItem('authToken');
};

const getHeaders = (includeAuth = false, isFormData = false) => {
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

export const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    logout: () => {
      localStorage.removeItem('adminToken');
    },
  },

  properties: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  locations: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  files: {
    upload: async (file: File, type: 'image' | 'document' = 'image') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: getHeaders(true, true),
        body: formData,
      });
      return handleResponse(response);
    },

    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/files`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    delete: async (fileId: string) => {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  blog: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  users: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  settings: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    update: async (key: string, value: any) => {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ value }),
      });
      return handleResponse(response);
    },
  },

  legal: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/legal`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/legal`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  inquiries: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getContacts: async () => {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },
};
