import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Building, Users, Menu, Phone, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logoImage from '@/assets/mysqfit.png';
import { apiService, getFileUrl } from '@/services/api';
import { useAuth } from '@/admin-app/hooks/useAuth';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Building },
    { href: '/about', label: 'About Us', icon: Users },
  ];

  useEffect(() => {
    setIsAdmin(isAuthenticated && (user?.role === 'admin' || user?.is_admin));
  }, [isAuthenticated, user]);

  const goToAdminPanel = () => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

            {/* Admin/User Section */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Button
                      onClick={goToAdminPanel}
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 border-2 border-primary/10">
                      <AvatarImage src={user?.avatar ? getFileUrl(user.avatar) : ''} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                        {user?.name || user?.email?.split('@')[0]}
                      </p>
                      <button 
                        onClick={handleLogout}
                        className="text-[10px] text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <LogOut className="h-3 w-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={goToAdminPanel}
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-1 mt-8">
                  {isAuthenticated && (
                    <div className="flex items-center gap-3 p-4 mb-4 bg-primary/5 rounded-xl">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user?.avatar ? getFileUrl(user.avatar) : ''} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{user?.name || user?.email}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  )}
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
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <button
                          onClick={() => { goToAdminPanel(); setIsOpen(false); }}
                          className="block w-full text-left py-3 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Settings className="h-4 w-4 inline mr-2" />
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-3 px-4 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors mt-4"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { goToAdminPanel(); setIsOpen(false); }}
                      className="block w-full text-left py-3 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <UserIcon className="h-4 w-4 inline mr-2" />
                      Login / Admin
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