import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { Location } from '@/types/location';

export const FeaturedNeighborhoods = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await apiService.locations.getAll();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) return null;
  if (locations.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">Explore Our Cities</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Featured Neighborhoods
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the perfect area to call home with our curated selection of premier locations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="group cursor-pointer relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={getFileUrl(location.image_url || '')}
                alt={location.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/95 px-3 py-1.5 rounded-full shadow-md">
                    <MapPin className="h-4 w-4 text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Location</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg group-hover:text-primary transition-colors duration-300">
                    {location.name}
                  </h3>
                  {location.description && (
                    <p className="text-sm md:text-base text-gray-50 leading-relaxed drop-shadow-md line-clamp-2">
                      {location.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
