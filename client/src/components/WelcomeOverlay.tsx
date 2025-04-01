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
          className="fixed inset-0 bg-dark z-30 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-20 h-20 mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
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
          <h1 className="text-3xl font-light mb-2">Welcome to Breathe</h1>
          <p className="text-light/70 max-w-md mb-8">
            Your immersive breathing experience. Take a moment to relax, focus, and breathe with intention.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-primary rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Begin Your Journey
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;
