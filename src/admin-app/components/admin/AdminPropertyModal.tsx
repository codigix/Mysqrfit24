import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash, Check, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdminPropertyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSaveSuccess: () => void;
}

const AMENITIES_OPTIONS = [
  'Gym', 'Swimming Pool', 'Park', 'Parking Spaces', 'Security',
  'Car Parking', 'Lift Service', 'Playground', 'Water Supply',
  'High-speed WiFi', 'Power Backup', 'Club Assembly', 'Balcony',
  'Garden', 'Terrace', 'Elevator', 'CCTV', 'Gated Community',
  'Intercom', 'Community Center'
];

export const AdminPropertyModal = ({
  isOpen,
  onOpenChange,
  property,
  onSaveSuccess,
}: AdminPropertyModalProps) => {
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
    property_type: '' as string,
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

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description || '',
        min_price: property.min_price?.toString() || '',
        max_price: property.max_price?.toString() || '',
        price: property.price.toString(),
        lease_amount: property.lease_amount?.toString() || '',
        lease_duration: property.lease_duration?.toString() || '',
        lease_deposit: property.lease_deposit?.toString() || '',
        type: property.type as 'sale' | 'rent' | 'lease',
        property_type: property.property_type,
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        plot_area: property.plot_area?.toString() || '',
        location: property.location || '',
        address: property.address || '',
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        facing: property.facing || '',
        flooring: property.flooring || '',
        parking: property.parking?.toString() || '',
        age: property.age?.toString() || '',
        furnishing: property.furnishing || 'unfurnished',
        developer_name: property.developer_name || '',
        developer_email: property.developer_email || '',
        developer_phone: property.developer_phone || '',
        developer_whatsapp: property.developer_whatsapp || '',
        amenities: Array.isArray(property.features) ? property.features : [],
        images: Array.isArray(property.images) ? property.images : [],
        video_tour_url: property.video_tour_url || '',
        map_virtual_tour_url: property.map_virtual_tour_url || '',
        is_featured: property.is_featured || false,
      });
    } else {
      resetForm();
    }
  }, [property, isOpen]);

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
      property_type: '',
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

      const missingFields = [];
      if (!formData.title?.trim()) missingFields.push('Title');
      
      if (formData.type === 'sale') {
        if (!formData.min_price) missingFields.push('Min Price');
        if (!formData.max_price) missingFields.push('Max Price');
      } else if (formData.type === 'rent') {
        if (!formData.price) missingFields.push('Rent Price');
      } else if (formData.type === 'lease') {
        if (!formData.lease_amount) missingFields.push('Lease Amount');
        if (!formData.lease_duration) missingFields.push('Lease Duration');
        if (!formData.lease_deposit) missingFields.push('Lease Deposit');
      }

      if (!formData.type) missingFields.push('Type');
      if (!formData.property_type) missingFields.push('Property Type');
      if (!formData.location?.trim()) missingFields.push('Location');
      if (!formData.address?.trim()) missingFields.push('Address');
      if (!formData.developer_name?.trim()) missingFields.push('Developer Name');
      if (!formData.developer_phone?.trim()) missingFields.push('Developer Phone');

      if (missingFields.length > 0) {
        toast.error(`Required fields missing: ${missingFields.join(', ')}`);
        setLoading(false);
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

      const payload: Partial<Property> = {
        title: formData.title,
        description: formData.description,
        min_price: minPrice,
        max_price: maxPrice,
        price: priceValue,
        type: formData.type,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        plot_area: formData.plot_area ? parseFloat(formData.plot_area) : undefined,
        location: formData.location,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        facing: formData.facing || undefined,
        flooring: formData.flooring || undefined,
        parking: formData.parking ? parseInt(formData.parking, 10) : undefined,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        furnishing: formData.furnishing,
        developer_name: formData.developer_name,
        developer_email: formData.developer_email || undefined,
        developer_phone: formData.developer_phone,
        developer_whatsapp: formData.developer_whatsapp || undefined,
        features: formData.amenities.length > 0 ? formData.amenities : undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        video_tour_url: formData.video_tour_url || undefined,
        map_virtual_tour_url: formData.map_virtual_tour_url || undefined,
        is_featured: formData.is_featured,
        lease_amount: formData.type === 'lease' && formData.lease_amount ? parseFloat(formData.lease_amount) : undefined,
        lease_duration: formData.type === 'lease' ? formData.lease_duration : undefined,
        lease_deposit: formData.type === 'lease' && formData.lease_deposit ? parseFloat(formData.lease_deposit) : undefined,
      };

      if (property) {
        await apiService.properties.update(property.id, payload);
        toast.success('Property updated successfully!');
      } else {
        await apiService.properties.create(payload);
        toast.success('Property created successfully!');
      }

      onOpenChange(false);
      resetForm();
      onSaveSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save property';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {property ? 'Edit Property' : 'Add New Property'}
          </DialogTitle>
          <DialogDescription>
            Fill in all the details about the property. Required fields are marked with *
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
                </div>
                <div className={`grid ${formData.type === 'lease' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Property Type *</Label>
                    <select
                      value={formData.property_type}
                      onChange={(e) =>
                        setFormData({ ...formData, property_type: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-md ${
                        !formData.property_type
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">-- Select Property Type --</option>
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
                        src={getFileUrl(image)}
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

            {/* Video & Virtual Tour */}
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
                👤 Contact Information
              </AccordionTrigger>
              <AccordionContent className="bg-white p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Developer/Owner Name *</Label>
                    <Input
                      value={formData.developer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, developer_name: e.target.value })
                      }
                      placeholder="Developer name"
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
                      placeholder="developer@example.com"
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
              {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
