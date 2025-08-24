import * as React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 leading-tight tracking-tighter animate-fadeInUp drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-cyan-400 to-blue-500">Genetic Potential</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto animate-fadeInUp drop-shadow-md" style={{ animationDelay: '0.4s' }}>
            Fitness AI analyzes your DNA to create a fitness and nutrition plan that's uniquely yours. Stop guessing, start optimizing.
          </p>
          <div className="mt-8 flex flex-col items-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={onGetStarted}
              className="bg-blue-300 hover:bg-blue-400 text-slate-900 font-bold py-4 px-10 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
