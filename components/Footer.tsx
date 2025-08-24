import * as React from "react";
import { useScrollAnimation } from "./useScrollAnimation";
import Marquee from "react-fast-marquee";

// Sample partner logos - replace with your actual logo URLs
const partnerLogos = [
  { name: "AI/ML API", logo: "/aiml.png" },
  { name: "OpenAi", logo: "/openai.png" },
  { name: "lablab", logo: "lablab.png" }
];

const Footer: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className={`absolute w-full bottom-1 mt-auto  scroll-reveal ${
        isVisible ? "is-visible" : ""
      }`}
    >
      <div className="py-8 px-4 relative">
  
        
        <Marquee autoFill >
          {partnerLogos.map((value, index) => {
        return (
          <div key={index} className="flex items-center mx-8">
            <img src={value.logo} className="w-16 h-16 mr-3 " alt={value.name} />
            <p className="text-3xl font-semibold ">{value.name}</p>
          </div>
        );
          })}
        </Marquee>
        
       
      </div>
    </footer>
  );
};

export default Footer;
