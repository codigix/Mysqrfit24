import { useState, useRef, useEffect } from 'react';
import { Heart, Home, Building2, Warehouse, DoorOpen, Square, Factory, ShoppingCart, HomeIcon, Search, KeyRound, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { apiService, getFileUrl } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
  lease_amount?: number;
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
      <Card className="bg-background overflow-hidden border  transition-all duration-300 group cursor-pointer hover:shadow-lg" onClick={handleViewDetails}>
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
    <Card className="overflow-hidden bg-background border-0 bg-background transition-all duration-500 group cursor-pointer hover:shadow-2xl hover:-translate-y-2 rounded-xl bg-white">
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
    price: formatPrice(prop.price, prop.type, prop.min_price, prop.max_price, prop.lease_amount),
    badges: [getStatus(prop.type)]
  };
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'mock-1',
    title: "Luxury Sky Apartment",
    price: 4500000,
    type: 'sale',
    property_type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    developer_name: "Urban Excellence",
  },
  {
    id: 'mock-2',
    title: "Modern Studio Flat",
    price: 15000,
    type: 'rent',
    property_type: 'flats',
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    developer_name: "City Living",
  },
  {
    id: 'mock-3',
    title: "Spacious Godown Space",
    price: 50000,
    type: 'lease',
    property_type: 'godowns',
    area: 5000,
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
    developer_name: "Logistics Pro",
  },
  {
    id: 'mock-4',
    title: "Premium Commercial Shop",
    price: 8500000,
    type: 'sale',
    property_type: 'shops',
    area: 800,
    images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'],
    developer_name: "Retail Hub",
  },
  {
    id: 'mock-5',
    title: "Elegant Row House",
    price: 12000000,
    type: 'sale',
    property_type: 'rowhouses',
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    developer_name: "Heritage Homes",
  },
  {
    id: 'mock-6',
    title: "Budget Friendly Apartment",
    price: 12000,
    type: 'rent',
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
    developer_name: "Starter Homes",
  },
  {
    id: 'mock-7',
    title: "Prime Open Land",
    price: 25000,
    type: 'lease',
    property_type: 'openland',
    area: 10000,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    developer_name: "Terra Group",
  },
  {
    id: 'mock-8',
    title: "Penthouse with View",
    price: 25000000,
    type: 'sale',
    property_type: 'apartment',
    bedrooms: 5,
    bathrooms: 5,
    area: 4500,
    images: ['https://images.unsplash.com/photo-1512918766674-ed62b979ad8e?w=800'],
    developer_name: "Skyline Developers",
  },
  {
    id: 'mock-9',
    title: "Compact Flat for Students",
    price: 8000,
    type: 'rent',
    property_type: 'flats',
    bedrooms: 1,
    bathrooms: 1,
    area: 350,
    images: ['https://images.unsplash.com/photo-1536376074432-8f6425c399a3?w=800'],
    developer_name: "Student Stays",
  },
  {
    id: 'mock-10',
    title: "Large Industrial Godown",
    price: 150000,
    type: 'lease',
    property_type: 'godowns',
    area: 15000,
    images: ['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
    developer_name: "Industrial Hub",
  },
  {
    id: 'mock-11',
    title: "Modern Row House Unit",
    price: 9500000,
    type: 'sale',
    property_type: 'rowhouses',
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800'],
    developer_name: "Classic Builders",
  },
  {
    id: 'mock-12',
    title: "Boutique Shop Space",
    price: 35000,
    type: 'rent',
    property_type: 'shops',
    area: 400,
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
    developer_name: "Vogue Estates",
  },
  {
    id: 'mock-13',
    title: "Garden View Apartment",
    price: 18000,
    type: 'rent',
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
    developer_name: "Green Acres",
  },
  {
    id: 'mock-14',
    title: "Industrial Plot",
    price: 50000000,
    type: 'sale',
    property_type: 'openland',
    area: 20000,
    images: ['https://images.unsplash.com/photo-1531973486161-5fa472f1395b?w=800'],
    developer_name: "Global Infra",
  },
  {
    id: 'mock-15',
    title: "Suburban Row House",
    price: 8000000,
    type: 'sale',
    property_type: 'rowhouses',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    developer_name: "Suburban Life",
  },
  {
    id: 'mock-16',
    title: "High Street Shop",
    price: 75000,
    type: 'lease',
    property_type: 'shops',
    area: 1200,
    images: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800'],
    developer_name: "Market Leaders",
  },
  {
    id: 'mock-17',
    title: "Cozy Studio Apartment",
    price: 5500000,
    type: 'sale',
    property_type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    images: ['https://images.unsplash.com/photo-1536376074432-8f6425c399a3?w=800'],
    developer_name: "Compact Homes",
  },
  {
    id: 'mock-18',
    title: "Executive Flat",
    price: 25000,
    type: 'rent',
    property_type: 'flats',
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
    developer_name: "Executive Living",
  },
  {
    id: 'mock-19',
    title: "Distribution Center",
    price: 200000,
    type: 'lease',
    property_type: 'godowns',
    area: 25000,
    images: ['https://images.unsplash.com/photo-1565891741441-6ad9652bb790?w=800'],
    developer_name: "Logistics Hub",
  },
  {
    id: 'mock-20',
    title: "Coastal Row House",
    price: 15000000,
    type: 'sale',
    property_type: 'rowhouses',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    developer_name: "Coastal Estates",
  }
];

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
        const apiProperties = (data.data || data || []).map(transformProperty);
        const transformedMockProperties = MOCK_PROPERTIES.map(transformProperty);
        setProperties([...transformedMockProperties, ...apiProperties]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
        setError(errorMessage);
        console.error('Error fetching properties:', err);
        // Fallback to mock data if API fails
        setProperties(MOCK_PROPERTIES.map(transformProperty));
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


      <section ref={listingsRef} className="py-16 px-4 bg-gradient-to-b from-background via-background to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">finest collection</span>
            <h2 className="text-3xl md:text-3xl font-bold mb-3 text-foreground">
              Best Listings Available
            </h2>
          </div>

          <div className="max-w-6xl mx-auto space-y-6 mb-10">
            {/* Combined Filters Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-2">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Primary Tabs - Pill Style */}
                <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto shrink-0">
                  {primaryTabs.map((tab) => {
                    const isActive = activePrimaryTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActivePrimaryTab(tab.id);
                          setActiveSubTab(subTabs[tab.id as keyof typeof subTabs][0].id);
                        }}
                        className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isActive
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub Tabs - Horizontal scrollable pills */}
                <div className="flex-1 w-full overflow-hidden">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide px-2">
                    {subTabs[activePrimaryTab as keyof typeof subTabs].map((tab) => {
                      const isActive = activeSubTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSubTab(tab.id)}
                          className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${isActive
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-gray-50 text-muted-foreground hover:bg-gray-100 border border-transparent'
                            }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* View Toggle - Compact */}
                <div className="hidden lg:flex gap-1 bg-gray-100/80 p-1 rounded-lg shrink-0">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-9 w-9 p-0 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm hover:bg-white' : 'text-muted-foreground'}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-9 w-9 p-0 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm hover:bg-white' : 'text-muted-foreground'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Info */}
            <div className="flex items-center justify-between px-2">
              <p className="text-xs text-muted-foreground">
                Found <span className="font-bold text-foreground">{filteredProperties.length}</span> luxury properties
              </p>
              <div className="lg:hidden flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-primary' : ''}>
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'text-primary' : ''}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/40">
            {loading && (
              <div className="space-y-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-gray-200 rounded-xl aspect-[4/3] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 rounded-xl h-48 animate-pulse" />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="flex flex-col justify-center items-center py-32 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
                <div className="text-red-600 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-700 font-bold text-xl mb-2">Error Loading Properties</p>
                <p className="text-red-600 text-sm mb-6">Please try again later or refresh the page</p>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold">
                  Retry Loading
                </button>
              </div>
            )}
            
            {!loading && !error && filteredProperties.length === 0 && (
              <div className="flex flex-col justify-center items-center py-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="text-blue-600 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
                <p className="text-blue-700 font-bold text-xl mb-2">No Properties Found</p>
                <p className="text-blue-600 text-sm">Try selecting a different category or property type</p>
              </div>
            )}
            
            {!loading && !error && filteredProperties.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="slick-carousel-wrapper">
                    <style>{`
                      .slick-carousel-wrapper .slick-prev,
                      .slick-carousel-wrapper .slick-next {
                        width: 48px;
                        height: 48px;
                        background: hsl(43 80% 37%);
                        border-radius: 50%;
                        z-index: 10;
                        top: 50%;
                        transform: translateY(-50%);
                        opacity: 1;
                        transition: all 0.3s ease;
                        border: none;
                        box-shadow: 0 2px 8px rgba(30, 64, 175, 0.25);
                      }
                      
                      .slick-carousel-wrapper .slick-prev:hover,
                      .slick-carousel-wrapper .slick-next:hover,
                      .slick-carousel-wrapper .slick-prev:focus,
                      .slick-carousel-wrapper .slick-next:focus {
                        background: #1e3a8a;
                        box-shadow: 0 4px 16px rgba(30, 64, 175, 0.4);
                      }
                      
                      .slick-carousel-wrapper .slick-prev::before,
                      .slick-carousel-wrapper .slick-next::before {
                        font-size: 24px;
                        color: white;
                        font-weight: bold;
                      }
                      
                      .slick-carousel-wrapper .slick-dots {
                        bottom: -50px;
                        padding: 20px 0;
                      }
                      
                      .slick-carousel-wrapper .slick-dots li {
                        margin: 0 8px;
                      }
                      
                      .slick-carousel-wrapper .slick-dots li button {
                        width: 12px;
                        height: 12px;
                        padding: 0;
                        background: #d1d5db;
                        border-radius: 50%;
                        opacity: 0.6;
                        transition: all 0.3s ease;
                        border: none;
                        cursor: pointer;
                      }
                      
                      .slick-carousel-wrapper .slick-dots li button:hover {
                        background: #9ca3af;
                        opacity: 0.8;
                      }
                      
                      .slick-carousel-wrapper .slick-dots li.slick-active button {
                        width: 32px;
                        height: 12px;
                        border-radius: 6px;
                        background: hsl(43 80% 37%);
                        opacity: 1;
                      }

                      .slick-carousel-custom .slick-list {
                        margin: 0 -12px;
                      }
                    `}</style>
                    <Slider
                      dots={true}
                      arrows={true}
                      infinite={true}
                      speed={500}
                      slidesToShow={4}
                      slidesToScroll={1}
                      autoplay={true}
                      autoplaySpeed={6000}
                      pauseOnHover={true}
                      responsive={[
                        {
                          breakpoint: 1536,
                          settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1,
                          }
                        },
                        {
                          breakpoint: 1280,
                          settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                          }
                        },
                        {
                          breakpoint: 1024,
                          settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                          }
                        },
                        {
                          breakpoint: 640,
                          settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                          }
                        }
                      ]}
                      className="slick-carousel-custom"
                    >
                      {filteredProperties.map((property) => (
                        <div key={property.id} className="px-3 pb-8">
                          <ListingCard property={property} viewMode="grid" />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProperties.slice(0, 8).map((property) => (
                      <ListingCard key={property.id} property={property} viewMode="list" />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <section className="w-full relative bg-cover bg-center bg-fixed" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop)',
      }}>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-4xl font-bold mb-2 text-white">
                Passionate About
              </h2>
              <h2 className="text-4xl md:text-4xl font-bold mb-4 text-white">
                Being Different
              </h2>
              <p className="text-sm text-white/80 italic">experience</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.id} className="border-0 bg-background shadow-card bg-background hover:shadow-lg transition-shadow overflow-hidden">
                    <CardContent className="p-5 text-center bg-white ">
                      <div className="flex justify-center mb-6">
                        <div className="w-10  h-10 rounded-full bg-amber-600 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" strokeWidth={1} />
                        </div>
                      </div>
                      <h3 className="text-md font-bold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mb-4">
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
