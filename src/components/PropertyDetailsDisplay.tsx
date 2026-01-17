import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  MessageCircle,
  MapIcon,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface PropertyDetailsDisplayProps {
  property: Property;
}

export const PropertyDetailsDisplay = ({ property }: PropertyDetailsDisplayProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const formatPrice = (price: number, type: string, minPrice?: number, maxPrice?: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (type === 'sale') {
      if (minPrice && maxPrice && minPrice !== maxPrice) {
        return `${formatter.format(minPrice)} - ${formatter.format(maxPrice)}`;
      }
      return formatter.format(price || minPrice || 0);
    } else {
      const formatted = formatter.format(price || minPrice || 0);
      return `${formatted} / month`;
    }
  };

  const nextImage = () => {
    if (!property.images || property.images.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === property.images!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property.images || property.images.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images!.length - 1 : prev - 1
    );
  };

  const handleContact = (action: 'rent' | 'buy') => {
    const message = `Hi, I'm interested in ${
      action === 'rent' ? 'renting' : 'buying'
    } the property: ${property.title}`;
    const whatsappNumber = property.developer_whatsapp || property.developer_phone;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      /[^0-9]/g,
      ''
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(property.developer_phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const openLocationInMap = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps?q=${property.latitude},${property.longitude}`,
        '_blank'
      );
    } else if (property.address) {
      window.open(
        `https://www.google.com/maps/search/?q=${encodeURIComponent(
          property.address
        )}`,
        '_blank'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex] || '/placeholder.svg'}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-lg">
                  {currentImageIndex + 1}/{property.images.length}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <img
            src="/placeholder.svg"
            alt={property.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {property.title}
              </h1>
              {property.is_featured && (
                <Badge className="bg-yellow-400 text-yellow-900">★ Featured</Badge>
              )}
            </div>
            <button
              onClick={openLocationInMap}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{property.location}</span>
            </button>
          </div>
          <Badge
            className={`${
              property.type === 'sale'
                ? 'bg-blue-600'
                : property.type === 'rent'
                ? 'bg-green-600'
                : 'bg-purple-600'
            } text-white text-base py-2 px-4`}
          >
            For {property.type === 'sale' ? 'Sale' : property.type === 'rent' ? 'Rent' : 'Lease'}
          </Badge>
        </div>

        <div className="text-4xl font-bold text-primary">
          {formatPrice(property.price, property.type, property.min_price, property.max_price)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Details Card */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Property Details</h3>
            <div className="space-y-3">
              {property.property_type && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-semibold capitalize">{property.property_type}</span>
                </div>
              )}
              {property.bedrooms !== null && property.bedrooms !== undefined && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bed className="w-5 h-5" />
                    Bedrooms
                  </div>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms !== null && property.bathrooms !== undefined && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bath className="w-5 h-5" />
                    Bathrooms
                  </div>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Square className="w-5 h-5" />
                    Living Area
                  </div>
                  <span className="font-semibold">{property.area.toLocaleString()} sqm</span>
                </div>
              )}
              {property.plot_area && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Square className="w-5 h-5" />
                    Plot Area
                  </div>
                  <span className="font-semibold">{property.plot_area.toLocaleString()} sqm</span>
                </div>
              )}
              {property.parking !== null && property.parking !== undefined && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Parking Spaces:</span>
                  <span className="font-semibold">{property.parking}</span>
                </div>
              )}
              {property.age !== null && property.age !== undefined && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Property Age:</span>
                  <span className="font-semibold">{property.age} Years</span>
                </div>
              )}
              {property.facing && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Facing:</span>
                  <span className="font-semibold capitalize">{property.facing}</span>
                </div>
              )}
              {property.furnishing && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Furnishing:</span>
                  <span className="font-semibold capitalize">{property.furnishing}</span>
                </div>
              )}
              {property.flooring && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Flooring:</span>
                  <span className="font-semibold capitalize">{property.flooring}</span>
                </div>
              )}
              {property.address && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold text-right">{property.address}</span>
                </div>
              )}
              {property.latitude && property.longitude && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 text-sm">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-semibold">
                      {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Contact Person</p>
                <p className="text-lg font-semibold">{property.developer_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Phone</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{property.developer_phone}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Copy phone"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {property.developer_whatsapp && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">WhatsApp</p>
                  <p className="text-lg font-semibold">{property.developer_whatsapp}</p>
                </div>
              )}
              {property.developer_email && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">Email</p>
                  <p className="text-lg font-semibold">{property.developer_email}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => window.open(`tel:${property.developer_phone}`)}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button
                  onClick={() =>
                    handleContact(
                      property.type === 'sale' ? 'buy' : 'rent'
                    )
                  }
                  className="flex-1 gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {property.description && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-sm py-1 px-3">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Map */}
      {(property.latitude || property.address) && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Location</h3>
            <Button
              onClick={openLocationInMap}
              variant="outline"
              className="w-full gap-2 py-6"
            >
              <MapIcon className="w-5 h-5" />
              View on Map
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
