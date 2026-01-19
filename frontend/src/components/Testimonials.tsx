import { Star, Loader2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { Testimonial } from '@/types/site';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await apiService.testimonials.list();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: '1',
      name: 'Susan Barkley',
      role: 'Happy Client',
      content: 'The team did an outstanding job helping me buy my first home. The high level of service and attention to detail was exceptional.',
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      name: 'David DeLacruz',
      role: 'Happy Seller',
      content: 'The team delivered on every expectation and I would highly recommend them to anyone looking to sell their property.',
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      name: 'Dan Gilmore',
      role: 'Happy Buyer',
      content: 'Outstanding service! They made the entire buying process smooth and stress-free. Highly recommended for anyone in the market.',
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-md md:text-4xl font-bold mb-4 text-foreground">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-elegant transition-shadow h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4 flex items-center gap-4">
                  {testimonial.image_url ? (
                    <img 
                      src={getFileUrl(testimonial.image_url)} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role || 'Happy Client'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
