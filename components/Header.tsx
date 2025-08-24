import * as React from "react";
import { useState } from "react";

interface HeaderProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted, onSignIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsMenuOpen(false);
    onGetStarted();
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    onSignIn();
  };

  const handleDesktopSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="" className="w-12 rotate-[-25.5deg] opacity-50" />
            <span className="text-4xl font-bold tracking-tight text-blue-300 opacity-80">
              Fitness AI
            </span>
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-slate-200 hover:text-cyan-400 transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-200 hover:text-cyan-400 transition-colors duration-300"
          >
            How It Works
          </a>
          <a
            href="#"
            onClick={handleDesktopSignInClick}
            className="text-slate-200 hover:text-cyan-400 transition-colors duration-300"
          >
            Sign In
          </a>
        </nav>
       
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-slate-900/90 backdrop-blur-lg transition-all duration-500 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <a
            href="#features"
            onClick={() => setIsMenuOpen(false)}
            className="text-slate-200 hover:text-cyan-400 transition-colors duration-300 text-2xl"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsMenuOpen(false)}
            className="text-slate-200 hover:text-cyan-400 transition-colors duration-300 text-2xl"
          >
            How It Works
          </a>
          <a
            href="#"
            onClick={handleSignInClick}
            className="text-slate-200 hover:text-cyan-400 transition-colors duration-300 text-2xl"
          >
            Sign In
          </a>
          <button
            onClick={handleGetStartedClick}
            className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 text-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
