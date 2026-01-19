import { TrendingUp, Home, Users, Loader2 } from 'lucide-react';
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
      description: 'Premium properties sold'
    },
    {
      icon: TrendingUp,
      number: getSettingValue('stats_sales_volume', '$1B+'),
      label: 'IN SALES',
      description: 'Total transaction volume'
    },
    {
      icon: Users,
      number: getSettingValue('stats_satisfied_customers', '1,000+'),
      label: 'SATISFIED CUSTOMERS',
      description: 'Happy homeowners'
    }
  ];

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
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
