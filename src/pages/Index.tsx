import { useState } from 'react';
import { BestListingsSection } from '@/components/BestListingsSection';
import { Navigation } from '@/components/Navigation';
import { StatsSection } from '@/components/StatsSection';
import { Testimonials } from '@/components/Testimonials';
import { FeaturedNeighborhoods } from '@/components/FeaturedNeighborhoods';
import { BlogSection } from '@/components/BlogSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { CategoriesSection } from '@/components/CategoriesSection';
import ChatBot from '@/components/ChatBot';
import ChatBotIcon from '@/components/ChatBotIcon';
import HeroSection from '@/components/HeroSection';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/mysqfit.png';
import { Button } from '@/components/ui/button';


const Index = () => {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      
      {/* Best Listings Section */}
      <BestListingsSection />
      <FeaturedNeighborhoods />
      <Testimonials />
<StatsSection />

      {/* Testimonials Section */}
      

      {/* Featured Neighborhoods Section */}
      

      {/* Blog Section */}
      <BlogSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Your digital presence is about to take off
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Ready to find your dream property or list your home?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-primary-foreground hover:bg-white/10 font-semibold px-8"
            >
              Search Listings
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-housiey-dark text-housiey-dark-foreground py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center mb-4">
                <img src={logoImage} className="h-10 w-auto" alt="MySqft 24" />
              </Link>
              <p className="text-sm opacity-80">
                Connecting you with premium properties worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-housiey-dark-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">Home</Link></li>
                <li><Link to="/properties" className="opacity-80 hover:opacity-100 transition-opacity">Properties</Link></li>
                <li><Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-housiey-dark-foreground">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Contact</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Use</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-housiey-dark-foreground">Contact</h4>
              <p className="text-sm opacity-80 mb-2">120 Main St, Napa, CA</p>
              <p className="text-sm opacity-80">Tel: +1 206-741-0340</p>
            </div>
          </div>
          <div className="border-t border-housiey-dark-foreground/20 pt-8 text-center text-sm opacity-80">
            <p>© 2024 MySqft24. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      {/* <ChatBotIcon onClick={() => setIsChatBotOpen(true)} />
      <ChatBot
        isOpen={isChatBotOpen}
        onToggle={() => setIsChatBotOpen(!isChatBotOpen)}
      /> */}
    </div>
  );
};

export default Index;