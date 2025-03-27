
import React, { useRef, useState, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  const calculateVolumeFromPosition = (clientX: number): number => {
    if (!trackRef.current) return volume;
    
    const rect = trackRef.current.getBoundingClientRect();
    const trackWidth = rect.width;
    const trackLeft = rect.left;
    
    // Calculate position relative to the track
    let relativeX = clientX - trackLeft;
    
    // Clamp the value between 0 and trackWidth
    relativeX = Math.max(0, Math.min(trackWidth, relativeX));
    
    // Convert to volume (0-1)
    return parseFloat((relativeX / trackWidth).toFixed(2));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Update volume immediately on click
    const newVolume = calculateVolumeFromPosition(e.clientX);
    onChange(newVolume);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newVolume = calculateVolumeFromPosition(e.clientX);
    onChange(newVolume);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, volume]);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button 
        onClick={handleMuteToggle}
        className="text-foreground/80 hover:text-foreground transition-colors"
        aria-label={volume === 0 ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </button>
      <div 
        ref={sliderRef}
        className="relative w-24 h-8 flex items-center cursor-pointer"
      >
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
        <div 
          ref={trackRef}
          className="slider-track w-full"
          onMouseDown={handleMouseDown}
        >
          <div 
            className="slider-range transition-all duration-75" 
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <div 
          ref={thumbRef}
          className="slider-thumb absolute transition-all duration-75"
          style={{ left: `calc(${volume * 100}% - 8px)` }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
