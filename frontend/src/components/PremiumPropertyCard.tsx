import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFileUrl } from '@/services/api';
import { formatPrice } from '@/lib/utils';

interface PremiumPropertyCardProps {
  property: Property;
}

export const PremiumPropertyCard = ({ property }: PremiumPropertyCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!property.images || property.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => 
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }, 4000);

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

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-0">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {property.is_featured && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
              Featured
            </Badge>
          </div>
        )}

        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={getFileUrl(property.images[currentImageIndex]) || '/placeholder.svg'}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2.5 h-2.5 rounded-full backdrop-blur-sm transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/60'
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

        <div className="absolute top-4 right-4 z-10">
          <Badge
            className={`backdrop-blur-sm ${
              property.type === 'sale'
                ? 'bg-primary/90 text-primary-foreground'
                : 'bg-accent/90 text-accent-foreground'
            }`}
          >
            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-md font-bold text-primary">
              {formatPrice(property.price, property.type, property.min_price, property.max_price, property.lease_amount)}
            </span>
            {property.area > 0 && (
              <span className="text-sm text-muted-foreground">
                ₹{(property.price / property.area).toFixed(0)}/sqft
              </span>
            )}
          </div>

          {/* Title & Location */}
          <div>
            <h3 
              className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors cursor-pointer mb-2"
              onClick={handleViewDetails}
            >
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
            {property.bedrooms && (
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Bed className="w-5 h-5 text-primary" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {property.bedrooms}
                </div>
                <div className="text-xs text-muted-foreground">Bedrooms</div>
              </div>
            )}
            {property.bathrooms && (
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Bath className="w-5 h-5 text-primary" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {property.bathrooms}
                </div>
                <div className="text-xs text-muted-foreground">Bathrooms</div>
              </div>
            )}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Square className="w-5 h-5 text-primary" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {property.area.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">sqft</div>
            </div>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 4).map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{property.features.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Developer */}
          {property.developer_name && (
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Listed by</p>
              <p className="font-semibold text-foreground">{property.developer_name}</p>
            </div>
          )}

          {/* Action */}
          <Button
            onClick={handleViewDetails}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-3"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
