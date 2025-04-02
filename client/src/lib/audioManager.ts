// Web Audio API implementation
let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let backgroundOscillator: OscillatorNode | null = null;
let backgroundGainNode: GainNode | null = null;

// Sound configurations for different breathing phases
const SOUND_CONFIGS = {
  inhale: { frequency: 440, type: 'sine' as OscillatorType },  // A4 note
  exhale: { frequency: 329.63, type: 'sine' as OscillatorType }, // E4 note
  hold1: { frequency: 392, type: 'sine' as OscillatorType },   // G4 note
  hold2: { frequency: 392, type: 'sine' as OscillatorType },   // G4 note
};

// Background sound configurations
const BACKGROUND_CONFIGS = {
  ocean: { frequency: 77, type: 'sine' as OscillatorType, modulation: 0.1 },   // Low frequency sound
  forest: { frequency: 196, type: 'sine' as OscillatorType, modulation: 0.05 }, // Bird-like sound
  none: { frequency: 0, type: 'sine' as OscillatorType, modulation: 0 },
};

// Initialize audio context
const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainNode = audioContext.createGain();
      masterGainNode.connect(audioContext.destination);
    } catch (e) {
      console.error('Web Audio API is not supported in this browser:', e);
    }
  }
  
  // Resume audioContext if it's suspended (autoplay policy)
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

// Set global volume
export const setVolume = (volume: number) => {
  initAudioContext();
  if (masterGainNode) {
    const normalizedVolume = Math.min(Math.max(volume / 100, 0), 1);
    masterGainNode.gain.value = normalizedVolume;
  }
};

// Play a specific audio cue
export const playAudio = (
  type: "inhale" | "hold1" | "exhale" | "hold2",
  volume: number = 70
) => {
  initAudioContext();
  setVolume(volume);
  
  if (!audioContext) return;
  
  const config = SOUND_CONFIGS[type];
  if (!config) return;
  
  // Create oscillator for the tone
  const oscillator = audioContext.createOscillator();
  oscillator.type = config.type;
  oscillator.frequency.value = config.frequency;
  
  // Create gain node for envelope
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(masterGainNode!);
  
  // Start oscillator
  oscillator.start();
  
  // Apply attack (quick fade in)
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
  
  // Apply decay and stop after 0.3 seconds
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
  }, 300);
};

// Stop all currently playing audio (not needed with this implementation)
export const stopAllAudio = () => {
  // This implementation automatically stops short sounds
};

// Play background sound
export const playBackgroundSound = (
  sound: string,
  volume: number = 70
) => {
  initAudioContext();
  
  // Stop any existing background sound
  stopBackgroundSound();
  
  if (sound === "none" || !audioContext) return;
  
  const config = BACKGROUND_CONFIGS[sound as keyof typeof BACKGROUND_CONFIGS] || BACKGROUND_CONFIGS.ocean;
  
  // Create main oscillator
  backgroundOscillator = audioContext.createOscillator();
  backgroundOscillator.type = config.type;
  backgroundOscillator.frequency.value = config.frequency;
  
  // Create gain node
  backgroundGainNode = audioContext.createGain();
  const normalizedVolume = Math.min(Math.max(volume / 100, 0), 1) * 0.15; // Lower volume for background
  backgroundGainNode.gain.value = normalizedVolume;
  
  // Connect nodes
  backgroundOscillator.connect(backgroundGainNode);
  backgroundGainNode.connect(masterGainNode!);
  
  // Apply subtle modulation for more organic sound
  if (config.modulation > 0) {
    // Frequency modulation
    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // Very slow modulation
    
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = config.frequency * config.modulation;
    
    lfo.connect(lfoGain);
    lfoGain.connect(backgroundOscillator.frequency);
    lfo.start();
  }
  
  // Start the sound
  backgroundOscillator.start();
};

// Stop background sound
export const stopBackgroundSound = () => {
  if (backgroundOscillator) {
    try {
      backgroundOscillator.stop();
      backgroundOscillator.disconnect();
    } catch (e) {
      // Ignore errors if oscillator was already stopped
    }
    backgroundOscillator = null;
  }
  
  if (backgroundGainNode) {
    backgroundGainNode.disconnect();
    backgroundGainNode = null;
  }
};
