import { FC, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface BreathingCircleProps {
  phase: "inhale" | "hold1" | "exhale" | "hold2";
  duration: number;
  isPlaying: boolean;
}

const BreathingCircle: FC<BreathingCircleProps> = ({ phase, duration, isPlaying }) => {
  const progressRingRef = useRef<SVGCircleElement>(null);
  const circumference = 2 * Math.PI * 48;

  useEffect(() => {
    if (!isPlaying || !progressRingRef.current) return;

    // Reset the animation
    progressRingRef.current.style.strokeDashoffset = circumference.toString();
    progressRingRef.current.style.transition = "none";
    // Force reflow
    progressRingRef.current.getBoundingClientRect();

    // Start the animation
    progressRingRef.current.style.transition = `stroke-dashoffset ${duration}s linear`;
    progressRingRef.current.style.strokeDashoffset = "0";
  }, [phase, duration, isPlaying, circumference]);

  const variants = {
    inhale: {
      scale: 1.5,
      opacity: 1,
      transition: { duration, ease: "easeInOut" },
    },
    hold1: {
      scale: 1.5,
      opacity: 1,
      transition: { duration, ease: "easeInOut" },
    },
    exhale: {
      scale: 1,
      opacity: 0.7,
      transition: { duration, ease: "easeInOut" },
    },
    hold2: {
      scale: 1,
      opacity: 0.7,
      transition: { duration, ease: "easeInOut" },
    },
    paused: {
      scale: isPlaying ? undefined : phase === "inhale" || phase === "hold1" ? 1.5 : 1,
      opacity: isPlaying ? undefined : phase === "inhale" || phase === "hold1" ? 1 : 0.7,
    },
  };

  return (
    <div className="relative">
      {/* Progress ring */}
      <svg
        className="w-64 h-64 md:w-80 md:h-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 100 100"
      >
        <circle
          ref={progressRingRef}
          className="progress-ring__circle"
          strokeWidth="1"
          stroke="#4AC6B7"
          fill="transparent"
          r="48"
          cx="50"
          cy="50"
          strokeDasharray={circumference}
          strokeDashoffset="0"
        />
      </svg>

      {/* The breathing circle */}
      <motion.div
        animate={isPlaying ? phase : "paused"}
        variants={variants}
        initial={{ scale: 1, opacity: 0.7 }}
        className="breathing-circle w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/20 border border-primary/30 backdrop-blur flex items-center justify-center transition-all duration-200 relative"
      >
        {/* Inner circle */}
        <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur"></div>
      </motion.div>
    </div>
  );
};

export default BreathingCircle;
