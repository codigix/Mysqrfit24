import { MapPin } from 'lucide-react';
import { useEffect } from 'react';

const PUNE_ZONES = [
  { label: 'North Pune', areas: ['Hinjewadi', 'Talegaon', 'Mahalunge', 'Chakan', 'Khed', 'Dehu Road', 'north'] },
  { label: 'South Pune', areas: ['Hadapsar', 'Magarpatta', 'Warje', 'Kothrud', 'Bibvewadi', 'Vitthalwadi', 'south'] },
  { label: 'East Pune', areas: ['Viman Nagar', 'Dhanori', 'Moshi', 'Wagholi', 'Manjri', 'Lohegaon', 'east'] },
  { label: 'West Pune', areas: ['Aundh', 'Bavdhan', 'Pashan', 'Katraj', 'Dhankawadi', 'Wanowrie', 'west'] }
];

const ALL_PUNE_AREAS = PUNE_ZONES.flatMap(zone => zone.areas);

const FEATURED_PUNE_PLACES = [
  { 
    name: 'Shaniwar Wada', 
    zone: 'West Pune', 
    description: 'Historic 8-storied palace with stunning architecture',
    image: 'https://images.unsplash.com/photo-1571296150101-8f4215c8f3ae?w=500&h=400&fit=crop'
  },
  { 
    name: 'Hinjewadi Tech Park', 
    zone: 'North Pune', 
    description: 'Major IT hub with world-class infrastructure',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop'
  },
  { 
    name: 'Hadapsar IT Park', 
    zone: 'South Pune', 
    description: 'Premier business district with premium offices',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop'
  },
  { 
    name: 'Viman Nagar', 
    zone: 'East Pune', 
    description: 'Upscale residential and commercial hub',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop'
  },
  { 
    name: 'Magarpatta City', 
    zone: 'South Pune', 
    description: 'Planned township with modern amenities',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=400&fit=crop'
  },
  { 
    name: 'Aundh Commercial Hub', 
    zone: 'West Pune', 
    description: 'Bustling shopping and business district',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=400&fit=crop'
  },
  { 
    name: 'Koregaon Park', 
    zone: 'West Pune', 
    description: 'Trendy area with cafes and entertainment',
    image: 'https://images.unsplash.com/photo-1572440813131-c7b8e2d38a16?w=500&h=400&fit=crop'
  },
  { 
    name: 'Kharadi Tech Zone', 
    zone: 'East Pune', 
    description: 'Emerging IT corridor with smart offices',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=400&fit=crop'
  }
];

const getZoneName = (locationName: string): string => {
  const locName = locationName.toLowerCase();
  for (const zone of PUNE_ZONES) {
    if (zone.areas.some(area => locName.includes(area.toLowerCase()))) {
      return zone.label;
    }
  }
  return 'Pune';
};

export const FeaturedNeighborhoods = () => {
  useEffect(() => {
  }, []);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">Explore Pune</span>
          <h2 className="text-4xl md:text-4xl font-bold mb-4 text-foreground">
            Premier Pune Locations
          </h2>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover prime neighborhoods across North, South, East, and West Pune with our curated selection of premium locations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PUNE_PLACES.map((place, idx) => (
            <div 
              key={idx} 
              className="group cursor-pointer relative h-72 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/95 px-3 py-1.5 rounded-full shadow-md">
                    <MapPin className="h-4 w-4 text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">{place.zone}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white leading-tight drop-shadow-lg group-hover:text-primary transition-colors duration-300">
                    {place.name}
                  </h3>
                  <p className="text-xs text-gray-50 leading-relaxed drop-shadow-md line-clamp-2">
                    {place.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
