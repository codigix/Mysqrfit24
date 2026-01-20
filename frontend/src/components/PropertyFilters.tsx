import { useState } from 'react';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PropertyFiltersProps {
  filters: IPropertyFilters;
  onFiltersChange: (filters: IPropertyFilters) => void;
  isCompact?: boolean;
}

export const PropertyFilters = ({ filters, onFiltersChange, isCompact = false }: PropertyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(!isCompact);
  const [localFilters, setLocalFilters] = useState<IPropertyFilters>(filters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    localFilters.min_price || 0,
    localFilters.max_price || 10000000
  ]);

  const handleFilterChange = <K extends keyof IPropertyFilters>(key: K, value: IPropertyFilters[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    handleFilterChange('min_price', value[0]);
    handleFilterChange('max_price', value[1]);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    if (!isCompact) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    setPriceRange([0, 10000000]);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return '10Cr+';
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(0)}k`;
    return `₹${price}`;
  };

  if (isCompact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2  gap-4">
          {/* Property Type */}
          <div className="">
            <Label className="text-xs  text-foreground">Type</Label>
            <Select
              value={localFilters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="h-10 rounded-lg border-2 border-border/50 font-medium text-xs">
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
          <div className="">
            <Label className="text-xs text-foreground">Property Type</Label>
            <Select
              value={localFilters.property_type || ''}
              onValueChange={(value) => handleFilterChange('property_type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="h-10 rounded-lg border-2 border-border/50 font-medium text-xs">
                <SelectValue placeholder="All Property Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Property Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="vineyard">Vineyard</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div className="">
            <Label className="text-xs text-foreground">Bedrooms</Label>
            <Select
              value={localFilters.bedrooms?.toString() || ''}
              onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? undefined : Number(value))}
            >
              <SelectTrigger className="h-10 rounded-lg border-2 border-border/50 font-medium text-xs">
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
          <div className="">
            <Label className="text-xs text-foreground">Bathrooms</Label>
            <Select
              value={localFilters.bathrooms?.toString() || ''}
              onValueChange={(value) => handleFilterChange('bathrooms', value === 'any' ? undefined : Number(value))}
            >
              <SelectTrigger className="h-10 rounded-lg border-2 border-border/50 font-medium text-xs">
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

          {/* Price Range */}
          <div className="col-span-2 pt-2 border-t border-border/50">
            <Label className="text-xs font-bold text-foreground mb-3 block">
              {localFilters.type === 'rent' || localFilters.type === 'lease' ? 'Rent Range' : 'Price Range'}
            </Label>
            <div className="space-y-3">
              <Slider
                value={priceRange}
                min={0}
                max={10000000}
                step={50000}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex justify-between items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">{formatPrice(priceRange[0])}</span>
                <span className="text-muted-foreground">to</span>
                <span className="font-semibold text-foreground">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
          <Button 
            onClick={applyFilters}
            className="w-full px-4 py-2 rounded-lg font-semibold bg-primary hover:bg-primary/90 text-sm"
          >
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

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
        <Card className="shadow-lg border-0 rounded-md animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Property Type */}
              <div className="space-y-3">
                <Label className="text-xs text-foreground">Type</Label>
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
                <Label className="text-xs text-foreground">Property Type</Label>
                <Select
                  value={localFilters.property_type || ''}
                  onValueChange={(value) => handleFilterChange('property_type', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 border-border/50 font-medium">
                    <SelectValue placeholder="All Property Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Property Types</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="vineyard">Vineyard</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <Label className="text-xs text-foreground">Bedrooms</Label>
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
                <Label className="text-xs text-foreground">Bathrooms</Label>
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
            <div className="mb-8 pt-6 border-t border-border/50">
              <Label className="text-sm font-bold text-foreground mb-4 block">
                {localFilters.type === 'rent' || localFilters.type === 'lease' ? 'Rent Range' : 'Price Range'}
              </Label>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  min={0}
                  max={10000000}
                  step={50000}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
                <div className="flex justify-between items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">{formatPrice(priceRange[0])}</span>
                  <span className="text-muted-foreground">to</span>
                  <span className="font-semibold text-foreground">{formatPrice(priceRange[1])}</span>
                </div>
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
