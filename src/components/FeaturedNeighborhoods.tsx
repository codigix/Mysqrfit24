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
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">Explore Our Cities</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Featured Neighborhoods
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect area to call home with our curated selection of premier locations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {locations.map((location) => (
            <Card key={location.id} className="border-0 overflow-hidden bg-white hover:shadow-xl transition-all duration-500 group cursor-pointer relative h-[400px]">
              <CardContent className="p-0 h-full">
                <div className="relative h-full overflow-hidden">
                  <img
                    src={getFileUrl(location.image_url || '')}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium uppercase tracking-wider text-primary">Location</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {location.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
