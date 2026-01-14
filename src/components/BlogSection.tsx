import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    title: "10 Tips for First-Time Homebuyers",
    excerpt: "Learn the essential steps to take when buying your first property in Napa Valley.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
    author: "Sarah Mitchell",
    date: "Dec 15, 2024",
    category: "Buying"
  },
  {
    title: "The Wine Country Real Estate Market Trends",
    excerpt: "Discover the latest trends shaping the luxury real estate market in Napa.",
    image: "https://images.unsplash.com/photo-1577720643272-265dfe1c3a7f?w=400&h=250&fit=crop",
    author: "Michael Chen",
    date: "Dec 10, 2024",
    category: "Market"
  },
  {
    title: "How to Maximize Your Property Value",
    excerpt: "Simple upgrades that can significantly increase your home's market value.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
    author: "Jennifer Lopez",
    date: "Dec 5, 2024",
    category: "Selling"
  }
];

export const BlogSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">our blog</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Real Estate Insights & Tips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest news and advice from our expert agents
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <Card key={idx} className="border-0 overflow-hidden hover:shadow-elegant transition-all duration-300 group flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/10"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};
