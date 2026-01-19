import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { Navigation } from '@/components/Navigation';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import { Building, Grid3x3, List, ArrowUpDown, MapPin, Bed, Bath, Square, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFileUrl } from '@/services/api';
import { Property } from '@/types/property';

const PropertyListItem = ({ property }: { property: Property }) => {
  const navigate = useNavigate();

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
    } else if (type === 'lease') {
      const amount = property.lease_amount || price || 0;
      return `${formatter.format(amount)} (Lease)`;
    } else {
      const formatted = formatter.format(price || minPrice || 0);
      return `${formatted} / month`;
    }
  };

  const handleContact = (action: 'rent' | 'buy') => {
    const message = `Hi, I'm interested in ${action === 'rent' ? 'renting' : 'buying'} the property: ${property.title}`;
    const whatsappNumber = property.developer_whatsapp || property.developer_phone;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/50 flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative w-full sm:w-72 h-64 sm:h-auto flex-shrink-0 overflow-hidden">
        {property.is_featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-semibold">
              Featured
            </Badge>
          </div>
        )}
        <img
          src={getFileUrl(property.images?.[0] || '') || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge
          className={`absolute bottom-3 left-3 ${
            property.type === 'sale'
              ? 'bg-primary text-primary-foreground'
              : (property.type === 'lease' ? 'bg-green-600 text-white' : 'bg-accent text-accent-foreground')
          }`}
        >
          For {property.type === 'sale' ? 'Sale' : (property.type === 'lease' ? 'Lease' : 'Rent')}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Title & Location */}
          <div>
            <h3 
              className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors cursor-pointer mb-2"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
              <span className="text-xs">{property.location}</span>
            </div>
          </div>

          {/* Price */}
          <div className='flex items-center gap-2 mb-4'>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Price:</p>
            <p className="text-md font-bold text-primary">
              {formatPrice(property.price, property.type, property.min_price, property.max_price)}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {property.bedrooms && (
              <div className="flex items-center gap-2 text-sm">
                <Bed className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2 text-sm">
                <Bath className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Baths</p>
                </div>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-2 text-sm">
                <Square className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">{(property.area / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">sqft</p>
                </div>
              </div>
            )}
            {property.developer_name && (
              <div className="flex items-center gap-2 text-sm col-span-1 hidden sm:flex">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{property.developer_name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground truncate text-xs">{property.developer_name}</p>
                  <p className="text-xs text-muted-foreground">Developer</p>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 2).map((feature) => (
                <Badge key={feature} className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 2 && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                  +{property.features.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-3 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            className="flex-1 font-semibold rounded-lg"
            onClick={() => navigate(`/property/${property.id}`)}
          >
            View Details
          </Button>
          <Button
            className="flex-1 font-semibold rounded-lg bg-primary hover:bg-primary/90"
            onClick={() => handleContact(property.type === 'sale' ? 'buy' : (property.type === 'lease' ? 'lease' as any : 'rent'))}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Inquire
          </Button>
        </div>
      </div>
    </div>
  );
};

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<IPropertyFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  useEffect(() => {
    const location = searchParams.get('location');
    const type = searchParams.get('type') as IPropertyFilters['type'];
    const property_type = searchParams.get('property_type');
    const bedrooms = searchParams.get('bedrooms');

    const initialFilters: IPropertyFilters = {};
    if (location) initialFilters.location = location;
    if (type) initialFilters.type = type;
    if (property_type) initialFilters.property_type = property_type;
    if (bedrooms) initialFilters.bedrooms = Number(bedrooms);

    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [searchParams]);

  const { data: properties, isLoading, error } = useProperties(filters);

  const sortedProperties = properties ? [...properties].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0;
  }) : properties;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header with Background Image */}
      <section className="relative w-full min-h-[200px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
          alt="Properties Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48"></div>
        <div className="absolute bottom-0 left-0 w-80  bg-primary/15 rounded-full blur-3xl -ml-40 -mb-40"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center py-8">
          <h1 className="text-3xl md:text-3xl lg:text-3xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Discover Your Dream Property
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md mb-12">
            Explore our carefully curated collection of premium properties tailored to your lifestyle
          </p>
        </div>

        {/* Filters Section - Overlaid on Image */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pb-16">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-2 border border-white/20">
            <PropertyFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header with controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {isLoading ? '...' : `${sortedProperties?.length || 0} Properties`}
              </h2>
              <p className="text-muted-foreground">
                {Object.keys(filters).length > 0 
                  ? 'Filtered results based on your preferences' 
                  : 'Browse all available properties'}
              </p>
            </div>

            {/* View Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                  <SelectTrigger className="w-40 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-16 mb-8">
              <div className="inline-block p-8 bg-destructive/10 rounded-2xl border border-destructive/20">
                <p className="text-destructive font-semibold text-lg">Failed to load properties. Please try again.</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-4'}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`bg-muted animate-pulse rounded-2xl ${viewMode === 'grid' ? 'h-96' : 'h-32'}`}></div>
              ))}
            </div>
          ) : sortedProperties && sortedProperties.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-block">
                <div className="mx-auto mb-6 p-8 bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                  <Building className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-foreground">No properties found</h3>
                <p className="text-muted-foreground text-lg max-w-md">Try adjusting your search filters or explore different locations to find your perfect property</p>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {sortedProperties?.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2'>
                  {sortedProperties?.map((property) => (
                    <PropertyListItem key={property.id} property={property} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;