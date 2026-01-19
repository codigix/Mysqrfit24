import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, MapPin, Home, Bed, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFileUrl, apiService } from '@/services/api';
import { SiteSetting } from '@/types/site';
import { Location } from '@/types/location';

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    if (locationSearchTerm.trim()) {
      const filtered = locations.filter(loc =>
        loc.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations.slice(0, 8));
    }
  }, [locationSearchTerm, locations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSettingValue = (key: string, defaultValue: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

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

  const heroTitle = getSettingValue('hero_title', "The Finest Napa's\nReal Estate Properties");
  const statsSold = getSettingValue('stats_sold_homes', '7,000+');
  const statsSales = getSettingValue('stats_sales_volume', '$1B+');
  const statsCustomers = getSettingValue('stats_satisfied_customers', '1,000+');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl -ml-40 -mb-40"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 text-center">
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

            {/* Main Heading with enhanced styling */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight whitespace-pre-line drop-shadow-lg">
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Find premium properties tailored to your lifestyle. Expert guidance, transparent pricing, and seamless transactions.
            </p>

            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="mb-20 max-w-6xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-2 lg:p-3 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4">
                  {/* Location Search with Dropdown */}
                  <div className="relative md:col-span-1">
                    <div className="flex items-center px-5 py-5 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 cursor-text border border-gray-200/50" onClick={() => locationInputRef.current?.focus()}>
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
                    
                    {/* Location Dropdown */}
                    {showLocationDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                      >
                        {filteredLocations.length > 0 ? (
                          <div className="p-2">
                            {filteredLocations.map((location) => (
                              <button
                                key={location.id}
                                type="button"
                                onClick={() => handleSelectLocation(location.name)}
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2 text-sm font-medium text-foreground"
                              >
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                {location.name}
                              </button>
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

                  {/* Property Type */}
                  <div className="md:col-span-1">
                    <div className="flex items-center px-5 py-5 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 border border-gray-200/50">
                      <Home className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="flex-1 bg-transparent text-foreground font-medium cursor-pointer focus:outline-none text-base appearance-none"
                      >
                        <option value="">Property Type</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="md:col-span-1">
                    <div className="flex items-center px-5 py-5 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 border border-gray-200/50">
                      <Bed className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="flex-1 bg-transparent text-foreground font-medium cursor-pointer focus:outline-none text-base appearance-none"
                      >
                        <option value="">Bedrooms</option>
                        <option value="1">1+ BHK</option>
                        <option value="2">2+ BHK</option>
                        <option value="3">3+ BHK</option>
                        <option value="4">4+ BHK</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-1 flex items-center">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold px-8 py-5 rounded-2xl flex items-center justify-center gap-3 text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      <Search className="h-6 w-6" />
                      <span>SEARCH</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Enhanced Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {statsSold}
                  </div>
                  <p className="text-white/80 font-semibold uppercase text-sm tracking-wider">Homes Sold</p>
                </div>
              </div>
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {statsSales}
                  </div>
                  <p className="text-white/80 font-semibold uppercase text-sm tracking-wider">In Sales</p>
                </div>
              </div>
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {statsCustomers}
                  </div>
                  <p className="text-white/80 font-semibold uppercase text-sm tracking-wider">Satisfied Clients</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;