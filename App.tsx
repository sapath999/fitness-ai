import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AnalysisPage from './components/AnalysisPage';
import AIResultsPage from './components/AIResultsPage';
import InspirationVideo from './components/InspirationVideo';
import SignInPage from './components/SignInPage';
import "./index.css"

const AppContent: React.FC = () => {
  const [page, setPage] = useState<'home' | 'analysis' | 'signin' | 'ai-results'>('home');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const mainRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();

  const goToAnalysis = () => setPage('analysis');
  const goToHome = () => setPage('home');
  const goToSignIn = () => setPage('signin');
  const goToAIResults = (result: string) => {
    setAnalysisResult(result);
    setPage('ai-results');
  };



  return (
    <div 
      ref={mainRef}
      className="relative text-slate-200 min-h-screen bg-black"
    >
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onGetStarted={goToAnalysis} onSignIn={goToSignIn} />
        <main className="flex-grow">
           {page === 'home' && (
            <>
              {/* Combined Hero and Features section with DNA video background */}
              <section className="relative overflow-hidden">
                {/* DNA Video Background */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  poster="https://images.pexels.com/videos/3191573/free-photo-3191573.jpeg?auto=compress&cs=tinysrgb&w=1280"
                >
                  <source src="https://videos.pexels.com/video-files/3191573/3191573-hd_1280_720_25fps.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/50 z-10"></div>

                {/* Blue DNA Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-cyan-900/10 z-20"></div>

                <div className="relative z-30">
                  <Hero onGetStarted={goToAnalysis} />
                  <Features />
                </div>
              </section>

              <InspirationVideo />
              <HowItWorks />
            </>
          )}
          {page === 'analysis' && <AnalysisPage onBack={goToHome} onAnalysisComplete={goToAIResults} />}
          {page === 'ai-results' && <AIResultsPage analysisResult={analysisResult} onBack={goToHome} onAnalyzeAnother={goToAnalysis} />}
          {page === 'signin' && <SignInPage onBack={goToHome} onLogin={login} />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
