import { Building, Landmark, TreePine, Wine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFileUrl } from '@/services/api';

const categories = [
  {
    name: "Residential",
    count: "1,240 Properties",
    icon: Building,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
  },
  {
    name: "Commercial",
    count: "320 Properties",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
  },
  {
    name: "Vineyard",
    count: "145 Properties",
    icon: Wine,
    image: "https://images.unsplash.com/photo-1536505378768-e29e8f6a3c4a?w=400&h=300&fit=crop"
  },
  {
    name: "Land",
    count: "89 Properties",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1488312691326-a0e93074e97b?w=400&h=300&fit=crop"
  }
];

export const CategoriesSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">categories</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
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
              <Card key={idx} className="border-0 overflow-hidden hover:shadow-elegant transition-all duration-300 group cursor-pointer">
                <CardContent className="p-0 relative h-64 flex items-end">
                  <img
                    src={getFileUrl(category.image)}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="relative w-full p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {category.count}
                    </p>
                    <Button variant="link" className="text-white hover:text-white/80 p-0 h-auto">
                      Explore →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
