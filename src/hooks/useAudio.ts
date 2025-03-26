
import { useState, useEffect, useRef } from 'react';

interface UseAudioProps {
  src: string;
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export const useAudio = ({
  src,
  volume = 1,
  loop = true,
  autoPlay = false
}: UseAudioProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.loop = loop;
    audio.volume = currentVolume;
    
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Error loading audio');
      setIsLoading(false);
    };
    
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    if (autoPlay) {
      // Using a promise to handle autoplay restrictions
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay was prevented
            setIsPlaying(false);
          });
      }
    }
    
    return () => {
      audio.pause();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [src, loop, autoPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play was prevented
          setIsPlaying(false);
        });
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (value: number) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setCurrentVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return {
    isPlaying,
    togglePlay,
    currentVolume,
    changeVolume,
    isLoading,
    error,
    audioRef
  };
};
