import { useParams, useNavigate } from 'react-router-dom';
import { useProperty, useProperties, useSimilarProperties } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Share2,
  Heart,
  FileText,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Download,
  Facebook,
  Twitter,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  MessageSquare,
  Film,
  Map as MapIcon,
  Maximize2,
  BarChart3,
  Clock,
  Phone,
  Video,
  Waves,
  Home,
  Baby,
  Trophy,
  Dumbbell,
  Music,
  Wind,
  Flame,
  Zap,
  Droplets,
  ChefHat,
  Layout,
  Box,
  Trash2,
  Fan,
  Wifi,
  Tv,
  Monitor,
  Car,
  ShieldCheck,
  Trees,
  Flower2,
  Warehouse,
  ParkingCircle,
  ArrowUpCircle,
  Table,
  Bike,
  CircleDot
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { apiService, getFileUrl } from '@/services/api';
import { formatPrice } from '@/lib/utils';

const AMENITY_ICONS: Record<string, any> = {
  'Vitrified Tiles': Grid3x3,
  'Granite Kitchen': ChefHat,
  'Stainless Steel Sink': Droplets,
  'Branded Fittings': Star,
  'Equipped Kitchen': ChefHat,
  'Media Room': Film,
  'Gym': Dumbbell,
  'Laundry': Box,
  'Central Air': Wind,
  'Natural Gas': Flame,
  'Electricity': Zap,
  'Ventilation': Fan,
  'Heating': Flame,
  'Water': Droplets,
  'Swimming Pool': Waves,
  'Club House': Home,
  'Kids Play Area': Baby,
  'Basketball Court': Trophy,
  'Gymnasium': Dumbbell,
  'Party Lawn': Trees,
  'Back yard': Trees,
  'Pool': Waves,
  'Garage Attached': Car,
  'Chair Accessible': User,
  'Smoke detectors': ShieldCheck,
  'Elevator': ArrowUpCircle,
  'Washer and dryer': Box,
  'Fireplace': Flame,
  'WiFi': Wifi,
  'Security': ShieldCheck,
  'Parking Spaces': ParkingCircle,
  'Car Parking': Car,
  'Lift Service': ArrowUpCircle,
  'Playground': Baby,
  'Water Supply': Droplets,
  'High-speed WiFi': Wifi,
  'Power Backup': Zap,
  'Club Assembly': Home,
  'Balcony': Layout,
  'Garden': Flower2,
  'Terrace': Layout,
  'CCTV': Video,
  'Security': ShieldCheck,
  'Parking': ParkingCircle,
  'Lift': ArrowUpCircle,
  'Water': Droplets,
  'Gated Community': ShieldCheck,
  'Intercom': Phone,
  'Community Center': Home,
};

const AmenityBox = ({ name }: { name: string }) => {
  const Icon = AMENITY_ICONS[name] || Check;
  return (
    <div className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 aspect-square text-center group">
      <div className="mb-2 p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-[10px] md:text-xs font-medium text-gray-700 leading-tight">{name}</span>
    </div>
  );
};

const INTERNAL_AMENITIES = [
  'Gym', 'Lift Service', 'High-speed WiFi', 'Power Backup', 'Balcony', 
  'Terrace', 'Elevator', 'Intercom', 'Equipped Kitchen', 'Media Room', 
  'Laundry', 'Vitrified Tiles', 'Granite Kitchen', 
  'Stainless Steel Sink', 'Branded Fittings', 'Chair Accessible', 'Washer and dryer'
];

const EXTERNAL_AMENITIES = [
  'Swimming Pool', 'Park', 'Parking Spaces', 'Security', 'Car Parking', 
  'Playground', 'Water Supply', 'Club Assembly', 'Garden', 'CCTV', 
  'Gated Community', 'Community Center', 'Party Lawn', 'Back yard', 
  'Pool', 'Garage Attached', 'Basketball Court', 'Gymnasium'
];

const UTILITY_AMENITIES = [
  'Central Air', 'Natural Gas', 'Electricity', 'Ventilation', 'Heating', 'Water', 'Smoke detectors', 'Fireplace', 'WiFi'
];

const nearbyCategories = [
  { label: 'Restaurants', icon: '🍴', query: 'restaurants' },
  { label: 'Schools', icon: '🏫', query: 'schools' },
  { label: 'Hospitals', icon: '🏥', query: 'hospitals' },
  { label: 'Shopping', icon: '🛍️', query: 'shopping' },
  { label: 'Transit', icon: '🚆', query: 'transit' },
  { label: 'ATMs', icon: '🏧', query: 'atm' },
  { label: 'Parks', icon: '🌳', query: 'park' },
];

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading } = useProperty(id!);
  const { data: similarListings } = useSimilarProperties(id!);
  const { data: allProperties } = useProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTourDate, setSelectedTourDate] = useState('Dec 05');
  const [selectedTime, setSelectedTime] = useState('');
  const [tourType, setTourType] = useState('in-person');
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showWalkthroughPlayer, setShowWalkthroughPlayer] = useState(false);
  const [showMapPlayer, setShowMapPlayer] = useState(true);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const features = property?.features || [];
  
  // Selection logic for Overview (Top 5)
  const getOverviewFeatures = () => {
    if (!property) return [];
    
    const priorityGroups = [
      ['Security', 'CCTV', 'Gated Community'],
      ['Parking Spaces', 'Car Parking', 'Garage Attached', 'Parking'],
      ['Lift Service', 'Elevator', 'Lift'],
      ['Power Backup', 'Electricity'],
      ['Water Supply', 'Water']
    ];
    
    const selected: string[] = [];
    const usedIndices = new Set<number>();

    // 1. Try to pick from priority groups
    priorityGroups.forEach(group => {
      const match = features.find(f => group.some(p => f.toLowerCase() === p.toLowerCase()));
      if (match && !selected.includes(match)) {
        selected.push(match);
        const idx = features.findIndex(f => f === match);
        if (idx !== -1) usedIndices.add(idx);
      }
    });

    // 2. Fill with other features if less than 5
    if (selected.length < 5) {
      features.forEach((f, idx) => {
        if (selected.length < 5 && !usedIndices.has(idx)) {
          selected.push(f);
          usedIndices.add(idx);
        }
      });
    }

    return selected.slice(0, 5);
  };

  const overviewFeatures = getOverviewFeatures();

  const internal = features.filter(f => INTERNAL_AMENITIES.some(a => a.toLowerCase() === f.toLowerCase()));
  const external = features.filter(f => EXTERNAL_AMENITIES.some(a => a.toLowerCase() === f.toLowerCase()));
  const utility = features.filter(f => UTILITY_AMENITIES.some(a => a.toLowerCase() === f.toLowerCase()));
  const other = features.filter(f => 
    !INTERNAL_AMENITIES.some(a => a.toLowerCase() === f.toLowerCase()) && 
    !EXTERNAL_AMENITIES.some(a => a.toLowerCase() === f.toLowerCase()) && 
    !UTILITY_AMENITIES.some(a => a.toLowerCase() === f.toLowerCase())
  );

  const [sidebarInquiry, setSidebarInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [mainFormInquiry, setMainFormInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarInquiry.name || !sidebarInquiry.email || !sidebarInquiry.message) {
      toast.error('Please fill in name, email, and message');
      return;
    }

    try {
      setInquiryLoading(true);
      await apiService.contact.send({
        ...sidebarInquiry,
        property_id: id,
        subject: `Inquiry for ${property?.title}`
      });
      toast.success('Inquiry sent successfully!');
      setSidebarInquiry({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send inquiry');
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleMainFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainFormInquiry.name || !mainFormInquiry.email || !mainFormInquiry.message) {
      toast.error('Please fill in name, email, and message');
      return;
    }

    try {
      setInquiryLoading(true);
      await apiService.contact.send({
        ...mainFormInquiry,
        property_id: id,
        subject: `Schedule Tour for ${property?.title} (${tourType} on ${selectedTourDate}${selectedTime ? ' at ' + selectedTime : ''})`
      });
      toast.success('Request sent successfully!');
      setMainFormInquiry({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setInquiryLoading(false);
    }
  };
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const floorPlansRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const offset = 100;
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const getPropertyAnalysisData = () => {
    return [
      { name: 'Land Value', value: 35, color: '#3b82f6' },
      { name: 'Building Value', value: 45, color: '#8b5cf6' },
      { name: 'Improvements', value: 15, color: '#ec4899' },
      { name: 'Other', value: 5, color: '#f59e0b' },
    ];
  };

  const getPriceHistoryData = () => {
    return [
      { month: 'Jan', price: property?.price ? Math.round(property.price * 0.85) : 0 },
      { month: 'Feb', price: property?.price ? Math.round(property.price * 0.88) : 0 },
      { month: 'Mar', price: property?.price ? Math.round(property.price * 0.90) : 0 },
      { month: 'Apr', price: property?.price ? Math.round(property.price * 0.92) : 0 },
      { month: 'May', price: property?.price ? Math.round(property.price * 0.95) : 0 },
      { month: 'Jun', price: property?.price ? Math.round(property.price * 0.98) : 0 },
      { month: 'Jul', price: property?.price ? property.price : 0 },
    ];
  };

  const getSimilarProperties = () => {
    let listings = similarListings || [];
    
    // If no similar listings from dedicated endpoint, try filtering from all properties
    if (listings.length === 0 && allProperties) {
      listings = allProperties
        .filter(p => p.id !== id && (p.location?.toLowerCase().includes('pune') || p.property_type === property?.property_type))
        .slice(0, 6);
        
      // If still empty, just take any 3 properties
      if (listings.length === 0) {
        listings = allProperties.filter(p => p.id !== id).slice(0, 3);
      }
    }
    
    return listings
      .slice(0, 3)
      .map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: getFileUrl(p.images?.[0] || ''),
        beds: p.bedrooms || 0,
        baths: p.bathrooms || 0,
        area: p.area || 0,
        status: p.is_featured ? 'Featured' : (p.type === 'sale' ? 'For Sale' : 'For Rent'),
      }));
  };

  const displayReviews = property?.reviews && property.reviews.length > 0 ? property.reviews : [
    {
      id: 'def-1',
      author: 'Rahul Sharma',
      rating: 5,
      comment: 'Excellent property with great amenities. The location is perfect for families.',
      date: new Date().toISOString()
    },
    {
      id: 'def-2',
      author: 'Priya Patel',
      rating: 4,
      comment: 'Very spacious and well-maintained. The developer was very helpful throughout the process.',
      date: new Date().toISOString()
    }
  ];

  const handleViewDetails = (prop: Partial<Property>) => {
    navigate(`/property/${prop.id}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (tabsContainerRef.current) {
        const tabsPosition = tabsContainerRef.current.getBoundingClientRect().top;
        setIsTabsSticky(scrollY > 0 && tabsPosition <= 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (property.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (property.images?.length || 1) - 1 : prev - 1));
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(property.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (url.includes('google.com/maps') || url.includes('maps.google.com') || url.includes('maps.app.goo.gl')) {
      if (url.includes('embed')) return url;
      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
    }
    
    return url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Primary Tabs Navigation (always visible) */}
        <div className="flex gap-1 overflow-x-auto mb-6 pb-3 border-b border-border/50 scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', ref: overviewRef },
            { id: 'description', label: 'Description', ref: descriptionRef },
            { id: 'address', label: 'Address', ref: addressRef },
            { id: 'details', label: 'Details', ref: detailsRef },
            { id: 'features', label: 'Features', ref: featuresRef },
            { id: 'video', label: 'Video', ref: videoRef },
            { id: 'map', label: 'Map', ref: mapRef },
            { id: 'schedule', label: 'Schedule a tour', ref: scheduleRef },
            { id: 'similar', label: 'Similar Listings', ref: similarRef },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                scrollToSection(tab.ref);
              }}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Breadcrumb Navigation */}


        {/* Sticky Tabs (appears on scroll) */}
        <div
          ref={tabsContainerRef}
          className={`flex gap-2 overflow-x-auto justify-start pb-2 scrollbar-hide transition-all duration-300 ${isTabsSticky
            ? 'fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm px-4 shadow-md opacity-100 py-3'
            : 'hidden pointer-events-none'
            }`}
        >
          {[
            { id: 'overview', label: 'Overview', ref: overviewRef },
            { id: 'description', label: 'Description', ref: descriptionRef },
            { id: 'address', label: 'Address', ref: addressRef },
            { id: 'details', label: 'Details', ref: detailsRef },
            { id: 'features', label: 'Features', ref: featuresRef },
            { id: 'video', label: 'Video', ref: videoRef },
            { id: 'map', label: 'Map', ref: mapRef },
            { id: 'schedule', label: 'Schedule a tour', ref: scheduleRef },
            { id: 'similar', label: 'Similar Listings', ref: similarRef },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                scrollToSection(tab.ref);
              }}
              className={`px-1 py-1 text-md whitespace-nowrap flex  border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  mb-8">
          {/* Left - Main Banner Image */}
          <div className="relative  overflow-hidden bg-white h-96 group">
            <img
              src={getFileUrl(property.images?.[0] || '') || '/placeholder.svg'}
              alt="Property"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 flex gap-2">
              {property.is_featured && (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </Badge>
              )}
              <Badge className={property.type === 'sale' ? 'bg-yellow-600' : 'bg-accent'}>
                {property.type === 'sale' ? 'For Sale' : 'For Rent'}
              </Badge>
            </div>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Right - Photo Grid */}
          <div className="grid grid-cols-2">
            {property.images?.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="relative  overflow-hidden bg-white h-48 cursor-pointer group"
              >
                <img
                  src={getFileUrl(image)}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
            ))}

            {/* See all photos overlay on last grid item */}
            {property.images && property.images.length > 4 && (
              <div
                onClick={() => setShowPhotosModal(true)}
                className="relative  overflow-hidden bg-white h-48 cursor-pointer group bg-black/20"
              >
                <img
                  src={getFileUrl(property.images[4])}
                  alt="More photos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-xl font-semibold">See all {property.images.length}</p>
                    <p className="text-sm">photos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Photos Modal/Carousel */}
        {showPhotosModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-background  max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Close button */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">All Photos ({property.images?.length || 0})</h2>
                <button
                  onClick={() => setShowPhotosModal(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Carousel */}
              <div className="flex-1 overflow-y-auto">
                <div className="relative h-96 bg-white flex items-center justify-center">
                  <img
                    src={getFileUrl(property.images?.[currentImageIndex] || '') || '/placeholder.svg'}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {property.images?.length || 1}
                  </div>
                </div>

                {/* Thumbnail grid */}
                <div className="p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {property.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square  overflow-hidden border-2 transition-colors ${currentImageIndex === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                        }`}
                    >
                      <img src={image} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={overviewRef}>
          <div className="flex items-center gap-2 text-sm mb-4 text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">{property.property_type}</button>
            <span>/</span>
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">For {property.type === 'rent' ? 'Rent' : (property.type === 'lease' ? 'Lease' : 'Sale')}</button>
            <span>/</span>
            <span className="text-foreground font-semibold">{property.title}</span>
          </div>

          {/* Header with Title, Price and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 pb-6 border-b">
            <div>
              <div className="flex gap-2 mb-3">
                <Badge className={property.type === 'sale' ? 'bg-yellow-600 hover:bg-yellow-700' : (property.type === 'lease' ? 'bg-green-600 hover:bg-green-700' : 'bg-accent hover:bg-accent/80')}>
                  {property.type === 'sale' ? 'For Sale' : (property.type === 'lease' ? 'For Lease' : 'For Rent')}
                </Badge>
                <Badge variant="outline" className="capitalize">{property.property_type}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
            </div>
            <div className="text-right">
              {property.area && (
                <p className="text-sm text-muted-foreground mb-1">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format((property.min_price || property.price) / property.area)} per sqft
                </p>
              )}
              <p className="text-3xl font-bold text-primary mb-4">
                {formatPrice(property.price, property.type, property.min_price, property.max_price, property.lease_amount)}
              </p>
              <div className="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  className="gap-2 bg-white text-muted-foreground hover:text-white transition-colors text-xs border-0"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: property.title,
                        text: property.description,
                        url: window.location.href
                      }).catch(() => {
                        const text = `${property.title} - ${window.location.href}`;
                        navigator.clipboard.writeText(text);
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-white text-muted-foreground hover:text-white transition-colors text-xs border-0"
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  Favorite
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-white text-muted-foreground hover:text-white transition-colors text-xs border-0"
                  onClick={() => window.print()}
                >
                  <FileText className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Section */}


          {/* Quick Stats Grid */}



          {/* Thumbnail Strip */}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-3">

            <Card className="border-0 shadow-card bg-white overflow-hidden mb-6">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Updated On:</p>
                    <p className="font-semibold text-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-semibold text-foreground capitalize">{property.property_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property ID</p>
                    <p className="font-semibold text-foreground">{property.propertyId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Bed className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.bedrooms || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Bedrooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Bath className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.bathrooms || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Bathrooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Car className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.parking || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Parking</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Maximize2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.area || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Living Area (sqm)</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Square className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.plot_area || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Plot Area (sqm)</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.age || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Age (Years)</p>
                  </div>
                </div>

                {/* Top 5 Priority Features */}
                {overviewFeatures.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {overviewFeatures.map((name) => {
                        const Icon = AMENITY_ICONS[name] || Check;
                        return (
                          <div key={name} className="flex flex-col items-center p-3 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center group">
                            <div className="mb-2 p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-[10px] md:text-xs font-medium text-gray-700 leading-tight">{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div ref={descriptionRef}>
              <Accordion type="multiple" defaultValue={["description", "address", "details", "features", "walkthrough", "map", "virtualtour", "calculator", "statistics", "schedule", "reviews"]} className="space-y-2">
                <AccordionItem value="description" className="  px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Description</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </AccordionContent>
                </AccordionItem>

                <div ref={addressRef} />
                <AccordionItem value="address" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Address</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Full Address</p>
                        <p className="font-semibold text-foreground text-lg">{property.address}</p>
                      </div>
                      
                      {property.location && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Location / Area</p>
                          <p className="font-semibold text-foreground">{property.location}</p>
                        </div>
                      )}
                      
                      {property.latitude && property.longitude && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Coordinates</p>
                          <p className="font-mono text-sm text-foreground">{Number(property.latitude).toFixed(4)}, {Number(property.longitude).toFixed(4)}</p>
                        </div>
                      )}
                      
                      <Button 
                        className="gap-2 bg-foreground text-white hover:bg-foreground/90 w-full"
                        onClick={() => {
                          const lat = property.latitude;
                          const lng = property.longitude;
                          const mapsUrl = (lat && lng) 
                            ? `https://maps.google.com/?q=${lat},${lng}`
                            : `https://maps.google.com/?q=${encodeURIComponent(property.address || '')}`;
                          window.open(mapsUrl, '_blank');
                        }}
                      >
                        <MapIcon className="h-4 w-4" />
                        Open In Google Maps
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <div ref={detailsRef} />
                <AccordionItem value="details" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Grid3x3 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Property Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Property ID</span>
                        <span className="font-semibold text-foreground">{property.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Property Type</span>
                        <span className="font-semibold text-foreground capitalize">{property.property_type}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Listing Type</span>
                        <span className="font-semibold text-foreground capitalize">{property.type}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className="font-semibold text-foreground capitalize">{property.status || 'Available'}</span>
                      </div>
                      {property.type === 'lease' ? (
                        <>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Lease Amount</span>
                            <span className="font-semibold text-foreground">
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.lease_amount || 0)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Lease Duration</span>
                            <span className="font-semibold text-foreground">{property.lease_duration || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Lease Deposit</span>
                            <span className="font-semibold text-foreground">
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.lease_deposit || 0)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="font-semibold text-foreground">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price)}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                        <span className="font-semibold text-foreground">{property.bedrooms || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                        <span className="font-semibold text-foreground">{property.bathrooms || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Living Area</span>
                        <span className="font-semibold text-foreground">{property.area ? `${property.area} sqm` : '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Plot Area</span>
                        <span className="font-semibold text-foreground">{property.plot_area ? `${property.plot_area} sqm` : '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Parking Spaces</span>
                        <span className="font-semibold text-foreground">{property.parking || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Property Age</span>
                        <span className="font-semibold text-foreground">{property.age ? `${property.age} Years` : '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Facing</span>
                        <span className="font-semibold text-foreground capitalize">{property.facing || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Furnishing</span>
                        <span className="font-semibold text-foreground capitalize">{property.furnishing || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Flooring</span>
                        <span className="font-semibold text-foreground capitalize">{property.flooring || '-'}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <div ref={featuresRef} />
                <AccordionItem value="features" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Features & Amenities</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-10 py-6 px-2">
                      {internal.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg text-foreground mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            Internal Amenities
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {internal.map((item) => (
                              <AmenityBox key={item} name={item} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {external.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg text-foreground mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            External Amenities
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {external.map((item) => (
                              <AmenityBox key={item} name={item} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {utility.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg text-foreground mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            Utilities & Others
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {utility.map((item) => (
                              <AmenityBox key={item} name={item} />
                            ))}
                          </div>
                        </div>
                      )}

                      {other.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg text-foreground mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            Other Features
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {other.map((item) => (
                              <AmenityBox key={item} name={item} />
                            ))}
                          </div>
                        </div>
                      )}

                      {(!property.features || property.features.length === 0) && (
                        <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-200">
                          <Star className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No specific features listed for this property.</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <div ref={mapRef} />
                <AccordionItem value="map" className="px-6 bg-white rounded-lg ">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MapIcon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Map Location & Explore Nearby</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {(property.map_virtual_tour_url || property.address) ? (
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {property.address && (
                            <div className="flex-1">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                {property.address}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                             <Button 
                              variant="outline"
                              size="sm"
                              className="gap-2 text-xs"
                              onClick={() => {
                                if (property.latitude && property.longitude) {
                                  window.open(`https://www.google.com/maps/dir//${property.latitude},${property.longitude}`, '_blank');
                                } else {
                                  window.open(`https://www.google.com/maps/dir//${encodeURIComponent(property.address || '')}`, '_blank');
                                }
                              }}
                            >
                              📍 Directions
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="gap-2 text-xs"
                              onClick={() => {
                                if (property.latitude && property.longitude) {
                                  window.open(`https://www.google.com/maps/@${property.latitude},${property.longitude},0a,75y`, '_blank');
                                } else {
                                  window.open(`https://www.google.com/maps/search/${encodeURIComponent(property.address || '')}/@0,0,0a,0d`, '_blank');
                                }
                              }}
                            >
                              🛰️ Satellite
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide">
                          {nearbyCategories.map((cat) => (
                            <Button
                              key={cat.label}
                              variant="ghost"
                              size="sm"
                              className="whitespace-nowrap gap-2 rounded-full border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-xs"
                              onClick={() => {
                                const q = (property.latitude && property.longitude)
                                  ? `${cat.query}+near+${property.latitude},${property.longitude}`
                                  : `${cat.query}+near+${encodeURIComponent(property.address || '')}`;
                                window.open(`https://www.google.com/maps/search/${q}`, '_blank');
                              }}
                            >
                              <span>{cat.icon}</span>
                              {cat.label}
                            </Button>
                          ))}
                        </div>

                        <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-slate-200" style={{ height: '500px' }}>
                          <iframe
                            title="Map Location"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={
                              property.map_virtual_tour_url 
                                ? getEmbedUrl(property.map_virtual_tour_url) 
                                : (property.latitude && property.longitude)
                                  ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&z=16&hl=en`
                                  : `https://maps.google.com/maps?q=${encodeURIComponent(property.address || 'India')}&output=embed&z=14&hl=en`
                            }
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                          
                          <div className="absolute bottom-4 left-4 right-4">
                            <Button 
                              className="w-full shadow-lg gap-2 bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
                              onClick={() => {
                                if (property.map_virtual_tour_url) {
                                  window.open(property.map_virtual_tour_url, '_blank');
                                } else if (property.latitude && property.longitude) {
                                  window.open(`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=16`, '_blank');
                                } else if (property.address) {
                                  window.open(`https://www.google.com/maps/search/${encodeURIComponent(property.address)}`, '_blank');
                                }
                              }}
                            >
                              <MapIcon className="h-4 w-4" />
                              View Full Screen on Google Maps
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-96 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                        <p className="text-muted-foreground">No map location available</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <div ref={videoRef} />
                <AccordionItem value="virtualtour" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Film className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Video Tour</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {property.video_tour_url ? (
                      <div className="space-y-4">
                        <div className="relative h-96 bg-black rounded-xl overflow-hidden">
                          <iframe
                            title="Video Tour"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={getEmbedUrl(property.video_tour_url)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Watch our professional video tour of the property.
                        </p>
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center bg-muted rounded-xl">
                        <p className="text-muted-foreground">No video tour available for this property.</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <div ref={scheduleRef} />
                <AccordionItem value="schedule" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Schedule a tour</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <img
                          src={getFileUrl(property.images[0] || '')}
                          alt="Property"
                          className="w-full h-96 rounded-lg object-cover"
                        />
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <button className="text-muted-foreground hover:text-foreground">
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="flex gap-4">
                              {[
                                { day: 'Thu', date: '04', month: 'Dec' },
                                { day: 'Fri', date: '05', month: 'Dec' },
                                { day: 'Sat', date: '06', month: 'Dec' },
                                { day: 'Sun', date: '07', month: 'Dec' },
                                { day: 'Mon', date: '08', month: 'Dec' },
                                { day: 'Tue', date: '09', month: 'Dec' },
                              ].map((item) => {
                                const dateStr = `${item.month} ${item.date}`;
                                const isSelected = selectedTourDate === dateStr;
                                return (
                                  <div 
                                    key={dateStr}
                                    className="text-center cursor-pointer group"
                                    onClick={() => setSelectedTourDate(dateStr)}
                                  >
                                    <p className={`text-sm ${isSelected ? 'text-amber-700 font-bold' : 'text-muted-foreground'}`}>{item.day}</p>
                                    <p className={`text-lg font-semibold ${isSelected ? 'text-amber-700' : 'text-foreground'}`}>{item.date}</p>
                                    <p className={`text-sm ${isSelected ? 'text-amber-700 font-bold' : 'text-muted-foreground'}`}>{item.month}</p>
                                  </div>
                                );
                              })}
                            </div>
                            <button className="text-muted-foreground hover:text-foreground">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Please select the time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                              <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                              <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                              <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className={`flex-1 gap-2 border ${tourType === 'in-person' ? 'bg-foreground text-white' : 'bg-white border-foreground text-foreground hover:bg-gray-50'}`}
                            onClick={() => setTourType('in-person')}
                          >
                            <User className="h-4 w-4" />
                            In Person
                          </Button>
                          <Button 
                            className={`flex-1 gap-2 border ${tourType === 'video-chat' ? 'bg-foreground text-white' : 'bg-white border-muted-foreground text-muted-foreground hover:bg-gray-50'}`}
                            onClick={() => setTourType('video-chat')}
                          >
                            <Video className="h-4 w-4" />
                            Video Chat
                          </Button>
                        </div>

                        <div className='grid grid-cols-2 mb-4 gap-2'>
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Your Name</label>
                            <Input 
                              placeholder="Your Name" 
                              className="bg-gray-50"
                              value={mainFormInquiry.name}
                              onChange={(e) => setMainFormInquiry({...mainFormInquiry, name: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Your Email</label>
                            <Input 
                              type="email" 
                              placeholder="Your Email" 
                              className="bg-gray-50"
                              value={mainFormInquiry.email}
                              onChange={(e) => setMainFormInquiry({...mainFormInquiry, email: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Your Phone</label>
                            <Input 
                              type="tel" 
                              placeholder="Your Phone" 
                              className="bg-gray-50"
                              value={mainFormInquiry.phone}
                              onChange={(e) => setMainFormInquiry({...mainFormInquiry, phone: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Message</label>
                            <textarea
                              placeholder={` message`}
                              className="w-full p-2 border border-input rounded-md bg-gray-50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              rows={1}
                              value={mainFormInquiry.message}
                              onChange={(e) => setMainFormInquiry({...mainFormInquiry, message: e.target.value})}
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                          onClick={handleMainFormSubmit}
                          disabled={inquiryLoading}
                        >
                          {inquiryLoading ? 'Sending...' : 'Send Email'}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Property Reviews</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 py-4">
                      {displayReviews.map((review: any) => (
                        <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-foreground">{review.author}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                          <p className="text-xs text-gray-400">{new Date(review.date || review.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>


            <div ref={similarRef}>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Similar Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSimilarProperties().length > 0 ? (
                  getSimilarProperties().map((prop) => (
                    <Card key={prop.id} className="overflow-hidden border-0 transition-all duration-300 group cursor-pointer " onClick={() => handleViewDetails(prop)}>
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Image */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={prop.image}
                              alt={prop.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Status Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge className="bg-blue-600 text-white font-semibold px-3 py-1">
                                {prop.status}
                              </Badge>
                            </div>

                            {/* Heart Icon */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFavorited(!isFavorited);
                              }}
                              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                            >
                              <Heart
                                className={`h-6 w-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                              />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-md font-bold text-primary">
                                ₹{prop.price?.toLocaleString()}
                              </p>
                              <p className="text-md font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {prop.title}
                              </p>
                            </div>

                            {/* Details */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {prop.beds > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="font-semibold text-foreground">{prop.beds}</span>
                                  <span>Beds</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs">
                                <span className="font-semibold text-foreground">{prop.baths}</span>
                                <span>Baths</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="font-semibold text-foreground">{prop.area}</span>
                                <span>sq.ft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-muted/30 rounded-md border border-dashed">
                    <Home className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No similar properties found in this area.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Agent Contact Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="w-20 h-20 mx-auto mb-3 shadow-md border-2 border-primary/10">
                      <AvatarImage 
                        src={property.developer_avatar ? getFileUrl(property.developer_avatar) : ''} 
                        alt={property.developer_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                        {property.developer_name?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold text-foreground">{property.developer_name}</h3>
                    <p className="text-sm text-muted-foreground">{property.property_type === 'apartment' ? 'Real Estate Agent' : 'Property Manager'}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                      <User className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Contact</p>
                        <p className="text-sm font-semibold truncate">{property.developer_name}</p>
                      </div>
                    </div>

                    <a href={`tel:${property.developer_phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-white/80 transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-semibold">{property.developer_phone}</p>
                      </div>
                    </a>

                    <a href={`mailto:${property.developer_email}`} className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-white/80 transition-colors">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-semibold break-all">{property.developer_email}</p>
                      </div>
                    </a>

                    {property.developer_whatsapp && (
                      <a href={`https://wa.me/${property.developer_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-white/80 transition-colors">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">WhatsApp</p>
                          <p className="text-sm font-semibold">{property.developer_whatsapp}</p>
                        </div>
                      </a>
                    )}
                  </div>

                  <form className="space-y-4 " onSubmit={handleSidebarSubmit}>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={sidebarInquiry.name}
                        onChange={(e) => setSidebarInquiry({...sidebarInquiry, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={sidebarInquiry.email}
                        onChange={(e) => setSidebarInquiry({...sidebarInquiry, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Phone</label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={sidebarInquiry.phone}
                        onChange={(e) => setSidebarInquiry({...sidebarInquiry, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Message</label>
                      <textarea 
                        placeholder="I'm interested in this property..." 
                        rows={4} 
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        value={sidebarInquiry.message}
                        onChange={(e) => setSidebarInquiry({...sidebarInquiry, message: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <Button 
                      className="w-full gap-2"
                      type="submit"
                      disabled={inquiryLoading}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {inquiryLoading ? 'Sending...' : 'Send Enquiry'}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs text-muted-foreground text-center mb-3">Share Property</p>
                    <div className="flex gap-2 justify-center">
                      <button onClick={shareOnFacebook} className="flex-1 py-2 px-3 bg-white hover:bg-white/80 rounded-lg transition-colors flex items-center justify-center">
                        <Facebook className="h-4 w-4" />
                      </button>
                      <button onClick={shareOnTwitter} className="flex-1 py-2 px-3 bg-white hover:bg-white/80 rounded-lg transition-colors flex items-center justify-center">
                        <Twitter className="h-4 w-4" />
                      </button>
                      <button onClick={copyShareLink} className="flex-1 py-2 px-3 bg-white hover:bg-white/80 rounded-lg transition-colors flex items-center justify-center">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
