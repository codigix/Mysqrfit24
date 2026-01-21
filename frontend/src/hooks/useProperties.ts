import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property, PropertyFilters } from '@/types/property';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { MOCK_PROPERTIES } from '@/constants/mockData';

export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      try {
        const response = await apiService.properties.list(filters);
        const apiData = Array.isArray(response) ? response : (response?.data || []);
        
        // Filter mock properties based on filters
        const filteredMock = MOCK_PROPERTIES.filter(p => {
          if (filters?.type && p.type !== filters.type) return false;
          if (filters?.property_type && p.property_type !== filters.property_type) return false;
          if (filters?.min_price && p.price < filters.min_price) return false;
          if (filters?.max_price && p.price > filters.max_price) return false;
          if (filters?.bedrooms && p.bedrooms !== filters.bedrooms) return false;
          return true;
        });

        return [...filteredMock, ...apiData];
      } catch (error) {
        console.error('Error fetching properties, using mock data:', error);
        return MOCK_PROPERTIES.filter(p => {
          if (filters?.type && p.type !== filters.type) return false;
          if (filters?.property_type && p.property_type !== filters.property_type) return false;
          return true;
        });
      }
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (id.startsWith('mock-')) {
        const mock = MOCK_PROPERTIES.find(p => p.id === id);
        if (mock) return mock;
      }
      return apiService.properties.get(id);
    },
    enabled: !!id,
  });
};

export const useSimilarProperties = (id: string) => {
  return useQuery({
    queryKey: ['properties', 'similar', id],
    queryFn: async () => {
      return apiService.properties.getSimilar(id);
    },
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
      return apiService.properties.create(property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Success',
        description: 'Property created successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create property',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...property }: Partial<Property> & { id: string }) => {
      return apiService.properties.update(id, property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Success',
        description: 'Property updated successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update property',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.properties.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Success',
        description: 'Property deleted successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete property',
        variant: 'destructive',
      });
    },
  });
};