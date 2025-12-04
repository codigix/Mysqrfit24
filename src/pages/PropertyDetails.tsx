import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '@/hooks/useProperties';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  MessageCircle,
  Star,
  Home,
  Car,
  Wifi,
  Shield,
  Trees,
  Dumbbell
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading, error } = useProperty(id!);

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
    if (!property) return;

    const message = `Hi, I'm interested in ${action === 'rent' ? 'renting' : 'buying'} the property: ${property.title} (ID: ${property.id})`;
    const whatsappNumber = property.developer_whatsapp || property.developer_phone;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getFeatureIcon = (feature: string) => {
    const iconMap: { [key: string]: any } = {
      parking: Car,
      garden: Trees,
      pool: Home,
      security: Shield,
      gym: Dumbbell,
      wifi: Wifi,
      balcony: Home,
      fireplace: Home,
    };

    return iconMap[feature.toLowerCase()] || Home;
  };

  const openLocationInMap = (lat?: number, lng?: number, address?: string) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              {property.is_featured && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              <Badge
                className={`absolute top-4 right-4 z-10 ${property.type === 'sale'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground'
                  }`}
              >
                For {property.type === 'sale' ? 'Sale' : 'Rent'}
              </Badge>

              {property.images && property.images.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {property.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${property.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-[1rem]" />
                  <CarouselNext className="absolute right-[1rem]" />
                </Carousel>
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg"
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="w-5 h-5 mr-2 cursor-pointer hover:text-primary"
                    onClick={() => openLocationInMap(property.latitude, property.longitude, property.address)} />
                  <span>{property.address}</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary">
                {formatPrice(property.price, property.type)}
              </div>

              {/* Property Details */}
              <div className="flex items-center space-x-6 text-muted-foreground">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-2" />
                  <span>{property.area.toLocaleString()} sqft</span>
                </div>
              </div>

              <Badge variant="outline" className="w-fit">
                {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
              </Badge>
            </div>

            {/* Description */}
            {property.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature) => {
                      const IconComponent = getFeatureIcon(feature);
                      return (
                        <div key={feature} className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <span className="capitalize">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Developer */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Developer</h3>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{property.developer_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {property.developer_phone}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      size="lg"
                      onClick={() => handleContact(property.type === 'sale' ? 'buy' : 'rent')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {property.type === 'rent' ? 'Inquire to Rent' : 'Inquire to Buy'}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const tel = `tel:${property.developer_phone}`;
                        window.location.href = tel;
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Developer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Property Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type:</span>
                    <span className="capitalize">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing Type:</span>
                    <span className="capitalize">For {property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span>{property.area.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <div className="flex items-center cursor-pointer" onClick={() =>
                      openLocationInMap(
                        property.latitude,
                        property.longitude,
                        property.address
                      )
                    }>
                      <MapPin
                        className="w-5 h-5 mr-2  hover:text-primary"

                      />
                      <span>{property.location}</span>
                    </div>

                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="capitalize text-white">
                      {property.status || 'Available'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;