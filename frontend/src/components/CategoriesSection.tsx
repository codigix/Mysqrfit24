import { Building, Landmark, TreePine, Wine, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getFileUrl } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    name: "Residential",
    count: "1,240 Properties",
    icon: Building,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    slug: "residential"
  },
  {
    name: "Commercial",
    count: "320 Properties",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    slug: "commercial"
  },
  {
    name: "Vineyard",
    count: "145 Properties",
    icon: Wine,
    image: "https://images.unsplash.com/photo-1536505378768-e29e8f6a3c4a?w=400&h=300&fit=crop",
    slug: "vineyard"
  },
  {
    name: "Land",
    count: "89 Properties",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1488312691326-a0e93074e97b?w=400&h=300&fit=crop",
    slug: "land"
  }
];

export const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/properties?property_type=${categorySlug}`);
  };
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">categories</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground mt-2">
            Popular Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse properties by type to find what suits you best
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <Card className="border-0 overflow-hidden h-full transition-all duration-500 hover:shadow-2xl bg-white">
                  <CardContent className="p-0 relative h-72 flex items-end overflow-hidden">
                    <img
                      src={getFileUrl(category.image)}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent group-hover:from-primary/95 group-hover:via-primary/50 transition-all duration-500" />
                    
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/10 to-primary/0" />
                    
                    <div className="relative w-full p-6 text-white">
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl w-fit mb-3 group-hover:bg-white/25 transition-colors duration-300">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-1 leading-tight">
                            {category.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {category.count}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 duration-300">
                          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors">
                            <ArrowRight className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-1 w-16 bg-white/30 rounded-full group-hover:w-24 group-hover:bg-white/50 transition-all duration-500" />
                      
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                          Explore Properties
                          <ArrowRight className="h-4 w-4" />
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
