export interface BreathingPattern {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  id: string;
  name: string;
  description: string;
  colorTheme: string;
}

// These patterns are defined on the client for immediate use before the API response
export const defaultBreathingPatterns: Record<string, BreathingPattern> = {
  "box-breathing": {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Inhale, Hold, Exhale, Hold",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    colorTheme: "primary"
  },
  "4-7-8": {
    id: "4-7-8",
    name: "4-7-8 Technique",
    description: "Relaxation breath",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    colorTheme: "secondary"
  },
  "deep-calm": {
    id: "deep-calm",
    name: "Deep Calm",
    description: "Stress relief breathing",
    inhale: 6,
    hold1: 2, 
    exhale: 7,
    hold2: 0,
    colorTheme: "accent"
  },
  "energizing": {
    id: "energizing",
    name: "Energizing Breath",
    description: "Morning activation",
    inhale: 2,
    hold1: 0,
    exhale: 2,
    hold2: 0,
    colorTheme: "success"
  }
};
