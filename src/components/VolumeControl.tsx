
import React from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ 
  volume, 
  onChange,
  className
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onChange(newVolume);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.3) return <Volume size={18} />;
    if (volume < 0.7) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  const handleMuteToggle = () => {
    onChange(volume === 0 ? 0.5 : 0);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button 
        onClick={handleMuteToggle}
        className="text-foreground/80 hover:text-foreground transition-colors"
        aria-label={volume === 0 ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </button>
      <div className="relative w-24 h-8 flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Volume Control"
        />
        <div className="slider-track w-full">
          <div 
            className="slider-range" 
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <div 
          className="slider-thumb absolute"
          style={{ left: `calc(${volume * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
