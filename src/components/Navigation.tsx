import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Building, Users, Menu } from 'lucide-react';
import logoImage from '@/assets/mysqfit.png';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Building },
    { href: '/about', label: 'About Us', icon: Users },
  ];

  const NavLink = ({ href, label, icon: Icon, mobile = false }: { 
    href: string; 
    label: string; 
    icon: any; 
    mobile?: boolean; 
  }) => {
    const isActive = location.pathname === href;
    
    return (
      <Link 
        to={href} 
        className={`flex items-center gap-2 ${
          mobile 
            ? 'py-2 px-4 text-foreground hover:text-primary transition-colors' 
            : `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:text-white'
              }`
        }`}
        onClick={() => mobile && setIsOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoImage} className="h-auto w-40" alt="MySqft 24 - Will Make It Together" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center space-x-2 px-4 pb-4 border-b">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-md flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">MySqfit</span>
                </div>
                
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} mobile />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};