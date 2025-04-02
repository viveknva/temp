import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeOverlayProps {
  onGetStarted: () => void;
}

const WelcomeOverlay: FC<WelcomeOverlayProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleGetStarted = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onGetStarted();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onGetStarted]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-slate-900 z-30 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-primary/20 opacity-30 blur-circle"></div>
            <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-cyan-500/20 opacity-30 blur-circle"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-8 rounded-full bg-primary/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.425 7.573C18.21 5.516 15.962 4 13.243 4 9.066 4 5.5 7.477 5.5 12s3.566 8 7.743 8c2.719 0 4.967-1.516 6.182-3.573"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 12h-9m9 0l-3-3m3 3l-3 3"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Welcome to Breathe</h1>
            <p className="text-white/70 max-w-md mb-10 text-lg">
              Your immersive breathing experience. Take a moment to relax, focus, and breathe with intention.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-primary/80 hover:bg-primary rounded-xl font-medium transition-colors text-lg"
            >
              Begin Your Journey
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;
