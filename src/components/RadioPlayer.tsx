
import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, ExternalLink, Headphones, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";
import VolumeControl from './VolumeControl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { defaultStation, RadioStation, radioStations } from '@/data/radioStations';

interface RadioPlayerProps {
  className?: string;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ className }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation>(defaultStation);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [videoElement, setVideoElement] = useState<HTMLIFrameElement | null>(null);
  const [showStationGrid, setShowStationGrid] = useState(false);
  const { theme } = useTheme();

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
    <div className={cn(`${theme === 'dark' ? 'glass-panel-dark' : 'glass-panel'} transition-all duration-300 delay-100 rounded-2xl p-6 backdrop-blur-md relative`, className)}>
      {/* Friendly welcome/description */}
      <div className="absolute top-2 right-2 flex items-center gap-2 text-muted-foreground">
        <Smile className="w-4 h-4 text-yellow-500" />
        <span className="text-xs">Relax & study</span>
      </div>

      <div className="relative flex flex-col">
        {/* Current station and player */}
        <div className="relative flex items-start gap-4 mb-4">
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
            
            {/* Play button overlay with tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? "Pause lofi stream" : "Start lofi stream"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Station info */}
          <div className="flex-1">
            <div>
              <h2 className="text-xl font-semibold leading-tight flex items-center gap-2">
                {currentStation.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStation.description}
              </p>
            </div>
            {/* Player controls */}
            <div className="flex items-center gap-2 mt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button 
                      onClick={prevStation}
                      className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                      aria-label="Previous station"
                    >
                      <SkipBack size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous lofi station</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isPlaying ? "Pause music" : "Play music"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button 
                      onClick={nextStation}
                      className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                      aria-label="Next station"
                    >
                      <SkipForward size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next lofi station</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <VolumeControl 
                volume={volume}
                onChange={setVolume}
                className="ml-4"
              />
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <a 
                      href={currentStation.streamUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto p-2 text-foreground/50 hover:text-foreground transition-colors"
                      aria-label="Open in YouTube"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open current station on YouTube</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
        </div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary/70" />
            <button 
            onClick={() => setShowStationGrid(!showStationGrid)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showStationGrid ? 'Hide Stations' : 'Show All Stations'}
          </button>
          </h2>
        </div>
        {/* Station Grid */}
        {showStationGrid && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-2">
              {radioStations.map(station => (
                <button
                  key={station.id}
                  onClick={() => changeStation(station)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg transition-all",
                    "border hover:shadow-md",
                    station.id === currentStation.id 
                      ? "border-primary/50 bg-accent/20" 
                      : "border-border/50 hover:border-border"
                  )}
                >
                  <div className="w-16 h-16 mb-2 overflow-hidden rounded-lg">
                    <img 
                      src={station.thumbnailUrl} 
                      alt={station.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{station.name}</div>
                    <div className="text-xs text-muted-foreground">{station.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
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

