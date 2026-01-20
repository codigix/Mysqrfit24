import { Star, Loader2, User, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { Testimonial } from '@/types/site';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">Success Stories</span>
          <h2 className="text-4xl md:text-4xl font-bold mb-4 text-foreground mt-2">
            Client Testimonials
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients and their success stories
          </p>
        </div>

        <style>{`
          .slick-slide {
            padding: 0 12px;
          }
          .slick-list {
            margin: 0 -12px;
          }
          .slick-dots {
            bottom: -40px;
          }
          .slick-dots li button:before {
            color: var(--primary, #3b82f6);
            font-size: 10px;
          }
          .slick-dots li.slick-active button:before {
            color: var(--primary, #3b82f6);
            opacity: 1;
          }
          .slick-prev:before,
          .slick-next:before {
            color: var(--primary, #3b82f6);
            font-size: 20px;
          }
          .slick-prev:hover:before,
          .slick-next:hover:before {
            color: var(--primary, #3b82f6);
          }
        `}</style>

        <Slider {...sliderSettings}>
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-3">
              <Card 
                className="hover:shadow-2xl transition-all duration-300 h-full border-0 bg-white rounded-2xl overflow-hidden transform hover:scale-105"
              >
                <CardContent className="p-8 flex flex-col h-full relative">
                  <div className="absolute top-6 right-6 text-primary/10">
                    <Quote className="h-8 w-8" />
                  </div>
                  
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  
                  <p className="text-foreground mb-8 leading-relaxed flex-grow text-base">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    {testimonial.image_url ? (
                      <img 
                        src={getFileUrl(testimonial.image_url)} 
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-primary font-semibold">
                        {testimonial.role || 'Happy Client'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};
