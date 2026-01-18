import { useState } from 'react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash, Check, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EnhancedPropertyFormProps {
  onPropertyAdded?: () => void;
}

const AMENITIES_OPTIONS = [
  'Gym', 'Swimming Pool', 'Park', 'Parking Spaces', 'Security', 
  'Car Parking', 'Lift Service', 'Playground', 'Water Supply',
  'High-speed WiFi', 'Power Backup', 'Club Assembly', 'Balcony',
  'Garden', 'Terrace', 'Elevator', 'CCTV', 'Gated Community',
  'Intercom', 'Community Center'
];

export const EnhancedPropertyForm = ({ onPropertyAdded }: EnhancedPropertyFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    min_price: '',
    max_price: '',
    price: '',
    lease_amount: '',
    lease_duration: '',
    lease_deposit: '',
    type: 'sale' as 'sale' | 'rent' | 'lease',
    property_type: 'apartment' as string,
    bedrooms: '',
    bathrooms: '',
    area: '',
    plot_area: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    facing: '',
    flooring: '',
    parking: '',
    age: '',
    furnishing: 'unfurnished',
    developer_name: '',
    developer_email: '',
    developer_phone: '',
    developer_whatsapp: '',
    amenities: [] as string[],
    images: [] as string[],
    video_tour_url: '',
    map_virtual_tour_url: '',
    is_featured: false,
  });
  const [newImage, setNewImage] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      min_price: '',
      max_price: '',
      price: '',
      lease_amount: '',
      lease_duration: '',
      lease_deposit: '',
      type: 'sale',
      property_type: 'apartment',
      bedrooms: '',
      bathrooms: '',
      area: '',
      plot_area: '',
      location: '',
      address: '',
      latitude: '',
      longitude: '',
      facing: '',
      flooring: '',
      parking: '',
      age: '',
      furnishing: 'unfurnished',
      developer_name: '',
      developer_email: '',
      developer_phone: '',
      developer_whatsapp: '',
      amenities: [],
      images: [],
      video_tour_url: '',
      map_virtual_tour_url: '',
      is_featured: false,
    });
    setNewImage('');
  };

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!formData.title || !formData.type || !formData.property_type || !formData.location || !formData.address || !formData.developer_name || !formData.developer_phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      let minPrice = parseFloat(formData.min_price);
      let maxPrice = parseFloat(formData.max_price);
      let priceValue = parseFloat(formData.price);

      if (formData.type === 'sale') {
        if (isNaN(minPrice) || isNaN(maxPrice)) {
          toast.error('Please enter valid price range');
          setLoading(false);
          return;
        }
        priceValue = minPrice;
      } else if (formData.type === 'rent') {
        if (isNaN(priceValue)) {
          toast.error('Please enter valid rent price');
          setLoading(false);
          return;
        }
        minPrice = priceValue;
        maxPrice = priceValue;
      } else if (formData.type === 'lease') {
        const leaseAmount = parseFloat(formData.lease_amount);
        if (isNaN(leaseAmount)) {
          toast.error('Please enter valid lease amount');
          setLoading(false);
          return;
        }
        priceValue = leaseAmount;
        minPrice = leaseAmount;
        maxPrice = leaseAmount;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        min_price: minPrice,
        max_price: maxPrice,
        price: priceValue,
        type: formData.type,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        plot_area: formData.plot_area ? parseFloat(formData.plot_area) : null,
        location: formData.location,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        facing: formData.facing || null,
        flooring: formData.flooring || null,
        parking: formData.parking ? parseInt(formData.parking, 10) : null,
        age: formData.age ? parseInt(formData.age, 10) : null,
        furnishing: formData.furnishing,
        developer_name: formData.developer_name,
        developer_email: formData.developer_email || null,
        developer_phone: formData.developer_phone,
        developer_whatsapp: formData.developer_whatsapp || null,
        features: formData.amenities.length > 0 ? formData.amenities : null,
        images: formData.images.length > 0 ? formData.images : null,
        video_tour_url: formData.video_tour_url || null,
        map_virtual_tour_url: formData.map_virtual_tour_url || null,
        is_featured: formData.is_featured,
        lease_amount: formData.type === 'lease' && formData.lease_amount ? parseFloat(formData.lease_amount) : null,
        lease_duration: formData.type === 'lease' ? formData.lease_duration : null,
        lease_deposit: formData.type === 'lease' && formData.lease_deposit ? parseFloat(formData.lease_deposit) : null,
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
    <>
      <Button
        onClick={() => setShowForm(true)}
        className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg text-base py-6 px-6"
      >
        <Plus className="h-5 w-5" />
        Add Your Property
      </Button>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add Your Property</DialogTitle>
            <DialogDescription>
              Fill in all the details about your property. Required fields are marked with *
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Accordion type="single" collapsible defaultValue="basic" className="w-full">
              {/* Basic Information */}
              <AccordionItem value="basic" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  📋 Basic Information
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Luxury Apartment in City Center"
                        required
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Type *</Label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as 'sale' | 'rent' | 'lease',
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                        <option value="lease">Lease</option>
                      </select>
                    </div>
                    {formData.type === 'sale' ? (
                      <>
                        <div>
                          <Label className="font-semibold">Min Price *</Label>
                          <Input
                            type="number"
                            value={formData.min_price}
                            onChange={(e) => setFormData({ ...formData, min_price: e.target.value })}
                            placeholder="e.g. 500000"
                            required
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Max Price *</Label>
                          <Input
                            type="number"
                            value={formData.max_price}
                            onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                            placeholder="e.g. 1000000"
                            required
                          />
                        </div>
                      </>
                    ) : formData.type === 'rent' ? (
                      <div>
                        <Label className="font-semibold">Rent Price (per month) *</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g. 25000"
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <Label className="font-semibold">Lease Amount *</Label>
                          <Input
                            type="number"
                            value={formData.lease_amount}
                            onChange={(e) => setFormData({ ...formData, lease_amount: e.target.value })}
                            placeholder="e.g. 50000"
                            required
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Lease Duration *</Label>
                          <Input
                            value={formData.lease_duration}
                            onChange={(e) => setFormData({ ...formData, lease_duration: e.target.value })}
                            placeholder="e.g. 2 years"
                            required
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Lease Deposit *</Label>
                          <Input
                            type="number"
                            value={formData.lease_deposit}
                            onChange={(e) => setFormData({ ...formData, lease_deposit: e.target.value })}
                            placeholder="e.g. 100000"
                            required
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label className="font-semibold">Property Type *</Label>
                      <select
                        value={formData.property_type}
                        onChange={(e) =>
                          setFormData({ ...formData, property_type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  </div>
                  <div>
                    <Label className="font-semibold">Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Detailed description of the property..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      id="featured"
                      className="w-5 h-5"
                    />
                    <Label htmlFor="featured" className="cursor-pointer font-semibold">
                      ⭐ Mark as Featured Property
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Location & Address */}
              <AccordionItem value="location" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  📍 Location & Address
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Location *</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., New York, USA"
                        required
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Full Address *</Label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Main Street, City, State"
                        required
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Latitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        placeholder="40.7128"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Longitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        placeholder="-74.0060"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Property Details */}
              <AccordionItem value="details" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  🏠 Property Details
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Bedrooms</Label>
                      <Input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Bathrooms</Label>
                      <Input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Living Area (sqm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="2500"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Plot Area (sqm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.plot_area}
                        onChange={(e) => setFormData({ ...formData, plot_area: e.target.value })}
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Facing</Label>
                      <select
                        value={formData.facing}
                        onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Facing</option>
                        <option value="north">North</option>
                        <option value="south">South</option>
                        <option value="east">East</option>
                        <option value="west">West</option>
                        <option value="northeast">North-East</option>
                        <option value="northwest">North-West</option>
                        <option value="southeast">South-East</option>
                        <option value="southwest">South-West</option>
                      </select>
                    </div>
                    <div>
                      <Label className="font-semibold">Flooring</Label>
                      <select
                        value={formData.flooring}
                        onChange={(e) => setFormData({ ...formData, flooring: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Flooring</option>
                        <option value="marble">Marble</option>
                        <option value="tiles">Tiles</option>
                        <option value="wooden">Wooden</option>
                        <option value="concrete">Concrete</option>
                        <option value="granite">Granite</option>
                      </select>
                    </div>
                    <div>
                      <Label className="font-semibold">Parking Spaces</Label>
                      <Input
                        type="number"
                        value={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Age of Property (Years)</Label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="font-semibold">Furnishing Type</Label>
                      <select
                        value={formData.furnishing}
                        onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="unfurnished">Unfurnished</option>
                        <option value="semi-furnished">Semi-Furnished</option>
                        <option value="furnished">Furnished</option>
                      </select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Features & Amenities */}
              <AccordionItem value="amenities" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  ✨ Features & Amenities
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES_OPTIONS.map((amenity) => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-300 bg-red-50'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              isSelected ? 'text-green-700' : 'text-red-700'
                            }`}
                          >
                            {amenity}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Images */}
              <AccordionItem value="images" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  🖼️ Images (URLs)
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
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
                          setFormData({
                            ...formData,
                            images: [...formData.images, newImage],
                          });
                          setNewImage('');
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, idx) => (
                      <div
                        key={idx}
                        className="relative bg-slate-200 rounded overflow-hidden h-24 group"
                      >
                        <img
                          src={image}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Virtual Walkthrough & Video Tour */}
              <AccordionItem value="videotour" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  🎥 Video & Virtual Tour
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
                  <div>
                    <Label className="font-semibold">YouTube Video Link</Label>
                    <Input
                      value={formData.video_tour_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          video_tour_url: e.target.value,
                        })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      type="url"
                    />
                    <p className="text-sm text-gray-500 mt-2">Enter the YouTube video link for the property tour.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Map Virtual Tour */}
              <AccordionItem value="maptour" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  🗺️ Map Virtual Tour
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
                  <div>
                    <Label className="font-semibold">Map Virtual Tour URL</Label>
                    <Input
                      value={formData.map_virtual_tour_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          map_virtual_tour_url: e.target.value,
                        })
                      }
                      placeholder="https://maps.google.com/..."
                      type="url"
                    />
                    <p className="text-sm text-gray-500 mt-2">Enter the URL for your map-based virtual tour (Google Maps, Street View, or similar)</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Contact Information */}
              <AccordionItem value="contact" className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="bg-white px-4 py-3 hover:bg-gray-50 font-semibold">
                  👤 Your Information
                </AccordionTrigger>
                <AccordionContent className="bg-white p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Your Name *</Label>
                      <Input
                        value={formData.developer_name}
                        onChange={(e) =>
                          setFormData({ ...formData, developer_name: e.target.value })
                        }
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Phone Number *</Label>
                      <Input
                        value={formData.developer_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, developer_phone: e.target.value })
                        }
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Email Address</Label>
                      <Input
                        value={formData.developer_email}
                        onChange={(e) =>
                          setFormData({ ...formData, developer_email: e.target.value })
                        }
                        placeholder="your@email.com"
                        type="email"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">WhatsApp Number (Optional)</Label>
                      <Input
                        value={formData.developer_whatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            developer_whatsapp: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                disabled={loading}
              >
                {loading ? 'Adding Property...' : 'Add Property'}
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
        </DialogContent>
      </Dialog>
    </>
  );
};
