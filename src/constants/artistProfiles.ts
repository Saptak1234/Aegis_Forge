export interface ArtistProfile {
  name: string;
  vocalStyle: {
    pitch: number;
    rate: number;
    breathiness: number;
    vibrato: number;
    emotion: string;
    doubling: boolean;
  };
  productionStyle: {
    tempoRange: [number, number];
    preferredInstruments: string[];
    effects: {
      reverb: number;
      delay: number;
      distortion: number;
    };
    signatureElement: string;
  };
}

export const NEURAL_ARTIST_DATASET: Record<string, ArtistProfile> = {
  "billie eilish": {
    name: "Billie Eilish",
    vocalStyle: {
      pitch: 0.85,
      rate: 0.75,
      breathiness: 0.9,
      vibrato: 0.2,
      emotion: "intimate",
      doubling: true
    },
    productionStyle: {
      tempoRange: [60, 120],
      preferredInstruments: ["bass", "drums", "pads"],
      effects: { reverb: 0.3, delay: 0.2, distortion: 0.1 },
      signatureElement: "Whispery vocals and heavy sub-bass"
    }
  },
  "ava max": {
    name: "Ava Max",
    vocalStyle: {
      pitch: 1.1,
      rate: 1.0,
      breathiness: 0.2,
      vibrato: 0.6,
      emotion: "aggressive",
      doubling: true
    },
    productionStyle: {
      tempoRange: [120, 140],
      preferredInstruments: ["drums", "lead", "chords"],
      effects: { reverb: 0.4, delay: 0.3, distortion: 0.0 },
      signatureElement: "Anthemic pop choruses and bright synths"
    }
  },
  "tom odell": {
    name: "Tom Odell",
    vocalStyle: {
      pitch: 0.95,
      rate: 0.85,
      breathiness: 0.4,
      vibrato: 0.7,
      emotion: "soulful",
      doubling: false
    },
    productionStyle: {
      tempoRange: [70, 110],
      preferredInstruments: ["chords", "strings", "bass"],
      effects: { reverb: 0.6, delay: 0.1, distortion: 0.0 },
      signatureElement: "Piano-driven emotional builds"
    }
  },
  "alan walker": {
    name: "Alan Walker",
    vocalStyle: {
      pitch: 1.2,
      rate: 0.9,
      breathiness: 0.5,
      vibrato: 0.3,
      emotion: "ethereal",
      doubling: true
    },
    productionStyle: {
      tempoRange: [90, 130],
      preferredInstruments: ["lead", "fx", "drums"],
      effects: { reverb: 0.7, delay: 0.5, distortion: 0.2 },
      signatureElement: "Melodic EDM with high-pitched vocal chops"
    }
  },
  "kshmr": {
    name: "KSHMR",
    vocalStyle: {
      pitch: 1.0,
      rate: 1.0,
      breathiness: 0.3,
      vibrato: 0.4,
      emotion: "aggressive",
      doubling: true
    },
    productionStyle: {
      tempoRange: [120, 150],
      preferredInstruments: ["drums", "fx", "strings", "lead"],
      effects: { reverb: 0.5, delay: 0.4, distortion: 0.3 },
      signatureElement: "World-music infused EDM with complex percussion"
    }
  },
  "one direction": {
    name: "One Direction",
    vocalStyle: {
      pitch: 1.05,
      rate: 1.0,
      breathiness: 0.2,
      vibrato: 0.5,
      emotion: "soulful",
      doubling: true
    },
    productionStyle: {
      tempoRange: [100, 140],
      preferredInstruments: ["chords", "drums", "bass", "strings"],
      effects: { reverb: 0.3, delay: 0.2, distortion: 0.1 },
      signatureElement: "Bright pop-rock harmonies"
    }
  }
};
