import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { Location } from '@/types/location';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const LocationsManagement = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    lat: '',
    lng: '',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await apiService.locations.getAll();
      setLocations(data);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lng: formData.lng ? parseFloat(formData.lng) : undefined,
      };

      if (editingId) {
        await apiService.locations.update(editingId, payload);
        toast.success('Location updated');
      } else {
        await apiService.locations.create(payload);
        toast.success('Location created');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', image_url: '', lat: '', lng: '' });
      fetchLocations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save location');
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description || '',
      image_url: location.image_url || '',
      lat: location.lat?.toString() || '',
      lng: location.lng?.toString() || '',
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.locations.delete(id);
        toast.success('Location deleted');
        fetchLocations();
      } catch (error) {
        toast.error('Failed to delete location');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Locations</h2>
        <Button onClick={() => { setShowForm(true); setEditingId(null); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Edit Location' : 'New Location'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Downtown Area"
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Location description"
              />
            </div>
            <div className="col-span-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="uploads/images/... or https://..."
                />
                {formData.image_url && (
                  <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={getFileUrl(formData.image_url)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Latitude</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                placeholder="0.0000"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                placeholder="0.0000"
              />
            </div>
            <div className="flex gap-2 col-span-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { setShowForm(false); setEditingId(null); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div key={location.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {location.image_url && (
              <div className="h-40 w-full overflow-hidden">
                <img 
                  src={getFileUrl(location.image_url)} 
                  alt={location.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{location.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {location.description || 'No description'}
              </p>
              {location.lat && location.lng && (
                <p className="text-xs text-slate-500 mb-4">
                  Coords: {Number(location.lat).toFixed(4)}, {Number(location.lng).toFixed(4)}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(location)}
                  className="text-blue-600 hover:text-blue-800 p-2 border rounded hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="text-red-600 hover:text-red-800 p-2 border rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsManagement;
