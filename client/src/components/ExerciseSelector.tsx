import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BreathingPattern } from "@/lib/breathingPatterns";
import { Switch } from "@/components/ui/switch";
import { Exercise } from "@shared/schema";

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  selectedPattern: string;
  onPatternChange: (pattern: string) => void;
  sessionDuration: number;
  onDurationChange: (duration: number) => void;
  isAudioEnabled: boolean;
  onAudioEnabledChange: (enabled: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  selectedSound: string;
  onSoundChange: (sound: string) => void;
}

const ExerciseSelector: FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onStart,
  selectedPattern,
  onPatternChange,
  sessionDuration,
  onDurationChange,
  isAudioEnabled,
  onAudioEnabledChange,
  volume,
  onVolumeChange,
  selectedSound,
  onSoundChange,
}) => {
  const [localVolume, setLocalVolume] = useState(volume);

  // Fetch exercises from the server
  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  useEffect(() => {
    // Update volume after user stops sliding
    const handler = setTimeout(() => {
      onVolumeChange(localVolume);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [localVolume, onVolumeChange]);

  const renderExerciseIcon = (exerciseId: string) => {
    switch (exerciseId) {
      case "box-breathing":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
      case "4-7-8":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
      case "deep-calm":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
      case "energizing":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getExerciseInfo = (exercise: Exercise) => {
    const steps = exercise.steps;

    if (!steps) return null;

    return (
      <div className="flex items-center gap-3 text-xs text-light/60">
        {steps.inhale > 0 && <div>{steps.inhale}s Inhale</div>}
        {steps.hold1 > 0 && <div>{steps.hold1}s Hold</div>}
        {steps.exhale > 0 && <div>{steps.exhale}s Exhale</div>}
        {steps.hold2 > 0 && <div>{steps.hold2}s Hold</div>}
      </div>
    );
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur transform transition-transform duration-300 ease-in-out z-20 rounded-t-3xl shadow-lg ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="px-6 py-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Breathing Exercises</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700/50"
            aria-label="Close selector"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pb-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`exercise-card p-4 bg-slate-700/40 rounded-xl border ${
                selectedPattern === exercise.id
                  ? "border-primary/50"
                  : "border-slate-600/30"
              } cursor-pointer hover:border-primary/30 transition-all`}
              onClick={() => onPatternChange(exercise.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-white/70">{exercise.description}</p>
                </div>
                <div className="bg-slate-600/20 rounded-full h-8 w-8 flex items-center justify-center">
                  {renderExerciseIcon(exercise.id)}
                </div>
              </div>
              {getExerciseInfo(exercise)}
            </div>
          ))}
        </div>

        {/* Settings section */}
        <div className="mt-6 pt-4 border-t border-slate-600/30">
          <h3 className="text-lg font-medium mb-4">Settings</h3>

          {/* Duration selection */}
          <div className="mb-4">
            <label className="text-sm text-white/70 block mb-2">
              Session Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {[3, 5, 10, 15].map((duration) => (
                <button
                  key={duration}
                  className={`duration-btn px-4 py-2 rounded-lg bg-slate-700/40 border ${
                    sessionDuration === duration
                      ? "border-primary/50"
                      : "border-slate-600/30"
                  } text-sm hover:border-primary/30`}
                  onClick={() => onDurationChange(duration)}
                >
                  {duration} min
                </button>
              ))}
            </div>
          </div>

          {/* Audio settings */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-white/70">Guidance Audio</label>
              <Switch
                checked={isAudioEnabled}
                onCheckedChange={onAudioEnabledChange}
              />
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <input
                type="range"
                className="w-full h-1 mx-3 bg-slate-700/70 rounded appearance-none cursor-pointer"
                min="0"
                max="100"
                value={localVolume}
                onChange={(e) => setLocalVolume(parseInt(e.target.value))}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </div>
          </div>

          {/* Background sounds */}
          <div>
            <label className="text-sm text-white/70 block mb-2">
              Background Sounds
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["none", "ocean", "forest"].map((sound) => (
                <button
                  key={sound}
                  className={`sound-btn px-3 py-2 rounded-lg bg-slate-700/40 border ${
                    selectedSound === sound
                      ? "border-primary/50"
                      : "border-slate-600/30"
                  } text-sm hover:border-primary/30 flex flex-col items-center`}
                  onClick={() => onSoundChange(sound)}
                >
                  {sound === "none" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                      />
                    </svg>
                  ) : sound === "ocean" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 9v.75M3.75 13h2.5M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                      />
                    </svg>
                  )}
                  <span className="capitalize">{sound}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full mt-6 py-3 bg-primary/80 hover:bg-primary rounded-xl font-medium transition-colors"
          >
            Start Breathing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
