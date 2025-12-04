import { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import { Building, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PropertyTabsProps {
  filters: IPropertyFilters;
}

export const PropertyTabs = ({ filters }: PropertyTabsProps) => {
  const [activeTab, setActiveTab] = useState<'rent' | 'sale'>('sale');
  
  const rentFilters = { ...filters, type: 'rent' as const };
  const saleFilters = { ...filters, type: 'sale' as const };
  
  const { data: rentProperties, isLoading: rentLoading } = useProperties(rentFilters);
  const { data: saleProperties, isLoading: saleLoading } = useProperties(saleFilters);

  const featuredRentProperties = rentProperties?.filter(p => p.is_featured) || [];
  const regularRentProperties = rentProperties?.filter(p => !p.is_featured) || [];
  
  const featuredSaleProperties = saleProperties?.filter(p => p.is_featured) || [];
  const regularSaleProperties = saleProperties?.filter(p => !p.is_featured) || [];

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
      ))}
    </div>
  );

  const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="text-center py-16">
      <Icon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  const PropertySection = ({ 
    title, 
    subtitle, 
    properties, 
    isLoading, 
    isFeatured = false,
    emptyIcon: EmptyIcon,
    emptyTitle,
    emptyDescription,
    viewAllLink,
    viewAllText
  }: {
    title: string;
    subtitle: string;
    properties: any[];
    isLoading: boolean;
    isFeatured?: boolean;
    emptyIcon: any;
    emptyTitle: string;
    emptyDescription: string;
    viewAllLink: string;
    viewAllText: string;
  }) => (
    <section className={isFeatured ? "py-10 px-6 bg-muted/30 rounded-2xl" : ""}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Link to={viewAllLink}>
          <Button variant="outline" size="sm" className="gap-2">
            {viewAllText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : properties.length === 0 ? (
        <EmptyState icon={EmptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 9).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'rent' | 'sale')} className="w-full">
      <div className="flex justify-center mb-10">
        <TabsList className="h-12 p-1">
          <TabsTrigger value="sale" className="text-sm font-semibold px-6 gap-2">
            <Home className="w-4 h-4" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="rent" className="text-sm font-semibold px-6 gap-2">
            <Building className="w-4 h-4" />
            Rent
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="sale" className="space-y-12 mt-0">
        {featuredSaleProperties.length > 0 && (
          <PropertySection
            title="Featured Properties for Sale"
            subtitle="Premium properties ready to buy"
            properties={featuredSaleProperties}
            isLoading={saleLoading}
            isFeatured
            emptyIcon={Home}
            emptyTitle="No featured properties"
            emptyDescription="Check back later"
            viewAllLink="/properties?type=sale"
            viewAllText="View All"
          />
        )}

        <PropertySection
          title="Properties for Sale"
          subtitle={saleLoading ? 'Loading...' : `${regularSaleProperties.length} properties available`}
          properties={regularSaleProperties}
          isLoading={saleLoading}
          emptyIcon={Home}
          emptyTitle="No properties for sale"
          emptyDescription="Check back later for new listings"
          viewAllLink="/properties?type=sale"
          viewAllText="View All Sales"
        />
      </TabsContent>

      <TabsContent value="rent" className="space-y-12 mt-0">
        {featuredRentProperties.length > 0 && (
          <PropertySection
            title="Featured Properties for Rent"
            subtitle="Premium rental properties available"
            properties={featuredRentProperties}
            isLoading={rentLoading}
            isFeatured
            emptyIcon={Building}
            emptyTitle="No featured rentals"
            emptyDescription="Check back later"
            viewAllLink="/properties?type=rent"
            viewAllText="View All"
          />
        )}

        <PropertySection
          title="Properties for Rent"
          subtitle={rentLoading ? 'Loading...' : `${regularRentProperties.length} rentals available`}
          properties={regularRentProperties}
          isLoading={rentLoading}
          emptyIcon={Building}
          emptyTitle="No properties for rent"
          emptyDescription="Check back later for new rental listings"
          viewAllLink="/properties?type=rent"
          viewAllText="View All Rentals"
        />
      </TabsContent>
    </Tabs>
  );
};