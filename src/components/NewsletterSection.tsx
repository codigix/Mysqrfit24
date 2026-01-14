import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-elegant p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest property listings, market insights, and exclusive offers directly in your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-gray-300 focus:border-primary focus:ring-primary"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>

          {subscribed && (
            <p className="mt-4 text-green-600 font-semibold">
              ✓ Thank you for subscribing!
            </p>
          )}

          <p className="text-sm text-muted-foreground mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
