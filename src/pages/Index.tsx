
import React, { useState, useEffect } from 'react';
import RadioPlayer from '@/components/RadioPlayer';
import AmbientSoundMixer from '@/components/AmbientSoundMixer';
import { Headphones, Music } from 'lucide-react';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    // Simulate loading for smoother animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen py-4 px-4 md:py-8 md:px-6 flex flex-col">
      <header className={`mb-6 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            <h1 className="text-xl font-medium tracking-tight">Lofi Soundscape</h1>
          </div>
          <div className="text-muted-foreground">{timeString}</div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto flex-1 flex flex-col">
        {/* Radio Player */}
        <div 
          className={`transition-all duration-700 delay-100 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <RadioPlayer className="mb-6" />
        </div>

        {/* Ambient Sound Mixer */}
        <div 
          className={`glass-panel rounded-2xl p-6 backdrop-blur-md mb-6 transition-all duration-700 delay-200 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <AmbientSoundMixer />
        </div>
        
        {/* Credits Section */}
        <div 
          className={`bg-background/50 rounded-xl p-4 border border-border/50 text-center text-sm text-muted-foreground transition-all duration-700 delay-300 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p>Created with <Music className="inline-block w-3 h-3" /> and caffeine. Streams sourced from YouTube.</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
