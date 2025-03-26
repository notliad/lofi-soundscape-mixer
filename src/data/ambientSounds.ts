
export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  soundUrl: string;
}

export const ambientSounds: AmbientSound[] = [
  {
    id: "light-rain",
    name: "Light Rain (Sound Effect by Mikhail from Pixabay)",
    icon: "🌧️",
    soundUrl: "/effects/light-rain.mp3"
  },
  {
    id: "heavy-rain",
    name: "Heavy Rain (Sound Effect by Franco Gonzalez from Pixabay)",
    icon: "⛈️",
    soundUrl: "/effects/heavy-rain.mp3"
  },
  {
    id: "thunder",
    name: "Thunder Storm (Sound Effect by Franco Gonzalez from Pixabay)",
    icon: "🌩️",
    soundUrl: "/effects/thunder-rain.mp3"
  },
  {
    id: "fireplace",
    name: "Fireplace (Sound Effect by RestfulDreamingTunes from Pixabay)",
    icon: "🔥",
    soundUrl: "/effects/fireplace.mp3"
  },
  {
    id: "cafe",
    name: "Café (Sound Effect by freesound_community from Pixabay)",
    icon: "☕",
    soundUrl: "/effects/cafeteria.mp3"
  },
  {
    id: "wind",
    name: "Wind (Sound Effect by Ghostie Graves from Pixabay)",
    icon: "🌬️",
    soundUrl: "/effects/wind.mp3"
  },
  {
    id: "forest",
    name: "Forest (Sound Effect by Empress-Kathryne Nefertiti-Mumbi from Pixabay)",
    icon: "🌲",
    soundUrl: "/effects/forest.mp3"
  },
  {
    id: "waves",
    name: "Ocean Waves (Sound Effect by freesound_community from Pixabay)",
    icon: "🌊",
    soundUrl: "/effects/ocean.mp3"
  }
];
