import { useState } from 'react';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';

interface PropertyFiltersProps {
  filters: IPropertyFilters;
  onFiltersChange: (filters: IPropertyFilters) => void;
}

export const PropertyFilters = ({ filters, onFiltersChange }: PropertyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<IPropertyFilters>(filters);

  const handleFilterChange = <K extends keyof IPropertyFilters>(key: K, value: IPropertyFilters[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            placeholder="Search by location, area, or property name..."
            className="pl-12 h-12 rounded-xl text-base font-medium border-2 border-border/50 focus:border-primary focus:ring-0"
            value={localFilters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilters();
              }
            }}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isOpen ? "default" : "outline"}
            onClick={() => setIsOpen(!isOpen)}
            className="h-12 px-6 rounded-xl font-semibold text-base"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="h-12 px-6 rounded-xl font-semibold text-base border-2"
            >
              <X className="h-5 w-5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <Card className="shadow-lg border-0 rounded-2xl animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Property Type */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">Type</Label>
                <Select
                  value={localFilters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 border-border/50 font-medium">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">Property Type</Label>
                <Select
                  value={localFilters.property_type || ''}
                  onValueChange={(value) => handleFilterChange('property_type', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 border-border/50 font-medium">
                    <SelectValue placeholder="All Property Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Property Types</SelectItem>
                    {localFilters.type === 'sale' && (
                      <>
                        <SelectItem value="openland">Open Land</SelectItem>
                        <SelectItem value="apartments">Apartments</SelectItem>
                        <SelectItem value="flats">Flats</SelectItem>
                        <SelectItem value="rowhouses">Row Houses</SelectItem>
                        <SelectItem value="godowns">Godowns</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                      </>
                    )}
                    {localFilters.type === 'rent' && (
                      <>
                        <SelectItem value="apartments">Apartments</SelectItem>
                        <SelectItem value="flats">Flats</SelectItem>
                        <SelectItem value="rowhouses">Row Houses</SelectItem>
                        <SelectItem value="godowns">Godowns</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                      </>
                    )}
                    {localFilters.type === 'lease' && (
                      <>
                        <SelectItem value="openland">Open Land</SelectItem>
                        <SelectItem value="apartments">Apartments</SelectItem>
                        <SelectItem value="flats">Flats</SelectItem>
                        <SelectItem value="rowhouses">Row Houses</SelectItem>
                        <SelectItem value="godowns">Godowns</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                      </>
                    )}
                    {!localFilters.type && (
                      <>
                        <SelectItem value="apartments">Apartments</SelectItem>
                        <SelectItem value="flats">Flats</SelectItem>
                        <SelectItem value="rowhouses">Row Houses</SelectItem>
                        <SelectItem value="godowns">Godowns</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                        <SelectItem value="openland">Open Land</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">Bedrooms</Label>
                <Select
                  value={localFilters.bedrooms?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? undefined : Number(value))}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 border-border/50 font-medium">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">Bathrooms</Label>
                <Select
                  value={localFilters.bathrooms?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('bathrooms', value === 'any' ? undefined : Number(value))}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 border-border/50 font-medium">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 pt-6 border-t border-border/50">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">
                  {localFilters.type === 'rent' || localFilters.type === 'lease' ? 'Min Rent' : 'Min Price'}
                </Label>
                <Input
                  type="number"
                  placeholder="₹ Min"
                  className="h-11 rounded-lg border-2 border-border/50 font-medium"
                  value={localFilters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">
                  {localFilters.type === 'rent' || localFilters.type === 'lease' ? 'Max Rent' : 'Max Price'}
                </Label>
                <Input
                  type="number"
                  placeholder="₹ Max"
                  className="h-11 rounded-lg border-2 border-border/50 font-medium"
                  value={localFilters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-lg font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={applyFilters}
                className="px-8 py-2.5 rounded-lg font-semibold bg-primary hover:bg-primary/90"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};