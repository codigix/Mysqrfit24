import { Mail, Phone, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { TeamMember } from '@/types/site';

export const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await apiService.team.list();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const displayMembers = members.length > 0 ? members : [
    {
      id: '1',
      name: "Sarah Mitchell",
      role: "Senior Real Estate Agent",
      image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567"
    },
    {
      id: '2',
      name: "Michael Chen",
      role: "Property Specialist",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      email: "michael@example.com",
      phone: "+1 (555) 234-5678"
    },
    {
      id: '3',
      name: "Jennifer Lopez",
      role: "Investment Consultant",
      image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      email: "jennifer@example.com",
      phone: "+1 (555) 345-6789"
    },
    {
      id: '4',
      name: "David Richardson",
      role: "Luxury Homes Expert",
      image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
      email: "david@example.com",
      phone: "+1 (555) 456-7890"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">meet our team</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            New Arrivals & Expert Agents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our dedicated team of professionals is ready to help you find your dream property
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {displayMembers.map((member, idx) => (
            <Card key={member.id || idx} className="border-0 overflow-hidden hover:shadow-elegant transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getFileUrl(member.image_url)}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 ">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-semibold mb-4">
                    {member.role}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
