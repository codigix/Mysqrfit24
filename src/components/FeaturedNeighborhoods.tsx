import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const properties = [
  {
    id: 1,
    title: "Modern Penthouse Apartment",
    price: "$2,000/month",
    status: "Active",
    statusColor: "bg-amber-600",
    bedrooms: 2,
    bathrooms: 2.5,
    size: "250 ft²",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop",
    agent: { name: "Agent Name", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
  },
  {
    id: 2,
    title: "Modern Home For Sale",
    price: "$775,000",
    status: "Sold",
    statusColor: "bg-amber-600",
    bedrooms: 2,
    bathrooms: 2.5,
    size: "250 ft²",
    image: "https://images.unsplash.com/photo-1576941089067-2de3dd663161?w=500&h=400&fit=crop",
    agent: { name: "Agent Name", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
  },
  {
    id: 3,
    title: "Spacious Home For Sale",
    price: "$800,000",
    status: "Sold",
    statusColor: "bg-amber-600",
    bedrooms: 2,
    bathrooms: 2.5,
    size: "250 ft²",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop",
    agent: { name: "Agent Name", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }
  },
  {
    id: 4,
    title: "Townhouse For Sale",
    price: "$210,000",
    status: "Featured",
    statusColor: "bg-slate-600",
    bedrooms: 2,
    bathrooms: 2.5,
    size: "250 ft²",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=400&fit=crop",
    agent: { name: "Agent Name", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
  },
  {
    id: 5,
    title: "Luxury Villa For Sale",
    price: "$460,000",
    status: "Active",
    statusColor: "bg-amber-600",
    bedrooms: 2,
    bathrooms: 2.5,
    size: "250 ft²",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop",
    agent: { name: "Agent Name", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }
  },
  {
    id: 6,
    title: "Modern Office For Rent",
    price: "$1,600/month",
    status: "Open House",
    statusColor: "bg-green-600",
    bedrooms: 2,
    bathrooms: 2.5,
    size: "250 ft²",
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=400&fit=crop",
    agent: { name: "Agent Name", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
  }
];

export const FeaturedNeighborhoods = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">finest properties</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Featured Neighborhoods
          </h2>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="border-0 overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 bg-amber-700 text-white px-3 py-1 rounded font-semibold text-sm">
                      {property.price}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${property.statusColor} text-white font-semibold`}>
                        {property.status}
                      </Badge>
                    </div>

                    {/* Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorited(!isFavorited);
                      }}
                      className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                    >
                      <Heart
                        className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={property.agent.avatar}
                        alt={property.agent.name}
                        className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground line-clamp-1">
                          {property.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {property.bedrooms} Beds • {property.bathrooms} Baths • {property.size}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
