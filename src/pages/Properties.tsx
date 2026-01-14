import { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { Navigation } from '@/components/Navigation';
import { EnhancedPropertyForm } from '@/components/EnhancedPropertyForm';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import { Building } from 'lucide-react';

const Properties = () => {
  const [filters, setFilters] = useState<IPropertyFilters>({});
  const { data: properties, isLoading, error } = useProperties(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-housiey-dark to-housiey-dark/80 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-housiey-dark-foreground mb-6">
            Our Properties
          </h1>
          <p className="text-lg md:text-xl text-housiey-dark-foreground/90 max-w-3xl mx-auto">
            Discover your perfect home from our curated selection of premium properties
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-housiey-green/20 border-b border-housiey-green/30">
        <div className="max-w-7xl mx-auto">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {isLoading ? 'Loading Properties...' : `${properties?.length || 0} Properties Found`}
              </h2>
              <p className="text-muted-foreground mt-2">Browse and select your ideal property</p>
            </div>
          </div>

          <div className="mb-8">
            <EnhancedPropertyForm />
          </div>

          {error && (
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-destructive/10 rounded-lg">
                <p className="text-destructive font-semibold">Failed to load properties. Please try again.</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : properties && properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block">
                <Building className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">No properties found</h3>
                <p className="text-muted-foreground text-lg">Try adjusting your search filters to find your dream home</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;