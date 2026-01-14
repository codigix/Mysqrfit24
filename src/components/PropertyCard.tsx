import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, MessageCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Property360View } from './Property360View';
import { getFileUrl } from '@/services/api';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [show360View, setShow360View] = useState(false);

  useEffect(() => {
    if (!property.images || property.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => 
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [property.images]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.images || property.images.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === property.images!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.images || property.images.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images!.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return type === 'rent' ? `${formatted}/month` : formatted;
  };

  const handleContact = (action: 'rent' | 'buy') => {
    const message = `Hi, I'm interested in ${action === 'rent' ? 'renting' : 'buying'} the property: ${property.title}`;
    const whatsappNumber = property.developer_whatsapp || property.developer_phone;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const openLocationInMap = (lat?: number, lng?: number, address?: string) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.is_featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-semibold">
              Featured
            </Badge>
          </div>
        )}

        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={getFileUrl(property.images[currentImageIndex] || '') || '/placeholder.svg'}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1}/{property.images.length}
                </div>
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShow360View(true);
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              360°
            </Button>
          </>
        ) : (
          <img
            src="/placeholder.svg"
            alt={property.title}
            className="w-full h-full object-cover"
          />
        )}

        <Badge
          className={`absolute bottom-3 left-3 ${
            property.type === 'sale'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          }`}
        >
          For {property.type === 'sale' ? 'Sale' : 'Rent'}
        </Badge>
      </div>

      {/* Content Section */}
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Title & Location */}
          <div>
            <h3 
              className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
              onClick={handleViewDetails}
            >
              {property.title}
            </h3>
            <button 
              className="flex items-center text-muted-foreground mt-1 hover:text-primary transition-colors"
              onClick={() => openLocationInMap(property.latitude, property.longitude, property.address)}
            >
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </button>
          </div>

          {/* Price */}
          <div className="text-xl font-bold text-primary">
            {formatPrice(property.price, property.type)}
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.features.slice(0, 3).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.features.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleContact(property.type === 'sale' ? 'buy' : 'rent')}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </div>

          {/* Developer */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Developer: <span className="font-medium text-foreground">{property.developer_name}</span>
          </div>
        </div>
      </CardContent>

      <Property360View
        isOpen={show360View}
        onClose={() => setShow360View(false)}
        propertyTitle={property.title}
        imageUrl={getFileUrl(property.images?.[0] || '')}
        address={property.address}
      />
    </Card>
  );
};