import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Building, Users, Menu, Phone, Settings } from 'lucide-react';
import logoImage from '@/assets/mysqfit.png';
import { apiService } from '@/services/api';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(!!apiService.auth.getToken());

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Building },
    { href: '/about', label: 'About Us', icon: Users },
  ];

  const goToAdminPanel = () => {
    const token = apiService.auth.getToken();
    if (token) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const NavLink = ({ href, label, mobile = false }: { 
    href: string; 
    label: string;
    mobile?: boolean; 
  }) => {
    const isActive = location.pathname === href;
    
    return (
      <Link 
        to={href} 
        className={`text-sm font-medium transition-colors ${
          mobile 
            ? 'block py-3 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg' 
            : isActive
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary pb-1'
        }`}
        onClick={() => mobile && setIsOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className=" z-50 w-full bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-b border-border/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logoImage} className="h-12 w-auto" alt="MySqft24 - Premium Properties" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>

          {/* Right side - Contact & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+12067410340"
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+1 206-741-0340</span>
            </a>

            {/* Admin Button */}
            {isAdmin && (
              <Button
                onClick={goToAdminPanel}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2"
                title="Go to Admin Panel (opens in new tab)"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            )}
            {!isAdmin && (
              <Button
                onClick={goToAdminPanel}
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-1 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.href} href={item.href} label={item.label} mobile />
                  ))}
                  <a
                    href="tel:+12067410340"
                    className="block py-3 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Phone className="h-4 w-4 inline mr-2" />
                    +1 206-741-0340
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => { goToAdminPanel(); setIsOpen(false); }}
                      className="block w-full text-left py-3 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      Admin Panel
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};