import { ImageDown, Upload, X, Plus, User, Scale, Ruler } from 'lucide-react';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface UserInfo {
  age: string;
  weight: string;
  height: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-6 p-8">
    <div className="relative">
      <svg className="animate-spin h-20 w-20 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-pulse"></div>
    </div>
    <div className="text-center space-y-3">
      <h3 className="text-2xl font-bold text-white">AI is analyzing your samples...</h3>
      <p className="text-cyan-300">Processing multiple DNA reports for comprehensive analysis</p>
    </div>
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

const DietPlanLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4 p-6">
    <div className="relative">
      <svg className="animate-spin h-12 w-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div className="absolute inset-0 rounded-full bg-green-400/30 animate-pulse"></div>
    </div>
    <div className="text-center space-y-2">
      <h4 className="text-lg font-bold text-white">Generating Your Diet Plan...</h4>
      <p className="text-green-300 text-sm">Creating personalized nutrition recommendations</p>
    </div>
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

interface AnalysisPageProps {
  onBack: () => void;
  onAnalysisComplete: (result: string) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onBack, onAnalysisComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDietPlanLoading, setIsDietPlanLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ age: '', weight: '', height: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const dietSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations for page entrance
    if (heroRef.current && uploadSectionRef.current && instructionsRef.current) {
      const tl = gsap.timeline();
      
      // Set initial states
      gsap.set([heroRef.current, uploadSectionRef.current, instructionsRef.current], {
        y: 100,
        opacity: 0
      });

      // Animate elements in sequence
      tl.to(heroRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(uploadSectionRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .to(instructionsRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6");
    }

    // Parallax effect for background
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const video = document.querySelector('.background-video') as HTMLVideoElement;
        if (video) {
          gsap.set(video, {
            y: self.progress * 100
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get canvas context'));
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMultipleFileSelect = async (files: FileList) => {
    const maxFiles = 3;
    const currentCount = uploadedFiles.length;
    const availableSlots = maxFiles - currentCount;
    
    setError(null); // Clear previous errors
  
    if (availableSlots <= 0) {
      setError('Maximum 3 files allowed. Please remove existing files first.');
      return;
    }
  
    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newFiles: UploadedFile[] = [];
    const errors: string[] = [];
  
    for (const file of filesToProcess) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not a valid image file.`);
        continue;
      }
  
      // Validate file size (increased to 20MB)
      if (file.size > 20 * 1024 * 1024) {
        errors.push(`${file.name} is too large. Please select images under 20MB.`);
        continue;
      }
  
      try {
        const resizedPreview = await resizeImage(file);
        newFiles.push({
          file,
          preview: resizedPreview,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        errors.push(`Failed to process ${file.name}. The file might be corrupted or in an unsupported format.`);
      }
    }
  
    if (errors.length > 0) {
      setError(errors.join(' '));
    }
  
    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      // Auto-scroll to uploaded files
      setTimeout(() => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleMultipleFileSelect(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultipleFileSelect(files);
    }
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    setError(null);
  };

  const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const formatDietPlan = (text: string) => {
    // Remove markdown symbols and format text nicely
    const lines = text.split('\n');
    const formattedContent: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        formattedContent.push(<br key={index} />);
        return;
      }

      // Main headers (###)
      if (trimmedLine.startsWith('###') || trimmedLine.startsWith('####')) {
        const title = trimmedLine.replace(/#+\s*/, '').replace(/\*\*/g, '');
        formattedContent.push(
          <h3 key={index} className="text-xl font-bold text-green-400 mt-6 mb-3">
            {title}
          </h3>
        );
      }
      // Sub headers (**text**)
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        const title = trimmedLine.replace(/\*\*/g, '');
        formattedContent.push(
          <h4 key={index} className="text-lg font-semibold text-cyan-300 mt-4 mb-2">
            {title}
          </h4>
        );
      }
      // List items starting with - or *
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        const content = trimmedLine.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
        formattedContent.push(
          <li key={index} className="text-slate-200 mb-2 ml-4">
            • {content}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\./.test(trimmedLine)) {
        const content = trimmedLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
        formattedContent.push(
          <div key={index} className="text-slate-200 mb-2 font-medium">
            {trimmedLine.match(/^\d+/)?.[0]}. {content}
          </div>
        );
      }
      // Regular paragraphs
      else {
        const content = trimmedLine.replace(/\*\*/g, '');
        formattedContent.push(
          <p key={index} className="text-slate-200 mb-3 leading-relaxed">
            {content}
          </p>
        );
      }
    });

    return formattedContent;
  };

  const generateDietPlan = async () => {
    const { age, weight, height } = userInfo;

    if (!age || !weight || !height) {
      setError('Please fill in all personal information fields for diet plan generation.');
      return;
    }

    setIsDietPlanLoading(true);
    setError(null);

    try {
      const dietPrompt = `As a certified nutritionist and dietitian, create a personalized basic diet plan for a person with the following characteristics:

Age: ${age} years
Weight: ${weight} kg
Height: ${height} cm

Please provide:

1. **Daily Caloric Needs**: Calculate BMR and daily caloric requirements
2. **Macronutrient Breakdown**: Optimal protein, carbs, and fat percentages
3. **Meal Structure**: Suggested meal timing and portion sizes
4. **Food Recommendations**: 
   - 10 recommended foods for this profile
   - 5 foods to limit or avoid
5. **Sample Daily Menu**: 
   - Breakfast, lunch, dinner, and 2 snacks
   - Include approximate calories per meal
6. **Hydration**: Daily water intake recommendations
7. **Special Considerations**: Any specific advice based on age and body composition

Format the response in clear sections with bullet points for easy reading.`;

      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 2048,
          messages: [
            {
              role: 'user',
              content: dietPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        let errorText = '';
        try {
          // Create a clone only for error reading
          const errorClone = response.clone();
          errorText = await errorClone.text();
        } catch (textError) {
          errorText = `Status ${response.status} - Failed to read error details`;
        }
        throw new Error(`Diet plan API request failed: ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Failed to parse diet plan API response as JSON');
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from diet plan API - missing expected data structure');
      }

      const dietPlanText = data.choices[0].message.content || "No diet plan generated.";
      setDietPlan(dietPlanText);

      // Scroll to diet plan section
      setTimeout(() => {
        dietSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err) {
      console.error("Error generating diet plan:", err);
      setError("An error occurred while generating the diet plan. Please check your API key and try again.");
    } finally {
      setIsDietPlanLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one DNA report to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageMessages = uploadedFiles.map(uploadedFile => ({
        type: "image_url" as const,
        image_url: {
          url: uploadedFile.preview,
        },
      }));

      const prompt = `As a world-class geneticist and medical expert, analyze the provided DNA report images and focus specifically on two key areas. Provide your response in clear, easy-to-read format without using markdown symbols like # * - or ** formatting.

ANALYSIS FOCUS:

SECTION 1: DISEASE PREDISPOSITION
Examine the genetic markers and identify any predispositions to:
- Cardiovascular diseases
- Diabetes risk
- Cancer predispositions
- Metabolic disorders
- Autoimmune conditions
- Mental health risks
- Bone and joint health issues
- Other significant health risks shown in the genetic profile

For each identified risk, provide:
- The specific genetic markers involved
- Risk level (low, moderate, high)
- Preventive measures and lifestyle recommendations
- When to seek medical screening

SECTION 2: MUSCLE CAPABILITY AND ATHLETIC PERFORMANCE
Analyze genetic markers related to:
- Muscle fiber composition (fast-twitch vs slow-twitch ratio)
- Strength and power potential
- Endurance capacity
- Recovery speed
- Injury susceptibility
- Response to different types of training

For muscle capabilities, provide:
- Natural athletic strengths based on genetics
- Optimal training approaches
- Sports or activities best suited for this genetic profile
- Recovery recommendations

Format your response using simple paragraphs and clear headings without any markdown symbols. Use plain text formatting only.`;
      
      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                ...imageMessages,
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        let errorText = '';
        try {
          // Create a clone only for error reading
          const errorClone = response.clone();
          errorText = await errorClone.text();
        } catch (textError) {
          errorText = `Status ${response.status} - Failed to read error details`;
        }
        throw new Error(`API request failed: ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Failed to parse API response as JSON');
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API - missing expected data structure');
      }

      const analysisText = data.choices[0].message.content || "No analysis result returned.";
      setAnalysisResult(analysisText);
      onAnalysisComplete(analysisText);

    } catch (err) {
      console.error("Error analyzing reports:", err);
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}. Please check your API key configuration and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full mb-6 border border-cyan-400/30 backdrop-blur-sm">
            <Upload size={40} className="text-cyan-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-thin tracking-wide text-white mb-4">
            DNA Analysis Suite
          </h1>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto leading-relaxed">
            Upload multiple DNA reports for comprehensive genetic analysis and personalized recommendations
          </p>
        </div>

        {/* Upload Section */}
        <div ref={uploadSectionRef} className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          <div
            className={`relative min-h-96 rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-500 backdrop-blur-lg ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                : uploadedFiles.length > 0
                  ? 'border-green-400/50 bg-slate-900/40'
                  : 'border-cyan-400/40 hover:border-cyan-400/60 bg-slate-900/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => uploadedFiles.length < 3 && fileInputRef.current?.click()}
          >
            {uploadedFiles.length > 0 ? (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div key={uploadedFile.id} className="relative group">
                      <div className="relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-600/30">
                        <img 
                          src={uploadedFile.preview} 
                          alt={`DNA Report ${index + 1}`} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-sm font-medium">Sample {index + 1}</p>
                          <p className="text-xs text-slate-300 truncate max-w-32">{uploadedFile.file.name}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(uploadedFile.id);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add More Files Button */}
                  {uploadedFiles.length < 3 && (
                    <div 
                      className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-cyan-400/40 rounded-xl hover:border-cyan-400/60 cursor-pointer transition-all duration-300 hover:bg-cyan-400/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Plus size={32} className="text-cyan-400 mb-2" />
                      <p className="text-cyan-400 font-medium">Add Sample</p>
                      <p className="text-xs text-slate-400">{3 - uploadedFiles.length} more allowed</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">{uploadedFiles.length} Sample{uploadedFiles.length > 1 ? 's' : ''} Ready</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 text-lg"
                  >
                    Analyze All Samples
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 cursor-pointer">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                    <ImageDown size={40} className="text-cyan-400" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-white">Upload DNA Reports</h3>
                    <p className="text-cyan-200">
                      {isDragOver ? 'Drop your files here' : 'Drag and drop up to 3 files here, or click to browse'}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-xs bg-slate-800/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600/30">
                        PNG, JPG, JPEG, WEBP
                      </span>
                      <span className="text-xs bg-slate-800/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600/30">
                        Max 20MB each
                      </span>
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30">
                        Up to 3 files
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Diet Plan Section */}
        <div ref={dietSectionRef} className="max-w-4xl mx-auto">
          <div className="bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full mb-4 border border-green-400/30">
                <Scale size={32} className="text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Personalized Diet Plan</h3>
              <p className="text-slate-300">Enter your personal information to generate a customized basic diet plan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <User size={16} />
                  Age (years)
                </label>
                <input
                  type="number"
                  value={userInfo.age}
                  onChange={(e) => handleUserInfoChange('age', e.target.value)}
                  placeholder="25"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Scale size={16} />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={userInfo.weight}
                  onChange={(e) => handleUserInfoChange('weight', e.target.value)}
                  placeholder="70"
                  min="1"
                  max="500"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Ruler size={16} />
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={userInfo.height}
                  onChange={(e) => handleUserInfoChange('height', e.target.value)}
                  placeholder="175"
                  min="1"
                  max="300"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={generateDietPlan}
                disabled={!userInfo.age || !userInfo.weight || !userInfo.height}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:scale-105 disabled:scale-100 text-lg"
              >
                Generate Diet Plan
              </button>
            </div>

            {isDietPlanLoading && (
              <div className="mt-8 bg-slate-800/30 rounded-xl p-6 border border-slate-600/30">
                <DietPlanLoading />
              </div>
            )}

            {dietPlan && !isDietPlanLoading && (
              <div className="mt-8 bg-slate-800/30 rounded-xl p-6 border border-slate-600/30">
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Your Personalized Diet Plan
                </h4>
                <div className="space-y-1">
                  {formatDietPlan(dietPlan)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Section */}
        <div ref={instructionsRef} className="max-w-4xl mx-auto">
          <div className="bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-cyan-400">1</span>
                </div>
                <h4 className="text-lg font-semibold text-white">Upload Reports</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Add up to 3 DNA reports for comprehensive analysis. Multiple samples provide more accurate insights.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h4 className="text-lg font-semibold text-white">AI Analysis</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Our advanced AI compares genetic markers across all samples for detailed cross-analysis.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h4 className="text-lg font-semibold text-white">Get Results</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Receive personalized recommendations based on comprehensive genetic profile analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <section ref={containerRef} className="relative py-16 overflow-hidden min-h-screen">
      {/* High-Resolution DNA Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video absolute inset-0 w-full h-full object-cover"
        poster="https://images.pexels.com/videos/3191573/free-photo-3191573.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <source src="https://videos.pexels.com/video-files/3191573/3191573-hd_1920_1080_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-900/70 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-20"></div>

      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </section>
  );
};

export default AnalysisPage;
