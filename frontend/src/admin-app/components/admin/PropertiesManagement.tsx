import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminPropertyModal } from './AdminPropertyModal';
import { formatPrice } from '@/lib/utils';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await apiService.properties.getAll();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await apiService.properties.delete(id);
        toast.success('Property deleted');
        fetchProperties();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Properties</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all property listings</p>
        </div>
        <Button
          onClick={handleAddProperty}
          className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      <AdminPropertyModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        property={selectedProperty}
        onSaveSuccess={fetchProperties}
      />

      <div className="bg-white rounded-md shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <th className="text-left p-2 ">Title</th>
                <th className="text-left p-2 ">Type</th>
                <th className="text-left p-2 ">Location</th>
                <th className="text-left p-2 ">Price Range</th>
                <th className="text-left p-2 ">Developer Email</th>
                <th className="text-left p-2 ">Beds/Baths</th>
                <th className="text-center p-2">Featured</th>
                <th className="text-right p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-2  text-gray-900 max-w-xs truncate">
                    {property.title}
                  </td>
                  <td className="p-2">
                    <span
                      className={`p-2 rounded-full text-xs ${
                        property.type === 'sale'
                          ? 'bg-blue-100 text-blue-800'
                          : property.type === 'rent'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-2 text-gray-600 truncate max-w-[200px]" title={property.location}>
                    {property.location}
                  </td>
                  <td className="p-2  text-gray-900">
                    {formatPrice(property.price, property.type, property.min_price, property.max_price)}
                  </td>
                  <td className="p-2 text-gray-600 truncate max-w-[150px]">
                    {property.developer_email || '-'}
                  </td>
                  <td className="p-2 text-gray-600">
                    {property.bedrooms || '-'}/{property.bathrooms || '-'}
                  </td>
                  <td className="p-2 text-center">
                    {property.is_featured && <span className="text-yellow-500 text-xl">★</span>}
                  </td>
                  <td className="p-2 flex gap-3 justify-end">
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertiesManagement;
