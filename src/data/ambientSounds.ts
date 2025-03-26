
export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  soundUrl: string;
}

export const ambientSounds: AmbientSound[] = [
  {
    id: "light-rain",
    name: "Light Rain",
    icon: "🌧️",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3"
  },
  {
    id: "heavy-rain",
    name: "Heavy Rain",
    icon: "⛈️",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-heavy-rain-2688.mp3"
  },
  {
    id: "thunder",
    name: "Thunder",
    icon: "🌩️",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-thunder-1.mp3"
  },
  {
    id: "fireplace",
    name: "Fireplace",
    icon: "🔥",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3"
  },
  {
    id: "cafe",
    name: "Café",
    icon: "☕",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-restaurant-ambience-general-2473.mp3"
  },
  {
    id: "wind",
    name: "Wind",
    icon: "🌬️",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-blizzard-cold-winds-1153.mp3"
  },
  {
    id: "forest",
    name: "Forest",
    icon: "🌲",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-singing-58.mp3"
  },
  {
    id: "waves",
    name: "Ocean Waves",
    icon: "🌊",
    soundUrl: "https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3"
  }
];
