import { useState, useRef, useEffect } from 'react';
import { Heart, Home, Building2, Warehouse, DoorOpen, Square, Factory, ShoppingCart, HomeIcon, Search, KeyRound, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { apiService, getFileUrl } from '@/services/api';

interface Property {
  id: string | number;
  title: string;
  price: number;
  min_price?: number;
  max_price?: number;
  type: 'sale' | 'rent' | 'lease';
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  developer_name?: string;
}

interface ListProperty extends Property {
  status: string;
  statusColor: string;
  size: string;
  image: string;
  agent: { name: string; avatar: string };
  propertyType: string;
  badges?: string[];
}

const primaryTabs = [
  { id: "rent", label: "Rent", icon: Home },
  { id: "sale", label: "Buy", icon: Building2 },
  { id: "lease", label: "Lease", icon: KeyRound }
];

const subTabs = {
  rent: [
    { id: "rent-all", label: "All", icon: null },
    { id: "apartments", label: "Apartments", icon: Warehouse },
    { id: "flats", label: "Flats", icon: Square },
    { id: "rowhouses", label: "Row Houses", icon: DoorOpen },
    { id: "godowns", label: "Godowns", icon: Factory },
    { id: "shops", label: "Shops", icon: ShoppingCart }
  ],
  sale: [
    { id: "sale-all", label: "All", icon: null },
    { id: "openland", label: "Open Land", icon: Warehouse },
    { id: "apartments-sale", label: "Apartments", icon: Square },
    { id: "flats-sale", label: "Flats", icon: DoorOpen },
    { id: "rowhouses-sale", label: "Row Houses", icon: Building2 },
    { id: "godowns-sale", label: "Godowns", icon: Factory },
    { id: "shops-sale", label: "Shops", icon: ShoppingCart }
  ],
  lease: [
    { id: "lease-all", label: "All", icon: null },
    { id: "openland-lease", label: "Open Land", icon: Warehouse },
    { id: "apartments-lease", label: "Apartments", icon: Square },
    { id: "flats-lease", label: "Flats", icon: DoorOpen },
    { id: "rowhouses-lease", label: "Row Houses", icon: Building2 },
    { id: "godowns-lease", label: "Godowns", icon: Factory },
    { id: "shops-lease", label: "Shops", icon: ShoppingCart }
  ]
};

const services = [
  {
    id: 1,
    title: "Sell Your Home",
    description: "We do a free evaluation to be sure you want to start selling.",
    icon: HomeIcon,
    tab: "sale"
  },
  {
    id: 2,
    title: "Buy A Home",
    description: "We do a free evaluation to be sure you want to start buying.",
    icon: Search,
    tab: "sale"
  },
  {
    id: 3,
    title: "Rent A Home",
    description: "We do a free evaluation to be sure you want to start renting.",
    icon: KeyRound,
    tab: "rent"
  },
  {
    id: 4,
    title: "Lease A Home",
    description: "We do a free evaluation to be sure you want to start leasing.",
    icon: Building2,
    tab: "lease"
  }
];

interface ListingCardProps {
  property: ListProperty;
}

const ListingCard = ({ property, viewMode = 'grid' }: ListingCardProps & { viewMode?: 'grid' | 'list' }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  if (viewMode === 'list') {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden border-0 transition-all duration-300 group cursor-pointer hover:shadow-lg" onClick={handleViewDetails}>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-0">
            {/* Image - List View */}
            <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-muted rounded-t-2xl sm:rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Status Badge - List View */}
              <Badge className={`absolute top-3 left-3 font-semibold px-3 py-1 rounded-full shadow-lg ${property.statusColor} text-white`}>
                {property.status}
              </Badge>

              {/* Heart Icon - List View */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all hover:scale-110 shadow-lg"
              >
                <Heart
                  className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>

            {/* Content - List View */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              {/* Title & Location */}
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">
                  {property.title}
                </h3>
              </div>

              {/* Price Badge - List View */}
              
                
                <p className="text-xl font-bold text-primary">{property.price}</p>
             

              {/* Details Row - List View */}
              <div className="flex flex-wrap items-center gap-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-bold text-foreground">{property.bedrooms}</span>
                    <span className="text-xs text-muted-foreground">Beds</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-bold text-foreground">{property.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Baths</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-bold text-foreground">{property.size}</span>
                </div>
              </div>

              {/* Developer & Button - List View */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="h-8 w-8 rounded-full object-cover border border-border"
                  />
                  <span className="text-xs font-semibold text-muted-foreground">{property.agent.name}</span>
                </div>
                <button
                  onClick={handleViewDetails}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 transition-all duration-500 group cursor-pointer hover:shadow-2xl hover:-translate-y-2 rounded-xl bg-white">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image - Grid View */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-t-md">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Status Badges - Grid View */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`${property.statusColor} text-white font-semibold px-3 py-1 rounded-full shadow-lg`}>
                {property.status}
              </Badge>
            </div>

            {/* Heart Icon - Grid View */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full transition-all hover:scale-110 shadow-lg"
            >
              <Heart
                className={`h-6 w-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>

            {/* Agent Avatar - Grid View */}
            <div className="absolute bottom-4 left-4">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="h-12 w-12 rounded-full border-3 border-white object-cover shadow-lg"
              />
            </div>
          </div>

          {/* Content - Grid View */}
          <div className="p-3 ">
            {/* Title */}
            <div>
              <h3 className="text-md font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors cursor-pointer mb-2">
                {property.title}
              </h3>
            </div>

            {/* Price - Enhanced Badge */}
            <div >
              
              <p className="text-md font-bold text-primary">{property.price}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {property.bedrooms > 0 && (
                <div className="bg-gray-50 p-2 rounded-xs hover:bg-gray-100 transition-colors text-center">
                  <p className="text-sm font-bold text-foreground">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
              )}
              <div className="bg-gray-50 p-2 rounded-xs hover:bg-gray-100 transition-colors text-center">
                <p className="text-sm font-bold text-foreground">{property.bathrooms}</p>
                <p className="text-xs text-muted-foreground">Baths</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-xs hover:bg-gray-100 transition-colors text-center">
                <p className="text-xs font-bold text-foreground truncate">{property.size}</p>
                <p className="text-xs text-muted-foreground">Size</p>
              </div>
            </div>

            {/* Developer Info */}
            <div className='flex items-center gap-3 mt-3'>
              <p className="text-xs text-muted-foreground font-semibold">By</p>
              <p className="text-sm font-semibold text-foreground truncate">{property.agent.name}</p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleViewDetails}
              className="w-full p-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-colors mt-2"
            >
              View Details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const transformProperty = (prop: Property): ListProperty => {
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

  const getStatusColor = (type: string) => {
    switch(type) {
      case 'sale': return 'bg-amber-600';
      case 'lease': return 'bg-blue-600';
      case 'rent': 
      default: return 'bg-amber-600';
    }
  };

  const getStatus = (type: string) => {
    switch(type) {
      case 'sale': return 'For Sale';
      case 'lease': return 'For Lease';
      case 'rent':
      default: return 'For Rent';
    }
  };

  const sizeValue = prop.area || 0;
  const bedrooms = prop.bedrooms || 0;
  const bathrooms = prop.bathrooms || 0;

  return {
    ...prop,
    status: getStatus(prop.type),
    statusColor: getStatusColor(prop.type),
    size: sizeValue > 0 ? `${sizeValue.toLocaleString()} sqm` : 'N/A',
    image: prop.images?.[0] ? getFileUrl(prop.images[0]) : getFileUrl('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop'),
    agent: {
      name: prop.developer_name || 'Agent',
      avatar: getFileUrl('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop')
    },
    propertyType: `${prop.property_type}${prop.type === 'sale' ? '-sale' : prop.type === 'lease' ? '-lease' : ''}`,
    price: formatPrice(prop.price, prop.type, prop.min_price, prop.max_price),
    badges: [getStatus(prop.type)]
  };
};

export const BestListingsSection = () => {
  const listingsRef = useRef<HTMLDivElement>(null);
  const [activePrimaryTab, setActivePrimaryTab] = useState('rent');
  const [activeSubTab, setActiveSubTab] = useState('rent-all');
  const [properties, setProperties] = useState<ListProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.properties.list();
        const transformedProperties = (data.data || data || []).map(transformProperty);
        setProperties(transformedProperties);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
        setError(errorMessage);
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const scrollToListings = (tab: string) => {
    setActivePrimaryTab(tab);
    setActiveSubTab(subTabs[tab as keyof typeof subTabs][0].id);
    
    setTimeout(() => {
      listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const filteredProperties = properties.filter(property => {
    if (property.type !== activePrimaryTab) return false;
    
    if (activeSubTab.endsWith('-all')) return true;
    
    if (activePrimaryTab === 'sale') {
      if (activeSubTab === 'openland') return property.property_type === 'openland';
      if (activeSubTab === 'apartments-sale') return property.property_type === 'apartment' || property.property_type === 'apartments';
      if (activeSubTab === 'flats-sale') return property.property_type === 'flats';
      if (activeSubTab === 'rowhouses-sale') return property.property_type === 'rowhouses';
      if (activeSubTab === 'godowns-sale') return property.property_type === 'godowns';
      if (activeSubTab === 'shops-sale') return property.property_type === 'shops';
    }
    
    if (activePrimaryTab === 'rent') {
      if (activeSubTab === 'apartments') return property.property_type === 'apartment' || property.property_type === 'apartments';
      if (activeSubTab === 'flats') return property.property_type === 'flats';
      if (activeSubTab === 'rowhouses') return property.property_type === 'rowhouses';
      if (activeSubTab === 'godowns') return property.property_type === 'godowns';
      if (activeSubTab === 'shops') return property.property_type === 'shops';
    }
    
    if (activePrimaryTab === 'lease') {
      if (activeSubTab === 'openland-lease') return property.property_type === 'openland';
      if (activeSubTab === 'apartments-lease') return property.property_type === 'apartment' || property.property_type === 'apartments';
      if (activeSubTab === 'flats-lease') return property.property_type === 'flats';
      if (activeSubTab === 'rowhouses-lease') return property.property_type === 'rowhouses';
      if (activeSubTab === 'godowns-lease') return property.property_type === 'godowns';
      if (activeSubTab === 'shops-lease') return property.property_type === 'shops';
    }
    
    return true;
  });

  return (
    <>


      <section ref={listingsRef} className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">finest</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Best Listings Available
            </h2>
          </div>

          {/* Primary Tabs */}
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActivePrimaryTab(tab.id);
                    setActiveSubTab(subTabs[tab.id as keyof typeof subTabs][0].id);
                  }}
                  className={`flex flex-col items-center gap-2 px-4 py-3 transition-all group ${activePrimaryTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-primary'
                    }`}
                >
                  {Icon && (
                    <Icon className={`h-6 w-6 transition-all ${activePrimaryTab === tab.id
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary'
                      }`} strokeWidth={1.5} />
                  )}
                  <span className={`text-sm font-medium transition-all ${activePrimaryTab === tab.id
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary'
                    }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub Tabs */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            {subTabs[activePrimaryTab as keyof typeof subTabs].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex flex-col items-center gap-2 px-3 py-2 transition-all group ${activeSubTab === tab.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                    }`}
                >
                  {Icon && (
                    <Icon className={`h-5 w-5 transition-all ${activeSubTab === tab.id
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary'
                      }`} strokeWidth={1.5} />
                  )}
                  <span className={`text-xs transition-all ${activeSubTab === tab.id
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground group-hover:text-primary'
                    }`}>
                    {tab.label}
                  </span>
                  {activeSubTab === tab.id && (
                    <div className="h-0.5 w-full bg-primary rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end mb-8">
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

          {/* Property Grid */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center items-center py-16">
              <p className="text-red-500">Error loading properties. Please try again later.</p>
            </div>
          )}
          
          {!loading && !error && filteredProperties.length === 0 && (
            <div className="flex justify-center items-center py-16">
              <p className="text-muted-foreground">No properties found in this category.</p>
            </div>
          )}
          
          {!loading && !error && filteredProperties.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-4 gap-6">
                  {filteredProperties.map((property) => (
                    <ListingCard key={property.id} property={property} viewMode="grid" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <ListingCard key={property.id} property={property} viewMode="list" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <section className="w-full min-h-screen relative bg-cover bg-center bg-fixed" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop)',
      }}>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                Passionate About
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Being Different
              </h2>
              <p className="text-lg text-white/80 italic">experience</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-20">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.id} className="border-0 shadow-card hover:shadow-lg transition-shadow overflow-hidden">
                    <CardContent className="p-8 text-center bg-white ">
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center">
                          <Icon className="h-10 w-10 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {service.description}
                      </p>
                      <button 
                        onClick={() => scrollToListings(service.tab)}
                        className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
                      >
                        Read More →
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
