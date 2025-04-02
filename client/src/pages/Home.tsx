import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import ExerciseSelector from "@/components/ExerciseSelector";
import BreathingExercise from "@/components/BreathingExercise";
import { defaultBreathingPatterns } from "@/lib/breathingPatterns";
import { Exercise } from "@shared/schema";

const Home: FC = () => {
  // State for UI components
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  
  // Exercise settings
  const [selectedPatternId, setSelectedPatternId] = useState("box-breathing");
  const [sessionDuration, setSessionDuration] = useState(5);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [selectedSound, setSelectedSound] = useState("ocean");

  // Fetch exercises from API
  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  // Get the current pattern, either from API or default
  const selectedExercise = exercises.find(e => e.id === selectedPatternId);
  
  // Convert Exercise from API to BreathingPattern if needed
  const selectedPattern = selectedExercise ? {
    id: selectedExercise.id,
    name: selectedExercise.name,
    description: selectedExercise.description,
    colorTheme: selectedExercise.colorTheme,
    inhale: selectedExercise.steps.inhale,
    hold1: selectedExercise.steps.hold1,
    exhale: selectedExercise.steps.exhale,
    hold2: selectedExercise.steps.hold2
  } : defaultBreathingPatterns[selectedPatternId] || defaultBreathingPatterns["box-breathing"];

  // Handle welcome screen exit
  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setShowSelector(true);
  };

  // Handle settings button click
  const handleSettingsClick = () => {
    setShowSelector(true);
  };

  // Handle selector close
  const handleSelectorClose = () => {
    setShowSelector(false);
  };

  // Handle start exercise button
  const handleStartExercise = () => {
    setShowSelector(false);
  };

  // Handle exercise reset
  const handleReset = () => {
    // No additional logic needed here yet
  };

  return (
    <div className="font-quicksand bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-primary/20 opacity-30 blur-circle"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-cyan-500/20 opacity-30 blur-circle"></div>
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-purple-500/20 opacity-20 blur-circle"></div>
      </div>

      {/* Welcome overlay */}
      {showWelcome && <WelcomeOverlay onGetStarted={handleWelcomeClose} />}

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Header onSettingsClick={handleSettingsClick} />

        <main className="flex-grow flex flex-col items-center justify-center px-4 pb-10">
          <BreathingExercise
            selectedPattern={selectedPattern}
            sessionDuration={sessionDuration}
            isAudioEnabled={isAudioEnabled}
            selectedSound={selectedSound}
            volume={volume}
            onReset={handleReset}
            onChangeSettingsClick={handleSettingsClick}
          />
        </main>
      </div>

      {/* Exercise selector panel */}
      <ExerciseSelector
        isOpen={showSelector}
        onClose={handleSelectorClose}
        onStart={handleStartExercise}
        selectedPattern={selectedPatternId}
        onPatternChange={setSelectedPatternId}
        sessionDuration={sessionDuration}
        onDurationChange={setSessionDuration}
        isAudioEnabled={isAudioEnabled}
        onAudioEnabledChange={setIsAudioEnabled}
        volume={volume}
        onVolumeChange={setVolume}
        selectedSound={selectedSound}
        onSoundChange={setSelectedSound}
      />
    </div>
  );
};

export default Home;
