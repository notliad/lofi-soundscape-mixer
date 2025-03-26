# LoScapeFi - Lofi Soundscape Mixer

![LoScapeFi](public/images/lofi-girl.png)

A relaxing web application that combines lofi music streams with ambient soundscapes to create the perfect atmosphere for studying, working, or relaxing.

## Features

### Radio Player
- Stream popular lofi music channels including Lofi Girl, Chillhop Music, College Music, Jazz Hop Café, and The Bootleg Boy
- Add and save custom YouTube stream URLs
- Playback controls (play/pause, skip)
- Volume adjustment

### Ambient Sound Mixer
- Mix multiple ambient sounds simultaneously
- 9 high-quality ambient sound effects:
  - 🌧️ Light Rain
  - ⛈️ Heavy Rain
  - 🌩️ Thunder Storm
  - 🔥 Fireplace
  - ☕ Café
  - 🌬️ Wind
  - 🌲 Forest
  - 🌊 Ocean Waves
  - 🪟 Rain on Window
- Individual volume control for each sound
- Master volume control

### User Experience
- Beautiful glass-panel UI with smooth animations
- Dark/light theme toggle
- Responsive design for desktop and mobile devices
- Real-time clock display

## Getting Started

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd lofi-soundscape-mixer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. **Radio Player**: Click on a radio station thumbnail to select it, then press the play button to start streaming. Adjust volume using the slider.

2. **Ambient Sounds**: Click on any sound icon to activate it. Click again to deactivate. Use the individual sliders to adjust the volume of each active sound.

3. **Theme Toggle**: Click the sun/moon icon in the top right to switch between light and dark themes.

## Technologies Used

- [Vite](https://vitejs.dev/) - Frontend build tool
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## Credits

- Created by [@notliad](https://www.github.com/notliad)
- Radio streams sourced from YouTube
- Sound effects sourced from Pixabay

## License

This project is open source and available under the [MIT License](LICENSE).
