import { Gift, Car, ShieldCheck, User } from 'lucide-react';

const ValuePropositions = () => {
  const perks = [
    {
      icon: Gift,
      title: "Project Unboxing",
      description: "Complete Project analysis with overview, location, amenities, plans, carpet area, payment schemes, pros & cons, builder profile etc."
    },
    {
      icon: Car,
      title: "Pros & Cons",
      description: "First time in Indian Real Estate, Get unbiased views of projects with Pros & Cons by in depth analysis from our experts."
    },
    {
      icon: ShieldCheck,
      title: "Virtual 360 Tour",
      description: "Experience the 3D Tour & feel the view, facing, & amenities of the projects by sitting in your home only."
    },
    {
      icon: User,
      title: "Real Time Calling",
      description: "Get instant resolution of your queries by our 24/7 Property experts."
    }
  ];

  return (
    <section className="py-20 bg-housiey-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-md md:text-4xl font-bold text-housiey-dark-foreground mb-3">
            MySqfit Unique Features
          </h2>
          <p className="text-housiey-dark-foreground/70 max-w-2xl mx-auto">
            Discover what makes us different from traditional real estate platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <div 
                key={index} 
                className=" p-6 rounded-2xl text-center shadow-card hover:shadow-elegant transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-housiey-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-housiey-green-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {perk.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {perk.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;