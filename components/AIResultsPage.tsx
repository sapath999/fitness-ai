import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AIResultsPageProps {
  analysisResult: string;
  onBack: () => void;
  onAnalyzeAnother: () => void;
}

interface SpeciesInfo {
  type: 'human' | 'animal';
  commonName: string;
  scientificName: string;
  imageUrl: string;
}

const AIResultsPage: React.FC<AIResultsPageProps> = ({ analysisResult, onBack, onAnalyzeAnother }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [speciesInfo, setSpeciesInfo] = useState<SpeciesInfo>({
    type: 'human',
    commonName: 'Human',
    scientificName: 'Homo sapiens',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  });
  const sectionsRef = useRef<HTMLElement[]>([]);

  const formatText = (text: string) => {
    // Remove markdown symbols and clean up formatting
    return text
      .replace(/#+\s*/g, '') // Remove # headers
      .replace(/\*\*/g, '') // Remove bold formatting
      .replace(/\* /g, '') // Remove bullet points
      .replace(/- /g, '') // Remove dashes
      .trim();
  };

  // Parse analysis result to identify species and extract sections
  const parseAnalysisResult = (result: string) => {
    // Detect species with their respective images
    const speciesMap: { [key: string]: SpeciesInfo } = {
      'chimpanzee': { 
        type: 'animal', 
        commonName: 'Chimpanzee', 
        scientificName: 'Pan troglodytes',
        imageUrl: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop'
      },
      'dog': { 
        type: 'animal', 
        commonName: 'Domestic Dog', 
        scientificName: 'Canis familiaris',
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
      },
      'cat': { 
        type: 'animal', 
        commonName: 'Domestic Cat', 
        scientificName: 'Felis catus',
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
      },
      'mouse': { 
        type: 'animal', 
        commonName: 'House Mouse', 
        scientificName: 'Mus musculus',
        imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop'
      },
      'horse': { 
        type: 'animal', 
        commonName: 'Horse', 
        scientificName: 'Equus caballus',
        imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop'
      },
      'cow': { 
        type: 'animal', 
        commonName: 'Domestic Cattle', 
        scientificName: 'Bos taurus',
        imageUrl: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=400&fit=crop'
      },
      'lion': { 
        type: 'animal', 
        commonName: 'Lion', 
        scientificName: 'Panthera leo',
        imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=400&fit=crop'
      },
      'tiger': { 
        type: 'animal', 
        commonName: 'Tiger', 
        scientificName: 'Panthera tigris',
        imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop'
      },
      'elephant': { 
        type: 'animal', 
        commonName: 'Elephant', 
        scientificName: 'Elephas maximus',
        imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=400&fit=crop'
      },
      'wolf': { 
        type: 'animal', 
        commonName: 'Gray Wolf', 
        scientificName: 'Canis lupus',
        imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=400&fit=crop'
      },
      'gorilla': { 
        type: 'animal', 
        commonName: 'Western Gorilla', 
        scientificName: 'Gorilla gorilla',
        imageUrl: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=400&h=400&fit=crop'
      },
      'dolphin': { 
        type: 'animal', 
        commonName: 'Bottlenose Dolphin', 
        scientificName: 'Tursiops truncatus',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
      }
    };

    let detectedSpecies: SpeciesInfo = { 
      type: 'human', 
      commonName: 'Human', 
      scientificName: 'Homo sapiens',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    };
    
    // Check for animal patterns in the result
    for (const [speciesKey, info] of Object.entries(speciesMap)) {
      const pattern = new RegExp(speciesKey, 'i');
      if (pattern.test(result)) {
        detectedSpecies = info;
        break;
      }
    }

    // Parse sections
    const sections = {
      physical: '',
      nutrition: '',
      health: ''
    };

    // Extract sections based on content
    if (detectedSpecies.type === 'animal') {
      const physicalMatch = result.match(/(?:physical|trait|characteristic|morphology)[\s\S]*?(?=(?:nutrition|diet|health|$))/i);
      const nutritionMatch = result.match(/(?:nutrition|diet|feeding|food)[\s\S]*?(?=(?:health|physical|$))/i);
      const healthMatch = result.match(/(?:health|medical|genetic|disease|condition)[\s\S]*?(?=(?:nutrition|physical|$))/i);

      if (physicalMatch) sections.physical = physicalMatch[0].trim();
      if (nutritionMatch) sections.nutrition = nutritionMatch[0].trim();
      if (healthMatch) sections.health = healthMatch[0].trim();
    } else {
      const workoutMatch = result.match(/(?:workout|exercise|fitness|training)[\s\S]*?(?=(?:nutrition|diet|health|$))/i);
      const nutritionMatch = result.match(/(?:nutrition|diet|macro|meal)[\s\S]*?(?=(?:health|workout|exercise|$))/i);
      const healthMatch = result.match(/(?:health|genetic|predisposition|injury|risk)[\s\S]*?(?=(?:workout|nutrition|$))/i);

      if (workoutMatch) sections.physical = workoutMatch[0].trim();
      if (nutritionMatch) sections.nutrition = nutritionMatch[0].trim();
      if (healthMatch) sections.health = healthMatch[0].trim();
    }

    // Fallback: distribute content if parsing fails
    if (!sections.physical && !sections.nutrition && !sections.health) {
      const parts = result.split('\n\n').filter(part => part.trim());
      sections.physical = parts.slice(0, Math.ceil(parts.length / 3)).join('\n\n');
      sections.nutrition = parts.slice(Math.ceil(parts.length / 3), Math.ceil(2 * parts.length / 3)).join('\n\n');
      sections.health = parts.slice(Math.ceil(2 * parts.length / 3)).join('\n\n');
    }

    return { sections, detectedSpecies };
  };

  const { sections, detectedSpecies } = parseAnalysisResult(analysisResult);

  useEffect(() => {
    setSpeciesInfo(detectedSpecies);
  }, [analysisResult]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());


    // Create color shifting animation based on scroll
    const colorTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    if (backgroundRef.current) {
      colorTimeline
        .to(backgroundRef.current, {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 30%, #000000 50%, #0f172a 70%, #1e3a8a 100%)', // Milk blue
          duration: 1
        })
        .to(backgroundRef.current, {
          background: 'linear-gradient(135deg, #eab308 0%, #1f1611 30%, #000000 50%, #1f1611 70%, #eab308 100%)', // Yellow
          duration: 1
        })
        .to(backgroundRef.current, {
          background: 'linear-gradient(135deg, #16a34a 0%, #0f1b0f 30%, #000000 50%, #0f1b0f 70%, #16a34a 100%)', // Green
          duration: 1
        })
        .to(backgroundRef.current, {
          background: 'linear-gradient(135deg, #9333ea 0%, #1e0a2e 30%, #000000 50%, #1e0a2e 70%, #9333ea 100%)', // Purple
          duration: 1
        });
    }

    // Parallax effects for content sections
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        const speed = 0.5 + index * 0.2; // Different parallax speeds
        
        gsap.fromTo(section, 
          { 
            y: 100,
            opacity: 0
          },
          {
            y: -50,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: speed
            }
          }
        );

        // Content fade-in animation
        gsap.fromTo(section.querySelector('.content-text'), 
          { 
            opacity: 0, 
            y: 50,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const getSectionTitle = (sectionKey: string) => {
    if (speciesInfo.type === 'animal') {
      const animalTitles = {
        physical: 'Physical Characteristics',
        nutrition: 'Dietary Requirements',
        health: 'Health Considerations'
      };
      return animalTitles[sectionKey as keyof typeof animalTitles] || sectionKey;
    } else {
      const humanTitles = {
        physical: 'Workout Routines',
        nutrition: 'Optimized Nutrition',
        health: 'Hereditary Disease Prevention'
      };
      return humanTitles[sectionKey as keyof typeof humanTitles] || sectionKey;
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 30%, #000000 50%, #0f172a 70%, #1e3a8a 100%)'
        }}
      />


      {/* Content */}
      <div className="relative z-20 text-white">
        {/* Section 1: Species Introduction */}
        <section 
          ref={el => { if (el) sectionsRef.current[0] = el; }}
          className="relative h-screen flex items-center justify-center"
        >
          <div className="content-text flex items-center justify-center gap-12 max-w-6xl mx-auto px-8">
            {/* Species Image */}
            <div className="hidden md:block">
              <img 
                src={speciesInfo.imageUrl}
                alt={speciesInfo.commonName}
                className="w-64 h-64 rounded-full object-cover border-4 border-white shadow-2xl shadow-white/30"
              />
            </div>
            
            {/* Species Info */}
            <div className="text-center md:text-left">
              <h1 className="text-6xl md:text-8xl font-thin mb-6 tracking-widest">
                {speciesInfo.commonName}
              </h1>
              <p className="text-2xl md:text-3xl text-white/80 font-light italic mb-8">
                {speciesInfo.scientificName}
              </p>
              <div className="w-32 h-1 bg-white mx-auto md:mx-0 mb-8"></div>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Genetic analysis complete. Scroll to discover insights.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Physical/Workout */}
        <section 
          ref={el => { if (el) sectionsRef.current[1] = el; }}
          className="relative h-screen flex items-center"
        >
          <div className="content-text w-full max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-thin mb-8 tracking-wide">
                  {getSectionTitle('physical')}
                </h2>
                <div className="text-lg leading-relaxed space-y-4 bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                  {sections.physical.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-white/95">
                      {formatText(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Nutrition */}
        <section 
          ref={el => { if (el) sectionsRef.current[2] = el; }}
          className="relative h-screen flex items-center"
        >
          <div className="content-text w-full max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex justify-center order-2 lg:order-1">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-5xl md:text-6xl font-thin mb-8 tracking-wide">
                  {getSectionTitle('nutrition')}
                </h2>
                <div className="text-lg leading-relaxed space-y-4 bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                  {sections.nutrition.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-white/95">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Health */}
        <section 
          ref={el => { if (el) sectionsRef.current[3] = el; }}
          className="relative h-screen flex items-center"
        >
          <div className="content-text w-full max-w-6xl mx-auto px-8 text-center">
            <h2 className="text-5xl md:text-6xl font-thin mb-8 tracking-wide">
              {getSectionTitle('health')}
            </h2>
            <div className="text-lg leading-relaxed space-y-4 max-w-4xl mx-auto bg-black/20 backdrop-blur-sm p-6 rounded-lg">
              {sections.health.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-white/95">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Actions Section */}
        <section className="relative py-20 bg-black/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h3 className="text-4xl font-thin mb-8 tracking-wide">
              Analysis Complete
            </h3>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Your comprehensive genetic analysis has been completed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={onAnalyzeAnother}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-medium py-4 px-8 transition-all duration-300 text-lg tracking-wide backdrop-blur-sm"
              >
                Analyze Another Sample
              </button>
              
              <button 
                onClick={onBack}
                className="border border-white/50 text-white hover:bg-white/10 font-medium py-4 px-8 transition-all duration-300 text-lg tracking-wide backdrop-blur-sm"
              >
                Return to Home
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIResultsPage;
