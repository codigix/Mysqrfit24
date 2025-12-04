import { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyFilters } from '@/components/PropertyFilters';
import { PropertyTabs } from '@/components/PropertyTabs';
import { Navigation } from '@/components/Navigation';
import { PropertyFilters as IPropertyFilters } from '@/types/property';
import ChatBot from '@/components/ChatBot';
import ChatBotIcon from '@/components/ChatBotIcon';
import HeroSection from '@/components/HeroSection';
import ValuePropositions from '@/components/ValuePropositions';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/mysqfit.png';

const Index = () => {
  const [filters, setFilters] = useState<IPropertyFilters>({});
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const { data: properties, isLoading, error } = useProperties(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Value Propositions */}
      <ValuePropositions />

      {/* Filters Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Find Your Perfect Property
            </h2>
            <p className="text-muted-foreground">
              Use our filters to narrow down your search
            </p>
          </div>
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </section>

      {/* Property Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <PropertyTabs filters={filters} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-housiey-dark py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Link to="/" className="flex items-center">
              <img src={logoImage} className="h-auto w-44" alt="MySqft 24" />
            </Link>
          <div className="flex items-center gap-6 text-housiey-dark-foreground/80 text-sm">
              <Link to="/" className="hover:text-housiey-red transition-colors">Home</Link>
              <Link to="/properties" className="hover:text-housiey-red transition-colors">Properties</Link>
              <Link to="/about" className="hover:text-housiey-red transition-colors">About Us</Link>
            </div>
            <div className="w-full max-w-md h-px bg-housiey-dark-foreground/20" />
            <p className="text-housiey-dark-foreground/60 text-sm text-center">
              © 2024 MySqfit. Connecting you with premium properties worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBotIcon onClick={() => setIsChatBotOpen(true)} />
      <ChatBot
        isOpen={isChatBotOpen}
        onToggle={() => setIsChatBotOpen(!isChatBotOpen)}
      />
    </div>
  );
};

export default Index;