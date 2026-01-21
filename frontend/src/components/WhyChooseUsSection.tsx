import { Percent, MapPin, Car, Users, Wallet, BookOpen } from 'lucide-react';

const WhyChooseUsSection = () => {
  const advantages = [
    {
      icon: Percent,
      title: "Bottom Rate Guarantee",
      description: "MySqfit guarantees the bottom rate or refunds double the difference."
    },
    {
      icon: BookOpen,
      title: "Online Site Visit",
      description: "Visit projects from home with MySqfit's Online Site Visit concept."
    },
    {
      icon: MapPin,
      title: "Free Site Visit",
      description: "Free pickup & drop for unlimited site visits across the city."
    },
    {
      icon: Users,
      title: "No Brokerage Charges",
      description: "Get personalized RM managing everything from site visit to booking."
    }
  ];

  return (
    <section className="py-20 bg-housiey-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
             <BookOpen className="h-5 w-5 text-housiey-dark-foreground/80" />
             <span className="text-sm font-bold text-housiey-dark-foreground/80 uppercase tracking-widest">Advantages</span>
          </div>
          <h2 className="text-4xl md:text-4xl font-bold text-housiey-dark-foreground mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-housiey-dark-foreground/70 max-w-2xl">
            Discover the key advantages of investing with us.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl flex flex-col items-start shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-housiey-green/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-housiey-green" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {advantage.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {advantage.description}
                </p>
              </div>
            );
          })}

          {/* Last Special Card */}
          <div className="lg:col-span-1 bg-amber-600 rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-xl group">
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                    <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                    375Cr+
                </h3>
                <p className="text-white/90 text-sm font-bold leading-tight mb-4">
                    Brokerage Saved Till Now
                </p>
            </div>
            
            {/* Image Placeholder representing the person in the screenshot */}
            <div className="absolute bottom-0 right-0 w-full h-4/5 flex items-end justify-end pointer-events-none">
                 <div className="w-4/5 h-full opacity-40 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-t from-black/20 to-transparent">
                    {/* In a real scenario, an <img> tag with the person's photo would go here */}
                 </div>
            </div>

            <div className="relative z-10 mt-auto">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                     <div className="w-2 h-2 bg-housiey-green rounded-full animate-pulse" />
                     <span className="text-[10px] text-white font-bold uppercase tracking-wider">MySqfit Trusted</span>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
