
import * as React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.01,35.638,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

interface SignInPageProps {
  onBack: () => void;
  onLogin: (credentialResponse: any) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onBack, onLogin }) => {
  return (
    <section className="py-10 md:py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="absolute top-24 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-slate-200 hover:text-cyan-400 transition-colors z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Back to Home
        </button>
        <div className="max-w-md mx-auto text-center animate-fadeInUp">
          <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-300 mb-8">Sign in with Google to access your personalized plans.</p>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={onLogin}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                  useOneTap
                />
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-8">
              By continuing, you agree to our <a href="#" className="underline hover:text-cyan-400">Terms of Service</a> and <a href="#" className="underline hover:text-cyan-400">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
