import { TrendingUp, Home, Users, Loader2, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { SiteSetting } from '@/types/site';

export const StatsSection = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiService.settings.getAll();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings for stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getSettingValue = (key: string, defaultValue: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

  const stats = [
    {
      icon: Home,
      number: getSettingValue('stats_sold_homes', '7,000+'),
      label: 'SOLD HOMES',
      description: 'Premium properties sold',
      color: 'from-primary to-primary/80',
      lightColor: 'bg-primary/5',
      accentColor: 'text-primary'
    },
    {
      icon: TrendingUp,
      number: getSettingValue('stats_sales_volume', '$1B+'),
      label: 'IN SALES',
      description: 'Total transaction volume',
      color: 'from-primary/80 to-primary/60',
      lightColor: 'bg-primary/10',
      accentColor: 'text-primary'
    },
    {
      icon: Users,
      number: getSettingValue('stats_satisfied_customers', '1,000+'),
      label: 'SATISFIED CUSTOMERS',
      description: 'Happy homeowners',
      color: 'from-accent to-accent/80',
      lightColor: 'bg-accent/5',
      accentColor: 'text-accent'
    }
  ];

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">Our Impact</span>
          <h2 className="text-4xl md:text-4xl font-bold mb-4 text-foreground mt-2">
            Trusted by Thousands
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy clients who have successfully found their perfect property
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`relative group ${stat.lightColor} p-8 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-primary/10 hover:border-primary/30 bg-white/60 backdrop-blur-sm`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className={`${stat.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <ArrowUpRight className="h-6 w-6" />
                    </div>
                  </div>

                  <div className={`text-2xl md:text-3xl font-black ${stat.accentColor} mb-3 tracking-tight`}>
                    {stat.number}
                  </div>

                  <div className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">
                    {stat.label}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {stat.description}
                  </p>

                  <div className={`h-1 w-12 bg-gradient-to-r ${stat.color} rounded-full mt-6 group-hover:w-24 transition-all duration-300`} />
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Real results from real customers across all of Pune and beyond. Our commitment to excellence continues to drive success.
          </p>
        </div>
      </div>
    </section>
  );
};
