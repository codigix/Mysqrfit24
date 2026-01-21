import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { BlogPost } from '@/types/blog';

export const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiService.blog.list({ limit: 3 });
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Fallback to static data if no posts found
  const displayPosts = posts.length > 0 ? posts : [
    {
      id: '1',
      title: "10 Tips for First-Time Homebuyers",
      content: "Learn the essential steps to take when buying your first property in Napa Valley.",
      image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      author: "Sarah Mitchell",
      created_at: "2024-12-15",
      category: "Buying",
      slug: "tips-for-homebuyers"
    },
    {
      id: '2',
      title: "The Wine Country Real Estate Market Trends",
      content: "Discover the latest trends shaping the luxury real estate market in Napa.",
      image_url: "https://images.unsplash.com/photo-1577720643272-265dfe1c3a7f?w=400&h=250&fit=crop",
      author: "Michael Chen",
      created_at: "2024-12-10",
      category: "Market",
      slug: "market-trends"
    },
    {
      id: '3',
      title: "How to Maximize Your Property Value",
      content: "Simple upgrades that can significantly increase your home's market value.",
      image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
      author: "Jennifer Lopez",
      created_at: "2024-12-05",
      category: "Selling",
      slug: "maximize-value"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
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
          {displayPosts.map((post: BlogPost, idx) => (
            <Card key={post.id || idx} className="border-0 overflow-hidden hover:shadow-elegant transition-all duration-300 group flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getFileUrl(post.image_url)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary text-primary-foreground p-2 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1 line-clamp-2">
                    {post.excerpt || post.content?.substring(0, 100) + '...'}
                  </p>
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author || 'Admin'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
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
