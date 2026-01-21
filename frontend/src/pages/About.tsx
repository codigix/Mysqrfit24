import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/mysqfit.png';
import { Building, Users, Target, Award, Phone, Mail, MapPin, Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFileUrl, apiService } from '@/services/api';
import { TeamMember } from '@/types/site';

const About = () => {
  const stats = [
    { value: '500+', label: 'Properties Listed', icon: Building },
    { value: '10K+', label: 'Happy Customers', icon: Users },
    { value: '50+', label: 'Partner Builders', icon: Award },
    { value: '5+', label: 'Cities Covered', icon: MapPin },
  ];

  const values = [
    {
      icon: Target,
      title: 'Transparency',
      description: 'We believe in complete transparency. No hidden charges, no brokerage fees, just honest real estate dealings.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your dream home is our priority. We work tirelessly to match you with properties that fit your needs and budget.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every property listed goes through our rigorous verification process to ensure you get only the best options.',
    },
  ];

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await apiService.team.list();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const displayTeam = teamMembers.length > 0 ? teamMembers : [
    {
      name: 'Rahul Sharma',
      role: 'Founder & CEO',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: '15+ years in real estate with a vision to make property buying transparent.',
      email: 'rahul@mysqfit.com',
      phone: '+91 98765 43210'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
      bio: 'Expert in streamlining processes and ensuring seamless customer experiences.',
      email: 'priya@mysqfit.com',
      phone: '+91 98765 43211'
    },
    {
      name: 'Amit Kumar',
      role: 'Chief Technology Officer',
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Tech enthusiast building innovative solutions for the real estate industry.',
      email: 'amit@mysqfit.com',
      phone: '+91 98765 43212'
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Customer Success',
      image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Dedicated to ensuring every customer finds their perfect property.',
      email: 'sneha@mysqfit.com',
      phone: '+91 98765 43213'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-housiey-dark">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-4xl font-bold text-housiey-dark-foreground mb-4">
            About MySqfit
          </h1>
          <p className="text-lg text-housiey-dark-foreground/80 max-w-2xl mx-auto">
            We are on a mission to revolutionize real estate in India by making property 
            buying and renting simple, transparent, and hassle-free.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-8 h-8 text-housiey-red mx-auto mb-3" />
                    <div className="text-md font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-md font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MySqfit was born out of frustration with the traditional real estate industry. 
                  Our founders experienced firsthand the challenges of property buying – hidden 
                  charges, lack of transparency, and endless brokerage fees.
                </p>
                <p>
                  In 2020, we decided to change this. We built MySqfit with a simple promise: 
                  zero brokerage, complete transparency, and a customer-first approach. Today, 
                  we are proud to have helped thousands of families find their dream homes.
                </p>
                <p>
                  Our platform connects you directly with verified builders and property owners, 
                  eliminating middlemen and ensuring you get the best deals in the market.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-md overflow-hidden bg-housiey-dark">
                <img 
                  src={getFileUrl("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop")}
                  alt="Modern building"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-housiey-red text-housiey-red-foreground p-6 rounded-xl">
                <div className="text-md font-bold">5+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-md font-bold text-foreground mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at MySqfit
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center hover:shadow-elegant transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 bg-housiey-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-housiey-green-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-md font-bold text-foreground mb-3">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind MySqfit working to transform your property journey
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTeam.map((member) => (
              <Card key={member.name} className="overflow-hidden group hover:shadow-elegant transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={getFileUrl(member.image_url)}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4 text-center">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-housiey-red mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="p-2 bg-muted hover:bg-housiey-red/10 text-muted-foreground hover:text-housiey-red rounded-full transition-colors"
                        title={member.email}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {member.phone && (
                      <a 
                        href={`tel:${member.phone}`} 
                        className="p-2 bg-muted hover:bg-housiey-red/10 text-muted-foreground hover:text-housiey-red rounded-full transition-colors"
                        title={member.phone}
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 bg-housiey-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-md font-bold text-housiey-dark-foreground mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-housiey-dark-foreground/80 mb-8 max-w-xl mx-auto">
            Get in touch with our team today and let us help you find the perfect home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="tel:+919876543210">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </Button>
            </a>
            <a href="mailto:hello@mysqfit.com">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent border-housiey-dark-foreground/30 text-housiey-dark-foreground hover:bg-housiey-dark-foreground/10 w-full sm:w-auto">
                <Mail className="w-4 h-4" />
                hello@mysqfit.com
              </Button>
            </a>
          </div>
          
          <div className="flex justify-center gap-4">
            <a href="#" className="text-housiey-dark-foreground/60 hover:text-housiey-red transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-housiey-dark-foreground/60 hover:text-housiey-red transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-housiey-dark border-t border-housiey-dark-foreground/10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Link to="/" className="flex items-center">
              <img src={logoImage} className="h-auto w-40" alt="MySqft 24" />
            </Link>
            <p className="text-housiey-dark-foreground/60 text-sm text-center">
              © 2024 MySqfit. Connecting you with premium properties worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;