import * as React from 'react';
import { useScrollAnimation } from './useScrollAnimation';

const InspirationVideo: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.4 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative h-96 md:h-[500px] my-20 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/videos/background.mp4"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/60 z-10"></div>
      
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center p-4">
          <h2 className={`text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tighter drop-shadow-lg scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
            Engineered For <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-cyan-400 to-blue-500">Peak Performance</span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default InspirationVideo;
