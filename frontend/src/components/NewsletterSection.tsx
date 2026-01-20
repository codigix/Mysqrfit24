import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      await apiService.newsletter.subscribe(email);
      setSubscribed(true);
      setEmail('');
      toast({
        title: "Success",
        description: "Thank you for subscribing to our newsletter!",
      });
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-6 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="m mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 text-center border border-white/50">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-5 rounded-2xl border border-primary/10">
              <Mail className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-3xl font-bold text-foreground mb-6 tracking-tight">
            Stay Updated
          </h2>
          
          <p className="text-xs text-muted-foreground mb-5 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our newsletter to receive the latest property listings, market insights, and exclusive offers directly in your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold whitespace-nowrap h-12 rounded-lg px-8 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>

          {subscribed && (
            <p className="text-green-600 font-semibold text-base mb-4">
              ✓ Thank you for subscribing!
            </p>
          )}

          <p className="text-sm text-muted-foreground/70">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
