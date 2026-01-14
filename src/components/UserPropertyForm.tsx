import { useState } from 'react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, X, Trash } from 'lucide-react';

interface UserPropertyFormProps {
  onPropertyAdded?: () => void;
}

export const UserPropertyForm = ({ onPropertyAdded }: UserPropertyFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sale' as 'sale' | 'rent' | 'lease',
    property_type: 'apartment' as string,
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    developer_name: '',
    developer_phone: '',
    developer_whatsapp: '',
    features: [] as string[],
    images: [] as string[],
    is_featured: false,
  });
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'sale',
      property_type: 'apartment',
      bedrooms: '',
      bathrooms: '',
      area: '',
      location: '',
      address: '',
      latitude: '',
      longitude: '',
      developer_name: '',
      developer_phone: '',
      developer_whatsapp: '',
      features: [],
      images: [],
      is_featured: false,
    });
    setNewFeature('');
    setNewImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!formData.title || !formData.price || !formData.location || !formData.address || !formData.developer_name || !formData.developer_phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        features: formData.features.length > 0 ? formData.features : null,
        images: formData.images.length > 0 ? formData.images : null,
      };

      await apiService.properties.create(payload as Record<string, unknown>);
      toast.success('Property added successfully!');
      setShowForm(false);
      resetForm();
      onPropertyAdded?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add property';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Your Property
        </Button>
      )}

      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 space-y-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Add Your Property</h3>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1 hover:bg-red-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Basic Information */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Luxury Apartment in City Center"
                    required
                  />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1000000"
                    required
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rent' | 'lease' })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
                <div>
                  <Label>Property Type</Label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="flats">Flats</option>
                    <option value="rowhouses">Row Houses</option>
                    <option value="godowns">Godowns</option>
                    <option value="shops">Shops</option>
                    <option value="openland">Open Land</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Detailed description of the property..."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Location & Address */}
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold mb-3">Location & Address</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, USA"
                    required
                  />
                </div>
                <div>
                  <Label>Address *</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                    required
                  />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold mb-3">Property Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Area (sqm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="mr-2"
                    />
                    Featured Property
                  </Label>
                </div>
              </div>
            </div>

            {/* Developer Information */}
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold mb-3">Your Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.developer_name}
                    onChange={(e) => setFormData({ ...formData, developer_name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={formData.developer_phone}
                    onChange={(e) => setFormData({ ...formData, developer_phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>WhatsApp (Optional)</Label>
                  <Input
                    value={formData.developer_whatsapp}
                    onChange={(e) => setFormData({ ...formData, developer_whatsapp: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold mb-3">Features & Amenities</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g., Living Room, Kitchen, Pool..."
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newFeature.trim()) {
                        setFormData({ ...formData, features: [...formData.features, newFeature] });
                        setNewFeature('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {feature}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            features: formData.features.filter((_, i) => i !== idx),
                          })
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold mb-3">Images (URLs)</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newImage.trim()) {
                        setFormData({ ...formData, images: [...formData.images, newImage] });
                        setNewImage('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative bg-slate-200 rounded overflow-hidden h-24">
                      <img src={image} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sticky bottom-0 bg-white p-4 border-t">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Adding...' : 'Add Property'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
