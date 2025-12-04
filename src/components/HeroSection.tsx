import { useState } from 'react';
import { Search, MapPin, ShieldCheck, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [searchQuery, setSearchQuery] = useState('');

  const cities = ['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad'];

  const stats = [
    { value: '500+', label: 'Properties' },
    { value: '50+', label: 'Builders' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '₹0', label: 'Brokerage' },
  ];

  return (
    <section className="relative min-h-[600px] flex items-center justify-center py-24 px-4">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://www.pexels.com/download/video/4770380/"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Value Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Badge variant="outline" className="bg-card/90 border-housiey-red text-housiey-red px-4 py-2 text-sm font-medium">
            <ShieldCheck className="w-4 h-4 mr-2" />
            No Brokerage
          </Badge>
          <Badge variant="outline" className="bg-card/90 border-housiey-red text-housiey-red px-4 py-2 text-sm font-medium">
            <TrendingDown className="w-4 h-4 mr-2" />
            Bottom Rate Policy
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          From Land to Luxury
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-housiey-red mb-10">
          Properties Made Simple
        </p>

        {/* Search Box */}
        <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-elegant p-4 sm:p-6 mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* City Selector */}
            <div className="relative sm:w-40">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none bg-housiey-red text-housiey-red-foreground px-4 py-3 rounded-lg font-medium cursor-pointer border-0 focus:ring-2 focus:ring-housiey-red/50"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-housiey-red-foreground pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Project, locality or builder"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-housiey-red focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-housiey-red text-housiey-red-foreground p-2 rounded-md hover:bg-housiey-red/90 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-housiey-red mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;