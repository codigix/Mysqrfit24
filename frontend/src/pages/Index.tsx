import { useState } from 'react';
import { BestListingsSection } from '@/components/BestListingsSection';
import { Navigation } from '@/components/Navigation';
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

      {/* Testimonials Section */}
      

      {/* Featured Neighborhoods Section */}
      

      {/* Blog Section */}
      <BlogSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center mb-6">
                <img src={logoImage} className="h-10 w-auto" alt="MySqft 24" />
              </Link>
              <p className="text-sm text-white/70 leading-relaxed">
                Connecting you with premium properties worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/" className="text-white/70 hover:text-white transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/properties" className="text-white/70 hover:text-white transition-colors duration-300">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white/70 hover:text-white transition-colors duration-300">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
              <div className="space-y-3 text-sm text-white/70">
                <p>120 Main St, Napa, CA</p>
                <p className="text-white/70 hover:text-white transition-colors">Tel: +1 206-741-0340</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-white/60">
              © 2024 MySqft24. All rights reserved.
            </p>
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