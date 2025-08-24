import * as React from 'react';
import { useScrollAnimation } from './useScrollAnimation';

const DumbbellIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.25 10.25H18.75C19.5784 10.25 20.25 10.9216 20.25 11.75V12.25C20.25 13.0784 19.5784 13.75 18.75 13.75H15.25"/>
        <path d="M8.75 10.25H5.25C4.42157 10.25 3.75 10.9216 3.75 11.75V12.25C3.75 13.0784 4.42157 13.75 5.25 13.75H8.75"/>
        <path d="M10.5 15.5L13.5 8.5"/>
        <path d="M8.75 12H15.25"/>
    </svg>
);

const NutritionIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.25 9.75L12 18.25L20.75 9.75C21.75 8.75 21.75 7.25 20.75 6.25C19.75 5.25 18.25 5.25 17.25 6.25L12 11.25L6.75 6.25C5.75 5.25 4.25 5.25 3.25 6.25C2.25 7.25 2.25 8.75 3.25 9.75Z"/>
    </svg>
);

const ShieldIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.75C12 2.75 4.75 4.75 4.75 12C4.75 19.25 12 21.25 12 21.25C12 21.25 19.25 19.25 19.25 12C19.25 4.75 12 2.75 12 2.75Z"/>
        <path d="M12 13.25C12.9665 13.25 13.75 12.4665 13.75 11.5C13.75 10.5335 12.9665 9.75 12 9.75C11.0335 9.75 10.25 10.5335 10.25 11.5C10.25 12.4665 11.0335 13.25 12 13.25Z"/>
    </svg>
);


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-slate-800/60 backdrop-blur-lg p-6 rounded-xl border border-slate-600/30 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:-translate-y-2 hover:shadow-cyan-500/20 transition-all duration-300 h-full">
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-700/70 mb-4 border border-slate-500/50 shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{title}</h3>
    <p className="text-slate-200 drop-shadow-sm">{description}</p>
  </div>
);

const featuresData = [
  {
    icon: <DumbbellIcon className="w-7 h-7 text-cyan-400" />,
    title: "Personalized Workouts",
    description: "AI crafts workout routines based on your genetic muscle composition, endurance markers, and recovery speed."
  },
  {
    icon: <NutritionIcon className="w-7 h-7 text-fuchsia-400" />,
    title: "Optimized Nutrition",
    description: "Discover the ideal macronutrient ratio, vitamin needs, and foods that work best for your body's unique profile."
  },
  {
    icon: <ShieldIcon className="w-7 h-7 text-emerald-400" />,
    title: "Proactive Prevention",
    description: "Identify genetic predispositions to certain injuries or deficiencies and get preventative exercises and nutritional advice."
  }
];

const Features: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 });
  
  return (
    <section id="features" className="py-20" ref={ref as React.RefObject<HTMLElement>}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Your DNA-Powered Health Blueprint</h2>
          <p className="mt-4 text-lg text-slate-200 drop-shadow-md">
            Our AI translates your genetic markers into actionable insights for a healthier, stronger you.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
             <div
              key={feature.title}
              className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
