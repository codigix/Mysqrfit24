const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => {
  return localStorage.getItem('authToken');
};

const getHeaders = (includeAuth = false) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
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
      localStorage.removeItem('authToken');
    },

    getToken,
  },

  properties: {
    list: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/properties?${params.toString()}`;
      const response = await fetch(url, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (property: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(property),
      });
      return handleResponse(response);
    },

    update: async (id: string, property: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(property),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  chatbot: {
    createInquiry: async (inquiry: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(inquiry),
      });
      return handleResponse(response);
    },

    getInquiries: async () => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    deleteInquiry: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  testimonials: {
    list: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/testimonials?${params.toString()}`;
      const response = await fetch(url, { headers: getHeaders(), credentials: 'include' });
      return handleResponse(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (testimonial: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(testimonial),
      });
      return handleResponse(response);
    },

    update: async (id: string, testimonial: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(testimonial),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  blog: {
    list: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/blog?${params.toString()}`;
      const response = await fetch(url, { headers: getHeaders(), credentials: 'include' });
      return handleResponse(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getBySlug: async (slug: string) => {
      const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (post: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(post),
      });
      return handleResponse(response);
    },

    update: async (id: string, post: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(post),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  team: {
    list: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/team?${params.toString()}`;
      const response = await fetch(url, { headers: getHeaders(), credentials: 'include' });
      return handleResponse(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (member: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(member),
      });
      return handleResponse(response);
    },

    update: async (id: string, member: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(member),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  newsletter: {
    subscribe: async (email: string, name?: string) => {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, name }),
      });
      return handleResponse(response);
    },

    unsubscribe: async (email: string) => {
      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    },

    getSubscribers: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/newsletter?${params.toString()}`;
      const response = await fetch(url, { headers: getHeaders(true), credentials: 'include' });
      return handleResponse(response);
    },

    deleteSubscriber: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  contact: {
    send: async (message: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(message),
      });
      return handleResponse(response);
    },

    getMessages: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/contact?${params.toString()}`;
      const response = await fetch(url, { headers: getHeaders(true), credentials: 'include' });
      return handleResponse(response);
    },

    getMessage: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    updateMessage: async (id: string, status: string) => {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    deleteMessage: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/contact/stats`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  legal: {
    list: async (filters?: Record<string, any>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_BASE_URL}/legal?${params.toString()}`;
      const response = await fetch(url, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (legalContent: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/legal`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(legalContent),
      });
      return handleResponse(response);
    },

    update: async (id: string, legalContent: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(legalContent),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  files: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        credentials: 'include',
        body: formData,
      });
      return handleResponse(response);
    },

    list: async () => {
      const response = await fetch(`${API_BASE_URL}/files`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    delete: async (fileId: string) => {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
};
