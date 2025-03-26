
import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import VolumeControl from './VolumeControl';
import { defaultStation, RadioStation, radioStations } from '@/data/radioStations';

interface RadioPlayerProps {
  className?: string;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ className }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation>(defaultStation);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [videoElement, setVideoElement] = useState<HTMLIFrameElement | null>(null);
  const [stationMenuOpen, setStationMenuOpen] = useState(false);

  const togglePlay = () => {
    if (!videoElement) return;

    if (isPlaying) {
      // Pause the stream by setting source to blank
      videoElement.src = '';
    } else {
      // Play by setting the source
      videoElement.src = `${currentStation.streamUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0`;
    }
    
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Find the iframe element
    const iframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    setVideoElement(iframe);

    return () => {
      // Cleanup
      if (iframe) {
        iframe.src = '';
      }
    };
  }, []);

  const changeStation = (station: RadioStation) => {
    setCurrentStation(station);
    
    if (isPlaying && videoElement) {
      videoElement.src = `${station.streamUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0`;
    }
    
    setStationMenuOpen(false);
  };

  const nextStation = () => {
    const currentIndex = radioStations.findIndex(station => station.id === currentStation.id);
    const nextIndex = (currentIndex + 1) % radioStations.length;
    changeStation(radioStations[nextIndex]);
  };

  const prevStation = () => {
    const currentIndex = radioStations.findIndex(station => station.id === currentStation.id);
    const prevIndex = (currentIndex - 1 + radioStations.length) % radioStations.length;
    changeStation(radioStations[prevIndex]);
  };

  return (
    <div className={cn('glass-panel rounded-2xl p-6 backdrop-blur-md', className)}>
      <div className="relative flex items-start gap-4">
        {/* Station artwork */}
        <div className="relative min-w-[120px] w-32">
          <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg">
            <img 
              src={currentStation.thumbnailUrl} 
              alt={currentStation.name} 
              className={cn(
                "w-full h-full object-cover transition-transform duration-1000",
                isPlaying && "rotate-record animate-pulse-subtle"
              )}
            />
          </div>
          
          {/* Play button overlay */}
          <button 
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl",
              "transition-opacity hover:bg-black/40",
              isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
            )}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white" />
            )}
          </button>
        </div>
        
        {/* Station info */}
        <div className="flex-1">
          <div className="relative">
            <button 
              onClick={() => setStationMenuOpen(!stationMenuOpen)}
              className="flex items-start text-left w-full group"
            >
              <div>
                <h2 className="text-xl font-semibold leading-tight group-hover:underline">
                  {currentStation.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStation.description}
                </p>
              </div>
            </button>
            
            {/* Station selector dropdown */}
            {stationMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-full max-w-[250px] z-10 
                           bg-background/95 backdrop-blur-sm border rounded-lg shadow-md py-1 animate-fade-in">
                {radioStations.map(station => (
                  <button
                    key={station.id}
                    onClick={() => changeStation(station)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-left hover:bg-accent/20 transition-colors",
                      station.id === currentStation.id && "bg-accent/10 font-medium"
                    )}
                  >
                    <div className="w-8 h-8 mr-2 overflow-hidden rounded-md flex-shrink-0">
                      <img 
                        src={station.thumbnailUrl} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{station.name}</div>
                      <div className="text-xs text-muted-foreground">{station.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Player controls */}
          <div className="flex items-center gap-2 mt-6">
            <button 
              onClick={prevStation}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Previous station"
            >
              <SkipBack size={18} />
            </button>
            
            <button 
              onClick={togglePlay}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "bg-primary text-primary-foreground shadow-sm",
                "hover:bg-primary/90 transition-colors"
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={nextStation}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Next station"
            >
              <SkipForward size={18} />
            </button>
            
            <VolumeControl 
              volume={volume}
              onChange={setVolume}
              className="ml-4"
            />
            
            <a 
              href={currentStation.streamUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-auto p-2 text-foreground/50 hover:text-foreground transition-colors"
              aria-label="Open in YouTube"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Hidden iframe for YouTube */}
      <div className="hidden">
        <iframe 
          id="youtube-iframe"
          width="0" 
          height="0" 
          frameBorder="0" 
          allow="autoplay" 
          title="YouTube Audio Player"
        ></iframe>
      </div>
    </div>
  );
};

export default RadioPlayer;
