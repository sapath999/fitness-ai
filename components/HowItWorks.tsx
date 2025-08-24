import * as React from 'react';
import { useScrollAnimation } from './useScrollAnimation';
import Footer from './Footer';

interface StepProps {
    number: string;
    title: string;
    description: string;
    isLast?: boolean;
}

const Step: React.FC<StepProps> = ({number, title, description, isLast = false}) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-6">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-bold text-xl ring-4 ring-cyan-500/10 shrink-0">
                {number}
            </div>
            {!isLast && <div className="w-px h-full bg-gradient-to-b from-cyan-500 to-fuchsia-500 mt-2"></div>}
        </div>
        <div className={`pb-16 pt-2 w-full ${isLast ? 'pb-0' : ''}`}>
            <div className="bg-slate-800/60 backdrop-blur-lg p-6 rounded-xl border border-slate-600/30 shadow-2xl shadow-cyan-500/10 hover:-translate-y-1 hover:shadow-cyan-500/20 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{title}</h3>
                <p className="text-slate-200 drop-shadow-sm">{description}</p>
            </div>
        </div>
    </div>
);


const steps = [
    { number: "1", title: "Scan Your Report", description: "Use your device's camera to securely scan your DNA report. Our platform analyzes the image directly without long-term storage." },
    { number: "2", title: "AI Analysis", description: "Our advanced AI decodes genetic markers related to fitness, nutrition, and wellness from the image in minutes." },
    { number: "3", title: "Receive Your Plan", description: "Get your dynamic, hyper-personalized fitness and nutrition plan on your dashboard. Your plan evolves as you make progress.", isLast: true }
];

const HowItWorks: React.FC = () => {
    const { ref, isVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden" ref={ref as React.RefObject<HTMLElement>}>
      {/* DNA Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        poster="https://images.pexels.com/videos/3191420/free-photo-3191420.jpeg?auto=compress&cs=tinysrgb&w=1280"
      >
        <source src="https://videos.pexels.com/video-files/3191420/3191420-sd_640_360_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/50 z-10"></div>

      {/* Blue DNA Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-cyan-900/10 z-20"></div>

      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#b6d3f0] drop-shadow-lg">Simple Steps to a Healthier You</h2>
          <p className="mt-4 text-lg text-slate-200 drop-shadow-md">
            Start your personalized fitness journey in minutes. It's secure, fast, and built around you.
          </p>
        </div>
        <div className="mt-16 max-w-2xl mx-auto">
            {steps.map((step, index) => (
                <div
                    key={step.number}
                    className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}
                    style={{ transitionDelay: `${100 + index * 200}ms` }}
                >
                    <Step
                        number={step.number}
                        title={step.title}
                        description={step.description}
                        isLast={step.isLast}
                    />
                </div>
            ))}
        </div>
      </div>
              <Footer />

    </section>
  );
};

export default HowItWorks;
