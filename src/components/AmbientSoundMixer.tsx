import React, { useState, useEffect } from 'react';
import { AmbientSound, ambientSounds } from '@/data/ambientSounds';
import SoundButton from './SoundButton';
import VolumeControl from './VolumeControl';
import { cn } from '@/lib/utils';

interface ActiveSound {
  sound: AmbientSound;
  volume: number;
  audioElement: HTMLAudioElement | null;
}

interface AmbientSoundMixerProps {
  className?: string;
}

const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({ className }) => {
  const [activeSounds, setActiveSounds] = useState<Record<string, ActiveSound>>({});
  const [masterVolume, setMasterVolume] = useState(0.5);

  const toggleSound = (sound: AmbientSound) => {
    setActiveSounds(prev => {
      // If sound is already active, remove it
      if (prev[sound.id]) {
        const { [sound.id]: removed, ...rest } = prev;
        if (removed.audioElement) {
          removed.audioElement.pause();
        }
        return rest;
      }
      
      // Otherwise, add it
      const audio = new Audio(sound.soundUrl);
      audio.loop = true;
      audio.volume = masterVolume;
      
      try {
        audio.play().catch(error => {
          console.error("Error playing sound:", error);
        });
      } catch (error) {
        console.error("Error playing sound:", error);
      }
      
      return {
        ...prev,
        [sound.id]: {
          sound,
          volume: 1,
          audioElement: audio
        }
      };
    });
  };

  // Adjust individual sound volume
  const adjustSoundVolume = (soundId: string, volume: number) => {
    setActiveSounds(prev => {
      if (!prev[soundId]) return prev;
      
      const updatedSound = {
        ...prev[soundId],
        volume
      };
      
      if (updatedSound.audioElement) {
        updatedSound.audioElement.volume = volume * masterVolume;
      }
      
      return {
        ...prev,
        [soundId]: updatedSound
      };
    });
  };

  // Update all sound volumes when master volume changes
  useEffect(() => {
    Object.values(activeSounds).forEach(activeSound => {
      if (activeSound.audioElement) {
        activeSound.audioElement.volume = activeSound.volume * masterVolume;
      }
    });
  }, [masterVolume, activeSounds]);

  // Clean up audio elements on unmount
  useEffect(() => {
    return () => {
      Object.values(activeSounds).forEach(activeSound => {
        if (activeSound.audioElement) {
          activeSound.audioElement.pause();
        }
      });
    };
  }, []);

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Ambient Sounds</h2>
        <VolumeControl
          volume={masterVolume}
          onChange={setMasterVolume}
          className="ml-auto"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 mb-4">
        {ambientSounds.map((sound) => (
          <SoundButton
            key={sound.id}
            name={sound.name}
            icon={sound.icon}
            isActive={!!activeSounds[sound.id]}
            onClick={() => toggleSound(sound)}
          />
        ))}
      </div>
      
      {Object.keys(activeSounds).length > 0 && (
        <div className="space-y-3 mt-2 animate-fade-in">
          <h3 className="text-sm font-medium text-muted-foreground">Active Sounds</h3>
          {Object.values(activeSounds).map(({ sound, volume }) => (
            <div key={sound.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{sound.icon}</span>
                <span>{sound.name}</span>
              </div>
              <VolumeControl
                volume={volume}
                onChange={(value) => adjustSoundVolume(sound.id, value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmbientSoundMixer;
