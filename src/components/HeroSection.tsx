import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFileUrl, apiService } from '@/services/api';
import { SiteSetting } from '@/types/site';

const HeroSection = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [selectedItems, setSelectedItems] = useState('2 items selected');
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiService.settings.getAll();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings for hero:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getSettingValue = (key: string, defaultValue: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const heroTitle = getSettingValue('hero_title', "The Finest Napa's\nReal Estate Properties");
  const statsSold = getSettingValue('stats_sold_homes', '7,000+');
  const statsSales = getSettingValue('stats_sales_volume', '$1B+');
  const statsCustomers = getSettingValue('stats_satisfied_customers', '1,000+');

  return (
    <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden rounded-b-3xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getFileUrl('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=900&fit=crop')})`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20 text-center">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </div>
        ) : (
          <>
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-12 leading-tight whitespace-pre-line">
              {heroTitle}
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-elegant p-3 mb-12 max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
              {/* Location Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-6 py-3 rounded-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                />
              </div>

              {/* Property Type */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-6 py-3 rounded-full bg-transparent text-foreground font-medium cursor-pointer focus:outline-none text-sm border-l border-border"
              >
                <option value="">Property Type</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="commercial">Commercial</option>
              </select>

              {/* Items Selected */}
              <select
                value={selectedItems}
                onChange={(e) => setSelectedItems(e.target.value)}
                className="px-6 py-3 rounded-full bg-transparent text-foreground font-medium cursor-pointer focus:outline-none text-sm border-l border-border"
              >
                <option value="2 items selected">2 items selected</option>
                <option value="1 item selected">1 item selected</option>
                <option value="3 items selected">3 items selected</option>
              </select>

              {/* Search Button */}
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-full flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="h-5 w-5" />
                SEARCH
              </Button>
            </form>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">•</span>
                <span className="text-sm sm:text-base font-medium uppercase">{statsSold} SOLD HOMES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">•</span>
                <span className="text-sm sm:text-base font-medium uppercase">{statsSales} IN SALES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">•</span>
                <span className="text-sm sm:text-base font-medium uppercase">{statsCustomers} SATISFIED CUSTOMERS</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;