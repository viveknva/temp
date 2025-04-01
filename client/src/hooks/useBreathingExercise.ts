import { useState, useEffect, useCallback, useRef } from "react";
import { BreathingPattern } from "@/lib/breathingPatterns";
import { playAudio, stopAllAudio, playBackgroundSound, stopBackgroundSound } from "@/lib/audioManager";

interface UseBreathingExerciseProps {
  pattern: BreathingPattern;
  sessionDuration: number;
  isAudioEnabled: boolean;
  selectedSound: string;
  volume: number;
  onReset?: () => void;
}

export default function useBreathingExercise({
  pattern,
  sessionDuration,
  isAudioEnabled,
  selectedSound,
  volume,
  onReset,
}: UseBreathingExerciseProps) {
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60);
  const [phaseLabel, setPhaseLabel] = useState("Inhale");
  const [phaseDuration, setPhaseDuration] = useState(pattern.inhale);

  const timerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);

  // Update session time when duration changes
  useEffect(() => {
    setTimeRemaining(sessionDuration * 60);
  }, [sessionDuration]);

  // Reset phase if pattern changes
  useEffect(() => {
    setPhaseDuration(pattern[phase]);
  }, [pattern, phase]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (phaseTimerRef.current) {
      window.clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const pauseExercise = useCallback(() => {
    setIsPlaying(false);
    clearTimers();
    stopAllAudio();
  }, [clearTimers]);

  const resetExercise = useCallback(() => {
    pauseExercise();
    setTimeRemaining(sessionDuration * 60);
    setPhase("inhale");
    setPhaseDuration(pattern.inhale);
    setPhaseLabel("Inhale");
    
    if (onReset) {
      onReset();
    }
  }, [pauseExercise, sessionDuration, pattern.inhale, onReset]);

  const moveToNextPhase = useCallback(() => {
    if (!isPlaying) return;

    let nextPhase: "inhale" | "hold1" | "exhale" | "hold2";
    let nextLabel: string;
    let nextDuration: number;

    switch (phase) {
      case "inhale":
        if (pattern.hold1 > 0) {
          nextPhase = "hold1";
          nextLabel = "Hold";
          nextDuration = pattern.hold1;
        } else {
          nextPhase = "exhale";
          nextLabel = "Exhale";
          nextDuration = pattern.exhale;
        }
        break;
      case "hold1":
        nextPhase = "exhale";
        nextLabel = "Exhale";
        nextDuration = pattern.exhale;
        break;
      case "exhale":
        if (pattern.hold2 > 0) {
          nextPhase = "hold2";
          nextLabel = "Hold";
          nextDuration = pattern.hold2;
        } else {
          nextPhase = "inhale";
          nextLabel = "Inhale";
          nextDuration = pattern.inhale;
        }
        break;
      case "hold2":
        nextPhase = "inhale";
        nextLabel = "Inhale";
        nextDuration = pattern.inhale;
        break;
      default:
        nextPhase = "inhale";
        nextLabel = "Inhale";
        nextDuration = pattern.inhale;
    }

    setPhase(nextPhase);
    setPhaseLabel(nextLabel);
    setPhaseDuration(nextDuration);

    // Play audio cue if enabled
    if (isAudioEnabled) {
      playAudio(nextPhase, volume);
    }

    // Schedule next phase
    phaseTimerRef.current = window.setTimeout(moveToNextPhase, nextDuration * 1000);
  }, [phase, pattern, isPlaying, isAudioEnabled, volume]);

  const startExercise = useCallback(() => {
    clearTimers();
    setIsPlaying(true);
    
    // Play background sound if one is selected
    if (selectedSound !== "none") {
      playBackgroundSound(selectedSound, volume);
    }

    // Play initial audio cue
    if (isAudioEnabled) {
      playAudio(phase, volume);
    }

    // Start the session timer
    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          pauseExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Schedule the phase transitions
    phaseTimerRef.current = window.setTimeout(moveToNextPhase, phaseDuration * 1000);
  }, [clearTimers, phase, phaseDuration, moveToNextPhase, pauseExercise, isAudioEnabled, selectedSound, volume]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseExercise();
      stopBackgroundSound();
    } else {
      startExercise();
    }
  }, [isPlaying, pauseExercise, startExercise]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      stopAllAudio();
      stopBackgroundSound();
    };
  }, [clearTimers]);

  // Handle pattern changes
  useEffect(() => {
    if (isPlaying) {
      pauseExercise();
      startExercise();
    }
  }, [pattern, pauseExercise, startExercise, isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (selectedSound !== "none") {
      playBackgroundSound(selectedSound, volume);
    }
  }, [volume, selectedSound]);

  // When audio is toggled
  useEffect(() => {
    if (!isAudioEnabled) {
      stopAllAudio();
    }
  }, [isAudioEnabled]);

  // When background sound is changed
  useEffect(() => {
    stopBackgroundSound();
    if (isPlaying && selectedSound !== "none") {
      playBackgroundSound(selectedSound, volume);
    }
  }, [selectedSound, isPlaying, volume]);

  return {
    phase,
    phaseLabel,
    phaseDuration, 
    timeRemaining,
    isPlaying,
    togglePlayPause,
    resetExercise,
    toggleFullscreen,
  };
}
