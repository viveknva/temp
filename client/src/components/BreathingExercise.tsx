import { FC } from "react";
import BreathingCircle from "./BreathingCircle";
import useBreathingExercise from "@/hooks/useBreathingExercise";
import { BreathingPattern } from "@/lib/breathingPatterns";

interface BreathingExerciseProps {
  selectedPattern: BreathingPattern;
  sessionDuration: number;
  isAudioEnabled: boolean;
  selectedSound: string;
  volume: number;
  onReset: () => void;
  onChangeSettingsClick: () => void;
}

const BreathingExercise: FC<BreathingExerciseProps> = ({
  selectedPattern,
  sessionDuration,
  isAudioEnabled,
  selectedSound,
  volume,
  onReset,
  onChangeSettingsClick,
}) => {
  const {
    phase,
    phaseDuration,
    phaseLabel,
    timeRemaining,
    isPlaying,
    togglePlayPause,
    resetExercise,
    toggleFullscreen,
  } = useBreathingExercise({
    pattern: selectedPattern,
    sessionDuration,
    isAudioEnabled,
    selectedSound,
    volume,
    onReset,
  });

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-xl mx-auto">
      {/* Phase instruction */}
      <div className="text-center mb-8 pt-6">
        <div className="text-xl md:text-2xl font-light">{phaseLabel}</div>
        <div className="mt-1">
          <span className="text-sm opacity-70">{phaseDuration}s</span>
        </div>
      </div>

      {/* Breathing visualization */}
      <div className="flex items-center justify-center flex-grow">
        <BreathingCircle phase={phase} duration={phaseDuration} isPlaying={isPlaying} />
      </div>

      {/* Session controls */}
      <div className="w-full max-w-sm flex flex-col items-center mt-10 mb-6">
        {/* Time remaining */}
        <div className="text-center mb-6">
          <span className="text-3xl font-light">{formatTime(timeRemaining)}</span>
          <p className="text-xs opacity-70 mt-1">Time remaining</p>
        </div>

        {/* Controls */}
        <div className="flex space-x-6 items-center">
          <button
            onClick={resetExercise}
            className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700/80 transition-colors"
            aria-label="Reset"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center hover:bg-primary transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700/80 transition-colors"
            aria-label="Toggle fullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
