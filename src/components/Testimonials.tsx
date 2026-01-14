import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Susan Barkley',
      role: 'Happy Client',
      content: 'The team did an outstanding job helping me buy my first home. The high level of service and attention to detail was exceptional.',
      rating: 5
    },
    {
      id: 2,
      name: 'David DeLacruz',
      role: 'Happy Seller',
      content: 'The team delivered on every expectation and I would highly recommend them to anyone looking to sell their property.',
      rating: 5
    },
    {
      id: 3,
      name: 'Dan Gilmore',
      role: 'Happy Buyer',
      content: 'Outstanding service! They made the entire buying process smooth and stress-free. Highly recommended for anyone in the market.',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-md md:text-4xl font-bold mb-4 text-foreground">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-elegant transition-shadow">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
