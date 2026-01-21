import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, MapPin, Home, Bed, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFileUrl, apiService } from '@/services/api';
import { SiteSetting } from '@/types/site';
import { Location } from '@/types/location';
import '../styles/typewriter.css';

interface LocationGroup {
  label: string;
  locations: Location[];
}

const PUNE_AREAS = {
  north: ['Hinjewadi', 'Talegaon', 'Mahalunge', 'Chakan', 'Khed', 'Dehu Road'],
  south: ['Hadapsar', 'Magarpatta', 'Warje', 'Kothrud', 'Bibvewadi', 'Vitthalwadi'],
  east: ['Viman Nagar', 'Dhanori', 'Moshi', 'Wagholi', 'Manjri', 'Lohegaon'],
  west: ['Aundh', 'Bavdhan', 'Pashan', 'Katraj', 'Dhankawadi', 'Wanowrie']
};

const PROPERTY_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'land', label: 'Land' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'flats', label: 'Flats' },
  { value: 'bungalow', label: 'Bungalows' },
  { value: 'commercial', label: 'Commercial' },
];

const BEDROOM_OPTIONS = [
  { value: '1', label: '1+ BHK' },
  { value: '2', label: '2+ BHK' },
  { value: '3', label: '3+ BHK' },
  { value: '4', label: '4+ BHK' },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationGroup[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const bedroomsRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef('The Finest Napa\'s\nReal Estate Properties');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, locationsData] = await Promise.all([
          apiService.settings.getAll(),
          apiService.locations.getAll()
        ]);
        setSettings(settingsData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const organizeLocations = (): LocationGroup[] => {
      const searchTerm = locationSearchTerm.trim().toLowerCase();
      const grouped: LocationGroup[] = [];

      Object.entries(PUNE_AREAS).forEach(([area, areaLocations]) => {
        const areaLabel = area.charAt(0).toUpperCase() + area.slice(1) + ' Pune';
        
        const matchedLocations = areaLocations
          .map(areaName => {
            return locations.find(loc => 
              loc.name.toLowerCase() === areaName.toLowerCase()
            ) || { id: `${area}-${areaName}`, name: areaName };
          })
          .filter(loc => {
            if (!searchTerm) return true;
            return loc.name.toLowerCase().includes(searchTerm);
          });

        if (matchedLocations.length > 0) {
          grouped.push({
            label: areaLabel,
            locations: matchedLocations as Location[]
          });
        }
      });

      if (grouped.length === 0 && searchTerm) {
        const otherMatches = locations.filter(loc =>
          loc.name.toLowerCase().includes(searchTerm)
        );
        if (otherMatches.length > 0) {
          grouped.push({
            label: 'Other Locations',
            locations: otherMatches
          });
        }
      }

      return grouped.length > 0 ? grouped : [
        {
          label: 'Popular Areas',
          locations: locations.slice(0, 8)
        }
      ];
    };

    setFilteredLocations(organizeLocations());
  }, [locationSearchTerm, locations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (dropdownRef.current && !dropdownRef.current.contains(target) &&
          locationInputRef.current && !locationInputRef.current.contains(target)) {
        setShowLocationDropdown(false);
      }
      
      if (propertyTypeRef.current && !propertyTypeRef.current.contains(target)) {
        setShowPropertyTypeDropdown(false);
      }
      
      if (bedroomsRef.current && !bedroomsRef.current.contains(target)) {
        setShowBedroomsDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const fullText = heroTitleRef.current;
      let currentIndex = 0;
      setDisplayedText('');

      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }
  }, [isLoading]);

  const getSettingValue = useCallback((key: string, defaultValue: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  }, [settings]);

  useEffect(() => {
    const title = getSettingValue('hero_title', "The Finest Napa's\nReal Estate Properties");
    heroTitleRef.current = title;
  }, [settings, getSettingValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocation) params.append('location', selectedLocation);
    if (propertyType) params.append('type', propertyType);
    if (bedrooms) params.append('bedrooms', bedrooms);
    
    navigate(`/properties?${params.toString()}`);
    setShowLocationDropdown(false);
  };

  const handleSelectLocation = (locationName: string) => {
    setSelectedLocation(locationName);
    setLocationSearchTerm(locationName);
    setShowLocationDropdown(false);
  };

  const clearLocation = () => {
    setSelectedLocation('');
    setLocationSearchTerm('');
    locationInputRef.current?.focus();
  };
  const statsSold = getSettingValue('stats_sold_homes', '7,000+');
  const statsSales = getSettingValue('stats_sales_volume', '$1B+');
  const statsCustomers = getSettingValue('stats_satisfied_customers', '1,000+');

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-visible mb-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${getFileUrl('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=900&fit=crop')})`,
        }}
      />
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
      
      {/* Decorative Elements */}
      <div className=""></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl -ml-40 -mb-40"></div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 pt-10 pb-10 text-center">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-16 w-16 animate-spin text-white" />
          </div>
        ) : (
          <>
            {/* Badge */}
            <div className="inline-block mb-8 px-6 py-2 bg-primary/20 border border-primary/40 rounded-full backdrop-blur-sm">
              <span className="text-sm font-bold text-white uppercase tracking-wide">Welcome to MySqft24</span>
            </div>

            {/* Main Heading with Typewriter Animation */}
            <h1 className="text-2xl sm:text-2xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line drop-shadow-lg typewriter-text">
              {displayedText}
              <span className="typewriter-cursor"></span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Find premium properties tailored to your lifestyle. Expert guidance, transparent pricing, and seamless transactions.
            </p>

            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-5xl px-4">
              <div className="bg-white border border-white/20 rounded-xl p-6 shadow-2xl  transition-all duration-300 w-fit m-auto">
                <div className="flex flex-wrap gap-3 items-center justify-center relative">
                  {/* Location Search with Dropdown */}
                  <div className="relative md:col-span-1 overflow-visible">
                    <div className="flex items-center p-2 bg-gray-50/80 rounded-md hover:bg-gray-100/80 transition-all duration-300 cursor-text border border-gray-200/50" onClick={() => locationInputRef.current?.focus()}>
                      <MapPin className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <input
                        ref={locationInputRef}
                        type="text"
                        placeholder="Select Location"
                        value={locationSearchTerm}
                        onChange={(e) => {
                          setLocationSearchTerm(e.target.value);
                          setShowLocationDropdown(true);
                        }}
                        onFocus={() => setShowLocationDropdown(true)}
                        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base font-medium"
                      />
                      {selectedLocation && (
                        <button
                          type="button"
                          onClick={clearLocation}
                          className="ml-2 p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                    
                    {/* Location Dropdown - Grouped by Area */}
                    {showLocationDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto"
                      >
                        {filteredLocations.length > 0 ? (
                          <div className="py-2">
                            {filteredLocations.map((group, groupIndex) => (
                              <div key={groupIndex}>
                                <div className="px-4 py-2 text-xs font-bold text-primary uppercase tracking-wider bg-primary/5">
                                  {group.label}
                                </div>
                                {group.locations.map((location) => (
                                  <button
                                    key={location.id}
                                    type="button"
                                    onClick={() => handleSelectLocation(location.name)}
                                    className="w-full text-left px-6 py-2.5 hover:bg-primary/10 transition-colors flex items-center gap-2 text-sm font-medium text-foreground"
                                  >
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                    {location.name}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No locations found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Property Type - Custom Dropdown */}
                  <div className="md:col-span-1 relative overflow-visible" ref={propertyTypeRef}>
                    <div 
                      onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
                      className="flex items-center gap-3 p-2 bg-gray-50/80 rounded-md hover:bg-gray-100/80 transition-all duration-300 cursor-pointer border border-gray-200/50"
                    >
                      <Home className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <span className="flex-1 text-foreground font-medium text-base text-xs">
                        {propertyType 
                          ? PROPERTY_TYPES.find(t => t.value === propertyType)?.label 
                          : 'Property Type'
                        }
                      </span>
                      <svg className={`w-5 h-5 text-muted-foreground transition-transform ${showPropertyTypeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    
                    {/* Property Type Dropdown Menu */}
                    {showPropertyTypeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-2xl z-[9999] overflow-y-auto max-h-64">
                        <div className="py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPropertyType('');
                              setShowPropertyTypeDropdown(false);
                            }}
                            className="w-full text-left px-6 py-2.5 hover:bg-primary/10 transition-colors flex items-center gap-2 text-sm font-medium text-muted-foreground"
                          >
                            <Home className="h-4 w-4 text-primary flex-shrink-0" />
                            Property Type
                          </button>
                          {PROPERTY_TYPES.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setPropertyType(type.value);
                                setShowPropertyTypeDropdown(false);
                              }}
                              className={`w-full text-left px-6 py-2.5 transition-colors flex items-center gap-2 text-sm font-medium ${
                                propertyType === type.value 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'text-foreground hover:bg-gray-50'
                              }`}
                            >
                              <Home className="h-4 w-4 text-primary flex-shrink-0" />
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bedrooms - Custom Dropdown */}
                  <div className="md:col-span-1 relative overflow-visible" ref={bedroomsRef}>
                    <div 
                      onClick={() => setShowBedroomsDropdown(!showBedroomsDropdown)}
                      className="flex items-center p-2 gap-3 bg-gray-50/80 rounded-md hover:bg-gray-100/80 transition-all duration-300 cursor-pointer border border-gray-200/50"
                    >
                      <Bed className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <span className="flex-1 text-foreground font-medium text-base text-xs">
                        {bedrooms 
                          ? BEDROOM_OPTIONS.find(b => b.value === bedrooms)?.label 
                          : 'Bedrooms'
                        }
                      </span>
                      <svg className={`w-5 h-5 text-muted-foreground transition-transform ${showBedroomsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    
                    {/* Bedrooms Dropdown Menu */}
                    {showBedroomsDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-2xl z-[9999] overflow-y-auto max-h-64">
                        <div className="py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setBedrooms('');
                              setShowBedroomsDropdown(false);
                            }}
                            className="w-full text-left px-6 py-2.5 hover:bg-primary/10 transition-colors flex items-center gap-2 text-sm font-medium text-muted-foreground"
                          >
                            <Bed className="h-4 w-4 text-primary flex-shrink-0" />
                            Bedrooms
                          </button>
                          {BEDROOM_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setBedrooms(option.value);
                                setShowBedroomsDropdown(false);
                              }}
                              className={`w-full text-left px-6 py-2.5 transition-colors flex items-center gap-2 text-sm font-medium ${
                                bedrooms === option.value 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'text-foreground hover:bg-gray-50'
                              }`}
                            >
                              <Bed className="h-4 w-4 text-primary flex-shrink-0" />
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-1 flex items-center">
                    <Button
                      type="submit"
                      className="w-fit bg-gradient-to-r border-0 px-3 from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold p-2 rounded-md flex items-center text-xs justify-center gap-3 text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      <Search className="h-4 w-4" />
                      <span className='text-[16px]'>Search</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Enhanced Stats Section */}
            
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;