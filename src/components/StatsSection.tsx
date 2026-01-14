import { TrendingUp, Home, Users } from 'lucide-react';

export const StatsSection = () => {
  const stats = [
    {
      icon: Home,
      number: '7,000+',
      label: 'SOLD HOMES',
      description: 'Premium properties sold'
    },
    {
      icon: TrendingUp,
      number: '$1B+',
      label: 'IN SALES',
      description: 'Total transaction volume'
    },
    {
      icon: Users,
      number: '1,000+',
      label: 'SATISFIED CUSTOMERS',
      description: 'Happy homeowners'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-4 rounded-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <p className="text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
