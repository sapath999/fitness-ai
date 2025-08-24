import * as React from 'react';
import { useState } from 'react';

const DnaAnimation: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const bars = Array.from({ length: 30 });

  return (
    <div
      className="w-full h-full flex items-center justify-center p-4 perspective-1000 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-700/10 via-transparent to-transparent"></div>

      {/* Main DNA structure */}
      <div className={`w-[140px] h-[480px] transform-style-3d transition-all duration-700 ${
        isHovered ? 'animate-rotate-y-fast' : 'animate-rotate-y'
      }`}>
        {bars.map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-1 transform-style-d"
            style={{
              top: `${i * 16}px`,
              animation: `dna-wave ${isHovered ? '3s' : '6s'} ease-in-out ${i * 0.08}s infinite`,
            }}
          >
            {/* Professional DNA base pairs */}
            <div
              className="absolute left-[calc(50%-4px)] w-2 h-2 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg"
              style={{
                transform: `rotateY(90deg) translateX(60px)`,
                filter: 'drop-shadow(0 0 3px rgba(6, 182, 212, 0.4))',
                transition: 'all 0.3s ease'
              }}
            ></div>
            <div
              className="absolute left-[calc(50%-4px)] w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg"
              style={{
                transform: `rotateY(90deg) translateX(-60px)`,
                filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.4))',
                transition: 'all 0.3s ease'
              }}
            ></div>

            {/* Clean connecting bridge */}
            <div
              className="absolute left-[calc(50%-60px)] w-[120px] h-0.5 bg-gradient-to-r from-cyan-400/40 via-slate-300/60 to-blue-500/40"
              style={{
                transform: `rotateY(0deg)`,
                boxShadow: '0 0 2px rgba(148, 163, 184, 0.3)'
              }}
            ></div>

            {/* Structural markers for major grooves */}
            {i % 5 === 0 && (
              <div
                className="absolute left-1/2 top-0 w-0.5 h-0.5 bg-slate-400/60 rounded-full"
                style={{
                  transform: `translateX(-50%) translateY(-1px)`,
                }}
              ></div>
            )}
          </div>
        ))}

        {/* Central axis indicator */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-400/20 to-transparent transform -translate-x-1/2"></div>
      </div>

      <style>{`
        @keyframes rotate-y {
          0% { transform: rotateY(0deg) rotateX(8deg); }
          100% { transform: rotateY(360deg) rotateX(8deg); }
        }
        @keyframes rotate-y-fast {
          0% { transform: rotateY(0deg) rotateX(12deg) scale(1.05); }
          100% { transform: rotateY(360deg) rotateX(12deg) scale(1.05); }
        }
        @keyframes dna-wave {
          0%, 100% {
            transform: rotateY(0deg) scaleX(1);
          }
          25% {
            transform: rotateY(90deg) scaleX(0.85);
          }
          50% {
            transform: rotateY(180deg) scaleX(0.7);
          }
          75% {
            transform: rotateY(270deg) scaleX(0.85);
          }
        }

        .animate-rotate-y {
          animation: rotate-y 25s linear infinite;
        }
        .animate-rotate-y-fast {
          animation: rotate-y-fast 15s linear infinite;
        }

        .perspective-1000 {
          perspective: 1200px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default DnaAnimation;
