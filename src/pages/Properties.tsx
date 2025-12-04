import { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { Navigation } from '@/components/Navigation';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import { Building } from 'lucide-react';

const Properties = () => {
  const [filters, setFilters] = useState<IPropertyFilters>({});
  const { data: properties, isLoading, error } = useProperties(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-housiey-dark py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-housiey-dark-foreground mb-4">
            All Properties
          </h1>
          <p className="text-xl text-housiey-dark-foreground/90 max-w-2xl mx-auto">
            Browse through our complete collection of premium properties
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-housiey-green/30">
        <div className="container mx-auto">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              {isLoading ? 'Loading Properties...' : `${properties?.length || 0} Properties Found`}
            </h2>
          </div>

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load properties. Please try again.</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : properties && properties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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