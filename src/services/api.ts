import { Property, PropertyFilters } from '../types/property';
import { User, AuthResponse } from '../types/auth';
import { Location } from '../types/location';
import { BlogPost } from '../types/blog';
import { SiteSetting, UploadedFile, Inquiry, ContactMessage, Testimonial, TeamMember, NewsletterSubscriber, LegalContent, ContactStats } from '../types/site';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const FILE_BASE_URL = import.meta.env.VITE_FILE_URL || 'http://localhost:5000';

export const getFileUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Ensure path starts with / if it doesn't
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${FILE_BASE_URL}${normalizedPath}`;
};

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
    const errorMessage = error.details ? `${error.error}: ${error.details}` : (error.error || 'API request failed');
    throw new Error(errorMessage);
  }
  return response.json();
};

export const apiService = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (email: string, password: string): Promise<AuthResponse> => {
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
    },

    getToken,
  },

  properties: {
    list: async (filters?: PropertyFilters): Promise<Property[]> => {
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

    getAll: async (): Promise<Property[]> => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    get: async (id: string): Promise<Property> => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<Property> => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    create: async (property: Partial<Property>): Promise<Property> => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(property),
      });
      return handleResponse(response);
    },

    update: async (id: string, property: Partial<Property>): Promise<Property> => {
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

  locations: {
    getAll: async (): Promise<Location[]> => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (data: Partial<Location>): Promise<Location> => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<Location>): Promise<Location> => {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  chatbot: {
    createInquiry: async (inquiry: Partial<Inquiry>): Promise<Inquiry> => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(inquiry),
      });
      return handleResponse(response);
    },

    getInquiries: async (): Promise<Inquiry[]> => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAllInquiries: async (): Promise<Inquiry[]> => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    deleteInquiry: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  testimonials: {
    list: async (filters?: Record<string, string | number | boolean>): Promise<Testimonial[]> => {
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

    get: async (id: string): Promise<Testimonial> => {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (testimonial: Partial<Testimonial>): Promise<Testimonial> => {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(testimonial),
      });
      return handleResponse(response);
    },

    update: async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(testimonial),
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  blog: {
    list: async (filters?: Record<string, string | number | boolean>): Promise<BlogPost[]> => {
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

    getAll: async (): Promise<BlogPost[]> => {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    get: async (id: string): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getBySlug: async (slug: string): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (post: Partial<BlogPost>): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(post),
      });
      return handleResponse(response);
    },

    update: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(post),
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  team: {
    list: async (filters?: Record<string, string | number | boolean>): Promise<TeamMember[]> => {
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

    get: async (id: string): Promise<TeamMember> => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    create: async (member: Partial<TeamMember>): Promise<TeamMember> => {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(member),
      });
      return handleResponse(response);
    },

    update: async (id: string, member: Partial<TeamMember>): Promise<TeamMember> => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(member),
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  newsletter: {
    subscribe: async (email: string, name?: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, name }),
      });
      return handleResponse(response);
    },

    unsubscribe: async (email: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    },

    getSubscribers: async (filters?: Record<string, string | number | boolean>): Promise<NewsletterSubscriber[]> => {
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

    deleteSubscriber: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  contact: {
    send: async (message: Partial<ContactMessage>): Promise<ContactMessage> => {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(message),
      });
      return handleResponse(response);
    },

    getMessages: async (filters?: Record<string, string | number | boolean>): Promise<ContactMessage[]> => {
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

    getMessage: async (id: string): Promise<ContactMessage> => {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    updateMessage: async (id: string, status: string): Promise<ContactMessage> => {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    deleteMessage: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getStats: async (): Promise<ContactStats> => {
      const response = await fetch(`${API_BASE_URL}/contact/stats`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  legal: {
    list: async (filters?: Record<string, string | number | boolean>): Promise<LegalContent[]> => {
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

    getAll: async (): Promise<LegalContent[]> => {
      const response = await fetch(`${API_BASE_URL}/legal`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    get: async (id: string): Promise<LegalContent> => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<LegalContent> => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    create: async (legalContent: Partial<LegalContent>): Promise<LegalContent> => {
      const response = await fetch(`${API_BASE_URL}/legal`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(legalContent),
      });
      return handleResponse(response);
    },

    update: async (id: string, legalContent: Partial<LegalContent>): Promise<LegalContent> => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(legalContent),
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/legal/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  users: {
    getAll: async (): Promise<User[]> => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<User>): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },

  settings: {
    getAll: async (): Promise<SiteSetting[]> => {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: getHeaders(false),
      });
      return handleResponse(response);
    },

    update: async (key: string, value: string | number | boolean | object): Promise<SiteSetting> => {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ value }),
      });
      return handleResponse(response);
    },
  },

  files: {
    upload: async (file: File, type: 'image' | 'document' = 'image'): Promise<UploadedFile> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: getHeaders(true, true),
        credentials: 'include',
        body: formData,
      });
      return handleResponse(response);
    },

    list: async (): Promise<UploadedFile[]> => {
      const response = await fetch(`${API_BASE_URL}/files`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAll: async (): Promise<UploadedFile[]> => {
      const response = await fetch(`${API_BASE_URL}/files`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    delete: async (fileId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  inquiries: {
    getAll: async (): Promise<Inquiry[]> => {
      const response = await fetch(`${API_BASE_URL}/chatbot/inquiries`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },

    getContacts: async (): Promise<ContactMessage[]> => {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    },
  },
};
