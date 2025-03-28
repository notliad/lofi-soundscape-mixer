# LoScapeFi - Lofi Soundscape Mixer

![LoScapeFi](public/favicon.ico)

A relaxing web application that combines lofi music streams with ambient soundscapes to create the perfect atmosphere for studying, working, or relaxing.

## Development Process

This project was a test for a AI-assisted worflow :

- Initial concept created in [Lovable](https://lovable.dev/)
- Implementation of features using [Trae](https://www.trae.ai/) AI with Claude 3.7
- Manual adjustments for responsiveness and UI refinements
- Code optimization to remove unnecessary props and improve performance
- Deployed and tested on Netlify

## Features

### Radio Player

- Stream popular lofi music channels including Lofi Girl, Chillhop Music, College Music, Jazz Hop Café, and The Bootleg Boy
- Add and save custom YouTube stream URLs
- Save and manage your favorite YouTube streams
- Playback controls (play/pause, skip forward/back between stations)
- Volume adjustment

### Ambient Sound Mixer

- Mix multiple ambient sounds simultaneously
- 9 high-quality ambient sound effects:
  - 🌧️ Light Rain
  - ⛈️ Heavy Rain
  - 🌩️ Thunder Storm
  - 🔥 Fireplace
  - ☕ Coffee Shop
  - 🌬️ Wind
  - 🌲 Forest
  - 🌊 Ocean Waves
- Individual volume control for each sound
- Master volume control
- Save and load sound profiles with your favorite combinations
- Clear all active sounds with one click

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

1. **Radio Player**: Click on a radio station thumbnail to select it, then press the play button to start streaming. Adjust volume using the slider. Use the forward/back buttons to navigate between stations. Add your own custom YouTube streams by clicking the plus button.

2. **Ambient Sounds**: Click on any sound icon to activate it. Click again to deactivate. Use the individual sliders to adjust the volume of each active sound. Save your favorite sound combinations as profiles using the Save button, and load them later with the Load button.

3. **Sound Profiles**: Create and manage sound profiles to quickly switch between different ambient sound combinations. Use the Save button to store your current sound mix, the Load button to recall saved profiles, and the Clear button to remove all active sounds.

4. **Theme Toggle**: Click the sun/moon icon in the top right to switch between light and dark themes.

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
