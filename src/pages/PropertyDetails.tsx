import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '@/hooks/useProperties';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  Video
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const mockPropertyData: { [key: string]: any } = {
  '1': {
    id: '1',
    title: 'Luxury Apartment in City Center',
    price: 1000000,
    type: 'sale',
    property_type: 'apartment',
    address: '123 Sunset Avenue, Napa Valley, CA',
    location: 'Napa Valley',
    city: 'Napa Valley',
    bedrooms: 2,
    bathrooms: 5,
    area: 29000,
    description: 'Beautiful luxury apartment with modern amenities. Perfect for a growing family with spacious rooms and excellent natural lighting. This property features high-end finishes, smart home technology, and premium fixtures throughout.',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['garage', 'garden', 'pool', 'security', 'wifi', 'balcony'],
    is_featured: true,
    status: 'Available',
    developer_name: 'John Smith',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'john.smith@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    latitude: 38.2975,
    longitude: -122.2869,
    propertyId: '72',
    rooms: 5,
    garages: 2,
    yearBuilt: 2002,
    lotSize: 9820,
    reviews: [
      { id: 1, author: 'Sarah Johnson', rating: 5, comment: 'Absolutely beautiful property! The photos do not do it justice. Highly recommend!', date: '2024-06-15' },
      { id: 2, author: 'Mike Davis', rating: 5, comment: 'Outstanding location and amazing amenities. Great investment!', date: '2024-05-20' }
    ]
  },
  '2': {
    id: '2',
    title: 'Modern Home For Sale',
    price: 7750000,
    type: 'sale',
    property_type: 'apartment',
    address: '456 Oak Street, San Francisco, CA',
    location: 'San Francisco',
    city: 'San Francisco',
    bedrooms: 5,
    bathrooms: 6,
    area: 4500,
    description: 'Stunning modern apartment with panoramic city views. Features contemporary design, smart home technology, and premium finishes.',
    images: [
      'https://images.unsplash.com/photo-1576941089067-2de3dd663161?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1576941089067-2de3dd663161?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['garage', 'gym', 'wifi', 'security', 'balcony'],
    is_featured: true,
    status: 'Available',
    developer_name: 'Sarah Johnson',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'sarah@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    latitude: 37.7749,
    longitude: -122.4194,
    propertyId: '73',
    rooms: 8,
    garages: 3,
    yearBuilt: 2018,
    lotSize: 5500,
    reviews: []
  },
  '3': {
    id: '3',
    title: 'Spacious Home For Sale',
    price: 8000000,
    type: 'sale',
    property_type: 'house',
    address: '789 Maple Drive, Los Angeles, CA',
    location: 'Los Angeles',
    city: 'Los Angeles',
    bedrooms: 2,
    bathrooms: 4,
    area: 5500,
    description: 'Luxurious spacious home with high-end finishes and premium location.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['pool', 'garden', 'security', 'fireplace', 'wifi'],
    is_featured: false,
    status: 'Available',
    developer_name: 'Mike Davis',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'mike@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    latitude: 34.0522,
    longitude: -118.2437,
    propertyId: '74',
    rooms: 4,
    garages: 2,
    yearBuilt: 2015,
    lotSize: 7200,
    reviews: []
  },
  '4': {
    id: '4',
    title: 'Modern Penthouse Apartment',
    price: 200000,
    type: 'rent',
    property_type: 'apartment',
    address: '321 Downtown Plaza, New York, NY',
    location: 'New York',
    city: 'New York',
    bedrooms: 2,
    bathrooms: 2.5,
    area: 2500,
    description: 'Stunning penthouse apartment with breathtaking views of the skyline.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576941089067-2de3dd663161?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['gym', 'wifi', 'security', 'balcony'],
    is_featured: true,
    status: 'Available',
    developer_name: 'Emma Wilson',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'emma@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    latitude: 40.7128,
    longitude: -74.0060,
    propertyId: '75',
    rooms: 3,
    garages: 1,
    yearBuilt: 2020,
    lotSize: 1500,
    reviews: []
  },
  '5': {
    id: '5',
    title: 'Luxury Villa',
    price: 12000000,
    type: 'sale',
    property_type: 'villa',
    address: '555 Hilltop Lane, Malibu, CA',
    location: 'Malibu',
    city: 'Malibu',
    bedrooms: 4,
    bathrooms: 3,
    area: 6500,
    description: 'Spectacular luxury villa with ocean views, private beach access, and world-class amenities.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['pool', 'garden', 'security', 'gym', 'fireplace'],
    is_featured: true,
    status: 'Available',
    developer_name: 'Robert Brown',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'robert@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    latitude: 34.0195,
    longitude: -118.6919,
    propertyId: '76',
    rooms: 6,
    garages: 3,
    yearBuilt: 2010,
    lotSize: 12000,
    reviews: []
  },
  '6': {
    id: '6',
    title: 'Cozy Studio Apartment',
    price: 120000,
    type: 'rent',
    property_type: 'studio',
    address: '654 College Avenue, Boston, MA',
    location: 'Boston',
    city: 'Boston',
    bedrooms: 1,
    bathrooms: 1,
    area: 3500,
    description: 'Charming studio apartment perfect for students or young professionals.',
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['wifi', 'security'],
    is_featured: false,
    status: 'Available',
    developer_name: 'Lisa Anderson',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'lisa@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    latitude: 42.3601,
    longitude: -71.0589,
    propertyId: '77',
    rooms: 2,
    garages: 0,
    yearBuilt: 2008,
    lotSize: 900,
    reviews: []
  },
  '7': {
    id: '7',
    title: 'Commercial Office Space',
    price: 500000,
    type: 'rent',
    property_type: 'commercial',
    address: '999 Business Park, Austin, TX',
    location: 'Austin',
    city: 'Austin',
    bedrooms: 0,
    bathrooms: 2,
    area: 12000,
    description: 'Premium commercial office space in prime business district.',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['security', 'wifi', 'parking'],
    is_featured: false,
    status: 'Available',
    developer_name: 'James Martinez',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'james@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    latitude: 30.2672,
    longitude: -97.7431,
    propertyId: '78',
    rooms: 10,
    garages: 4,
    yearBuilt: 2012,
    lotSize: 15000,
    reviews: []
  },
  '8': {
    id: '8',
    title: 'Retail Shop Downtown',
    price: 350000,
    type: 'rent',
    property_type: 'shop',
    address: '888 Main Street, Seattle, WA',
    location: 'Seattle',
    city: 'Seattle',
    bedrooms: 0,
    bathrooms: 1,
    area: 8000,
    description: 'High-traffic retail location perfect for boutiques and specialty shops.',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1585399543128-47f1d4f1b8a7?w=600&h=600&fit=crop',
    videoThumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/AjJcVMtxMo0',
    features: ['security', 'parking'],
    is_featured: false,
    status: 'Available',
    developer_name: 'Patricia Lee',
    developer_phone: '+1 206-741-0340',
    developer_whatsapp: '+1 206-741-0340',
    developer_email: 'patricia@realestate.com',
    developer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    latitude: 47.6062,
    longitude: -122.3321,
    propertyId: '79',
    rooms: 5,
    garages: 2,
    yearBuilt: 2014,
    lotSize: 5000,
    reviews: []
  },
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mockProperty = mockPropertyData[id || '1'];
  const { data: dbProperty } = useProperty(id!);
  const property = mockProperty || dbProperty;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTourDate, setSelectedTourDate] = useState('');
  const [tourType, setTourType] = useState('in-person');
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showWalkthroughPlayer, setShowWalkthroughPlayer] = useState(false);
  const [showMapPlayer, setShowMapPlayer] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const virtualTourRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const floorPlansRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return type === 'rent' ? `${formatted}/month` : formatted;
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
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
    return [
      {
        id: '1',
        title: 'Luxury Villa with Pool',
        price: property?.price ? Math.round(property.price * 0.95) : 500000,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
        beds: property?.bedrooms || 3,
        baths: property?.bathrooms || 2,
        area: property?.area || 2000,
        status: 'Featured',
      },
      {
        id: '2',
        title: 'Modern Apartment',
        price: property?.price ? Math.round(property.price * 1.05) : 550000,
        image: 'https://images.unsplash.com/photo-1576941089067-2de3dd663161?w=400&h=300&fit=crop',
        beds: (property?.bedrooms || 3) - 1,
        baths: property?.bathrooms || 2,
        area: (property?.area || 2000) - 200,
        status: 'For Sale',
      },
      {
        id: '2',
        title: 'Modern Apartment',
        price: property?.price ? Math.round(property.price * 1.05) : 550000,
        image: 'https://images.unsplash.com/photo-1576941089067-2de3dd663161?w=400&h=300&fit=crop',
        beds: (property?.bedrooms || 3) - 1,
        baths: property?.bathrooms || 2,
        area: (property?.area || 2000) - 200,
        status: 'For Sale',
      },
    ];
  };

  const handleViewDetails = (prop: any) => {
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
    
    return url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}


        <div
          ref={tabsContainerRef}
          className={`flex gap-2 overflow-x-auto justify-between pb-2 scrollbar-hide  transition-all duration-300 ${isTabsSticky
            ? 'fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm px-4 shadow-sm  opacity-100 py-2'
            : 'hidden pointer-events-none mb-6'
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
            { id: 'virtualTour', label: 'Virtual Tour', ref: virtualTourRef },
            { id: 'calculator', label: 'Calculator', ref: calculatorRef },
            { id: 'floorPlans', label: 'Floor Plans', ref: floorPlansRef },
            { id: 'statistics', label: 'Statistics', ref: statisticsRef },
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
              src={property.images?.[0] || '/placeholder.svg'}
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
                {property.type === 'sale' ? 'Sold' : 'For Rent'}
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
                  src={image}
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
                  src={property.images[4]}
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
                    src={property.images?.[currentImageIndex] || '/placeholder.svg'}
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
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">For {property.type === 'rent' ? 'Rent' : 'Sale'}</button>
            <span>/</span>
            <span className="text-foreground font-semibold">{property.title}</span>
          </div>

          {/* Header with Title, Price and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 pb-6 border-b">
            <div>
              <div className="flex gap-2 mb-3">
                <Badge className={property.type === 'sale' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-accent hover:bg-accent/80'}>
                  {property.type === 'sale' ? 'For Sale' : 'For Rent'}
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
              <p className="text-sm text-muted-foreground mb-1">${(property.price / property.area).toFixed(0)} per sqft</p>
              <p className="text-3xl font-bold text-primary mb-4">${(property.price / 1000000).toFixed(1)}M</p>
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
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Bed className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.bedrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Bedrooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.rooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Rooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Bath className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.bathrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Bathrooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Square className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.garages}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Garages</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Maximize2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{(property.area / 1000).toFixed(1)}K</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Property Size</p>
                  </div>
                  <div className="col-span-2 flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">{property.yearBuilt}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Year Built</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div ref={descriptionRef}>
              <Accordion type="multiple" defaultValue={["description", "address", "details", "features", "walkthrough", "map", "virtualtour", "calculator", "statistics", "schedule"]} className="space-y-2">
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

                <AccordionItem value="address" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Address</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Address</p>
                        <p className="font-semibold text-foreground">{property.address}</p>
                        <p className="text-sm text-muted-foreground mt-4 mb-2">State/County</p>
                        <p className="font-semibold text-foreground">California</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">City</p>
                        <p className="font-semibold text-foreground">{property.city}</p>
                        <p className="text-sm text-muted-foreground mt-4 mb-2">Zip</p>
                        <p className="font-semibold text-foreground">98107</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Area</p>
                        <p className="font-semibold text-foreground">{property.location}</p>
                        <p className="text-sm text-muted-foreground mt-4 mb-2">Country</p>
                        <p className="font-semibold text-foreground">United States</p>
                      </div>
                    </div>
                    <Button 
                      className="gap-2 bg-foreground text-white hover:bg-foreground/90"
                      onClick={() => {
                        const lat = property.latitude || 40.7128;
                        const lng = property.longitude || -74.0060;
                        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                        window.open(mapsUrl, '_blank');
                      }}
                    >
                      <MapIcon className="h-4 w-4" />
                      Open In Google Maps
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="details" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Grid3x3 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Property Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Property Id</p>
                        <p className="font-semibold text-foreground">{property.propertyId}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="font-semibold text-foreground">${(property.price / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Price Info</p>
                        <p className="font-semibold text-foreground">${(property.price / property.area).toFixed(0)} per sqft</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Property Size</p>
                        <p className="font-semibold text-foreground">{(property.area / 1000).toFixed(1)}K ft²</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Property Lot Size</p>
                        <p className="font-semibold text-foreground">{(property.lotSize / 1000).toFixed(1)}K ft²</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Rooms</p>
                        <p className="font-semibold text-foreground">{property.rooms}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                        <p className="font-semibold text-foreground">{property.bedrooms}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Bathrooms</p>
                        <p className="font-semibold text-foreground">{property.bathrooms}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Custom ID</p>
                        <p className="font-semibold text-foreground">147</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Year Built</p>
                        <p className="font-semibold text-foreground">{property.yearBuilt}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Garages</p>
                        <p className="font-semibold text-foreground">{property.garages}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Garage Size</p>
                        <p className="font-semibold text-foreground">2 cars</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Available from</p>
                        <p className="font-semibold text-foreground">2021-09-22</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Basement</p>
                        <p className="font-semibold text-foreground">cement</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">External Construction</p>
                        <p className="font-semibold text-foreground">No</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Exterior Material</p>
                        <p className="font-semibold text-foreground">wood</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Roofing</p>
                        <p className="font-semibold text-foreground">No</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Structure Type</p>
                        <p className="font-semibold text-foreground">Brick</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Floors No</p>
                        <p className="font-semibold text-foreground">1</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                        <p className="font-semibold capitalize text-foreground">{property.property_type}</p>
                      </div>
                      <div className='flex gap-3'>
                        <p className="text-sm text-muted-foreground mb-1">Status</p>
                        <p className="font-semibold text-foreground">{property.status}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Features & Amenities</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Interior Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Equipped Kitchen</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Media Room</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Gym</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Laundry</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Outdoor Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Back yard</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Hot Bath</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Basketball court</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Pool</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Garage Attached</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Utilities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Central Air</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Natural Gas</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Electricity</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Ventilation</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Heating</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Water</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Other Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Chair Accessible</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Smoke detectors</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Elevator</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Washer and dryer</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">Fireplace</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-foreground">WiFi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="walkthrough" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Maximize2 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">360° Virtual Walkthrough</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {property.virtual_walkthrough_url ? (
                      <div className="space-y-4">
                        {showWalkthroughPlayer ? (
                          <div className="relative h-96 bg-black rounded-xl overflow-hidden">
                            <iframe
                              title="360° Virtual Walkthrough"
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              src={getEmbedUrl(property.virtual_walkthrough_url)}
                              allowFullScreen
                            ></iframe>
                            <button
                              onClick={() => setShowWalkthroughPlayer(false)}
                              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                              Close
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="relative h-80 bg-muted rounded-xl overflow-hidden group mb-6 cursor-pointer" onClick={() => setShowWalkthroughPlayer(true)}>
                              <img
                                src={property.videoThumbnail}
                                alt="360° Virtual Tour Thumbnail"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <PlayCircle className="h-20 w-20 text-white group-hover:scale-110 transition-transform" />
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              Explore the property in stunning detail with our interactive 360-degree virtual tour.
                            </p>
                            <Button 
                              className="gap-2 w-full bg-primary hover:bg-primary/90"
                              onClick={() => setShowWalkthroughPlayer(true)}
                            >
                              <PlayCircle className="h-4 w-4" />
                              Open 360° Virtual Walkthrough
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative h-80 bg-muted rounded-xl overflow-hidden group mb-6">
                        <img
                          src={property.videoThumbnail}
                          alt="360° Virtual Tour Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <PlayCircle className="h-20 w-20 text-white group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="map" className="px-6 bg-white rounded-lg ">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MapIcon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Map Virtual Tour</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {property.map_virtual_tour_url ? (
                      <div className="space-y-4">
                        <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                          <iframe
                            title="Map Virtual Tour"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={showMapPlayer ? property.map_virtual_tour_url : ''}
                            allowFullScreen
                          ></iframe>
                          {!showMapPlayer && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer" onClick={() => setShowMapPlayer(true)}>
                              <Button 
                                className="gap-2 bg-primary hover:bg-primary/90"
                              >
                                <MapIcon className="h-4 w-4" />
                                Load Map
                              </Button>
                            </div>
                          )}
                          {showMapPlayer && (
                            <button
                              onClick={() => setShowMapPlayer(false)}
                              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                              Close
                            </button>
                          )}
                        </div>
                        <Button 
                          variant="outline"
                          className="gap-2 w-full"
                          onClick={() => window.open(property.map_virtual_tour_url, '_blank')}
                        >
                          <MapIcon className="h-4 w-4" />
                          Open in New Tab
                        </Button>
                      </div>
                    ) : (
                      <div className="h-96 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                        <p className="text-muted-foreground">No map virtual tour available</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="virtualtour" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Film className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Video Tour</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="relative h-80 bg-muted rounded-xl overflow-hidden">
                        <img
                          src={property.videoThumbnail}
                          alt="Video Tour Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer" onClick={() => {
                          const modal = document.createElement('div');
                          modal.innerHTML = `
                            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                              <iframe width="90%" height="90%" frameborder="0" src="${property.videoUrl}?autoplay=1" allow="autoplay" style="border-radius: 8px;"></iframe>
                            </div>
                          `;
                          document.body.appendChild(modal);
                          modal.addEventListener('click', () => modal.remove());
                        }}>
                          <PlayCircle className="h-20 w-20 text-white hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Watch our professional video tour of the property.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="calculator" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Calculator</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Principal and Interest', value: 387.72 },
                                { name: 'Property Tax', value: 100 },
                                { name: 'HOA fee', value: 25 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                            >
                              <Cell fill="#1e40af" />
                              <Cell fill="#0ea5e9" />
                              <Cell fill="#f87171" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-4">
                          <p className="text-3xl font-bold text-foreground">$512.72</p>
                          <p className="text-sm text-muted-foreground">per month</p>
                        </div>
                        <div className="flex gap-6 mt-4 text-sm flex-wrap justify-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-900 rounded-full"></div>
                            <span className="text-foreground">Principal and Interest</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                            <span className="text-foreground">Property Tax</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <span className="text-foreground">HOA fee</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Home Price</label>
                          <Input type="number" defaultValue="100000" placeholder="Home Price" className="bg-gray-50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">Down Payment</label>
                            <Input type="number" defaultValue="20000" placeholder="Down Payment" className="bg-gray-50" />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">Down Payment %</label>
                            <Input type="number" defaultValue="20" placeholder="%" className="bg-gray-50" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Term (in years)</label>
                          <Input type="number" defaultValue="30" placeholder="Term" className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Interest Rate</label>
                          <Input type="number" defaultValue="4.125" placeholder="Interest" className="bg-gray-50" step="0.01" />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Property Tax</label>
                          <Input type="number" defaultValue="125" placeholder="Property Tax" className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Homeowners Association Fee</label>
                          <Input type="number" defaultValue="0" placeholder="HOA Fee" className="bg-gray-50" />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="statistics" className="px-6 bg-white rounded-lg">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Statistics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Nov 20, 2025', views: 4.9 },
                            { name: 'Nov 21, 2025', views: 4.8 },
                            { name: 'Nov 22, 2025', views: 4.7 },
                            { name: 'Nov 23, 2025', views: 5.9 },
                            { name: 'Nov 24, 2025', views: 5.95 },
                            { name: 'Nov 25, 2025', views: 4.5 },
                            { name: 'Nov 26, 2025', views: 4.3 },
                            { name: 'Nov 27, 2025', views: 4.2 },
                            { name: 'Nov 28, 2025', views: 4.1 },
                            { name: 'Nov 29, 2025', views: 4.0 },
                            { name: 'Nov 30, 2025', views: 4.2 },
                            { name: 'Dec 1, 2025', views: 5.0 },
                            { name: 'Dec 2, 2025', views: 5.0 },
                            { name: 'Dec 3, 2025', views: 4.8 }
                          ]}
                          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            domain={[4.0, 6.0]}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                            label={{ value: 'Property Views', position: 'top' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="views" fill="#d1d5db" name="Property Views" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>

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
                          src={property.images[0]}
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
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Thu</p>
                                <p className="text-lg font-semibold text-foreground">04</p>
                                <p className="text-sm text-muted-foreground">Dec</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Fri</p>
                                <p className="text-lg font-semibold text-amber-700">05</p>
                                <p className="text-sm text-muted-foreground">Dec</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Sat</p>
                                <p className="text-lg font-semibold text-foreground">06</p>
                                <p className="text-sm text-muted-foreground">Dec</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Sun</p>
                                <p className="text-lg font-semibold text-foreground">07</p>
                                <p className="text-sm text-muted-foreground">Dec</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Mon</p>
                                <p className="text-lg font-semibold text-foreground">08</p>
                                <p className="text-sm text-muted-foreground">Dec</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Tue</p>
                                <p className="text-lg font-semibold text-foreground">09</p>
                                <p className="text-sm text-muted-foreground">Dec</p>
                              </div>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <Select>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Please select the time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="09:00">09:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="14:00">02:00 PM</SelectItem>
                              <SelectItem value="15:00">03:00 PM</SelectItem>
                              <SelectItem value="16:00">04:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1 gap-2 bg-white border border-foreground text-foreground hover:bg-gray-50">
                            <User className="h-4 w-4" />
                            In Person
                          </Button>
                          <Button className="flex-1 gap-2 bg-white border border-muted-foreground text-muted-foreground hover:bg-gray-50">
                            <Video className="h-4 w-4" />
                            Video Chat
                          </Button>
                        </div>

                        <div className='grid grid-cols-2 mb-4 gap-2'>
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Your Name</label>
                            <Input placeholder="Your Name" className="bg-gray-50" />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Your Email</label>
                            <Input type="email" placeholder="Your Email" className="bg-gray-50" />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Your Phone</label>
                            <Input type="tel" placeholder="Your Phone" className="bg-gray-50" />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Message</label>
                            <textarea
                              placeholder={` massege`}
                              className="w-full p-2 border border-input rounded-md bg-gray-50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              rows={1}
                            />
                          </div>
                        </div>

                        <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white">
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>


            <div ref={similarRef}>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Similar Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSimilarProperties().map((prop) => (
                  <Card className="overflow-hidden border-0 transition-all duration-300 group cursor-pointer " onClick={() => handleViewDetails(prop)}>
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
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Agent Contact Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <img
                      src={property.developer_avatar}
                      alt={property.developer_name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                    />
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

                    <a href={`https://wa.me/${property.developer_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-white/80 transition-colors">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">WhatsApp</p>
                        <p className="text-sm font-semibold">{property.developer_whatsapp}</p>
                      </div>
                    </a>
                  </div>

                  <form className="space-y-4 ">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Your Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                      <input type="email" placeholder="john@example.com" className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Phone</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Message</label>
                      <textarea placeholder="I'm interested in this property..." rows={4} className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                    </div>
                    <Button className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Send Inquiry
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
