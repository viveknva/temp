import { Howl, Howler } from "howler";

// Audio files URLs
const AUDIO_FILES = {
  inhale: "https://assets.mixkit.co/sfx/preview/mixkit-small-hit-in-a-game-2072.mp3",
  exhale: "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3",
  hold1: "https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3",
  hold2: "https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3",
  // Background sounds
  ocean: "https://assets.mixkit.co/sfx/preview/mixkit-waves-flowing-loop-1196.mp3",
  forest: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1211.mp3",
};

// Cache to store loaded audio
const audioCache: Record<string, Howl> = {};
let backgroundSound: Howl | null = null;

// Preload audio files
const preloadAudio = () => {
  Object.entries(AUDIO_FILES).forEach(([key, url]) => {
    if (!audioCache[key]) {
      audioCache[key] = new Howl({
        src: [url],
        preload: true,
        volume: 0.7,
        html5: true,
      });
    }
  });
};

// Call preload on module initialization
preloadAudio();

// Set global volume
export const setVolume = (volume: number) => {
  const normalizedVolume = Math.min(Math.max(volume / 100, 0), 1);
  Howler.volume(normalizedVolume);
};

// Play a specific audio cue
export const playAudio = (
  type: "inhale" | "hold1" | "exhale" | "hold2",
  volume: number = 70
) => {
  setVolume(volume / 100);
  
  if (audioCache[type]) {
    audioCache[type].play();
  } else {
    console.warn(`Audio for ${type} is not loaded`);
  }
};

// Stop all currently playing audio
export const stopAllAudio = () => {
  Object.values(audioCache).forEach(audio => {
    if (audio.playing()) {
      audio.stop();
    }
  });
};

// Play background sound
export const playBackgroundSound = (
  sound: string,
  volume: number = 70
) => {
  if (sound === "none") {
    stopBackgroundSound();
    return;
  }
  
  const normalizedVolume = Math.min(Math.max(volume / 100, 0), 1) * 0.3; // Background sounds at 30% of main volume
  
  // Stop any currently playing background sound
  stopBackgroundSound();
  
  // Play the new background sound
  if (audioCache[sound]) {
    backgroundSound = audioCache[sound];
    backgroundSound.volume(normalizedVolume);
    backgroundSound.loop(true);
    backgroundSound.play();
  } else {
    console.warn(`Background sound ${sound} is not loaded`);
  }
};

// Stop background sound
export const stopBackgroundSound = () => {
  if (backgroundSound && backgroundSound.playing()) {
    backgroundSound.stop();
  }
  backgroundSound = null;
};
