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
    <div className="relative flex items-center justify-center">
      {/* Progress ring */}
      <svg
        className="w-64 h-64 md:w-72 md:h-72 absolute"
        viewBox="0 0 100 100"
      >
        <circle
          ref={progressRingRef}
          className="progress-ring__circle"
          strokeWidth="1"
          stroke="hsl(171, 58%, 53%)"
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
        className="breathing-circle w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center transition-all duration-200 relative"
      >
        {/* Inner circle */}
        <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20"></div>
      </motion.div>
    </div>
  );
};

export default BreathingCircle;
