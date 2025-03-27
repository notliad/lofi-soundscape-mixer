
export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  soundUrl: string;
}

export const ambientSounds: AmbientSound[] = [
  {
    id: "light-rain",
    name: "Light Rain (by Mikhail from Pixabay)",
    icon: "🌧️",
    soundUrl: "/effects/light-rain.mp3"
  },
  {
    id: "heavy-rain",
    name: "Heavy Rain (by Franco Gonzalez from Pixabay)",
    icon: "⛈️",
    soundUrl: "/effects/heavy-rain.mp3"
  },
  {
    id: "thunder",
    name: "Thunder Storm (by Franco Gonzalez from Pixabay)",
    icon: "🌩️",
    soundUrl: "/effects/thunder-rain.mp3"
  },
  {
    id: "fireplace",
    name: "Fireplace (by RestfulDreamingTunes from Pixabay)",
    icon: "🔥",
    soundUrl: "/effects/fireplace.mp3"
  },
  {
    id: "cafe",
    name: "Café (by Mixkit)",
    icon: "☕",
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/444/444-preview.mp3"
  },
  {
    id: "forest",
    name: "Forest (by Mixkit)",
    icon: "🌲",
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/1213/1213-preview.mp3"
  },
  {
    id: "waves",
    name: "Ocean Waves (by Mixkit)",
    icon: "🌊",
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/1189/1189-preview.mp3"
  }
];
