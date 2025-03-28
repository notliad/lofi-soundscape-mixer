
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, ExternalLink, Headphones, Plus, Save, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";
import VolumeControl from './VolumeControl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { defaultStation, RadioStation, radioStations } from '@/data/radioStations';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface RadioPlayerProps {
  className?: string;
}

const SAVED_STATIONS_KEY = 'loscapefi-saved-stations';

const RadioPlayer: React.FC<RadioPlayerProps> = ({ className }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation>(defaultStation);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [videoElement, setVideoElement] = useState<HTMLIFrameElement | null>(null);
  const [showStationGrid, setShowStationGrid] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customUrlError, setCustomUrlError] = useState('');
  const [isCustomStation, setIsCustomStation] = useState(false);
  const [savedStations, setSavedStations] = useState<RadioStation[]>([]);
  const [showSavedStations, setShowSavedStations] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [errorTryCount ,setErrorRetryCount] = useState(0);
  const { theme } = useTheme();
  const { toast } = useToast();

  const togglePlay = () => {
    if (!videoElement) return;

    if (isPlaying) {
      // Pause the stream by setting source to blank
      videoElement.src = '';
    } else {
      // Play by setting the source with enablejsapi=1 to allow API control
      videoElement.src = `${currentStation.streamUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0&enablejsapi=1`;

      

      console.log(videoElement);
      // Set initial volume after a short delay to ensure the iframe has loaded
      setTimeout(() => {
        try {
          videoElement.contentWindow?.postMessage(JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [volume * 100],
          }), '*');
        } catch (error) {
          console.error('Error setting initial volume:', error);
        }
      }, 1000);
    }
    
    setIsPlaying(!isPlaying);
  };

  // YouTube Player API reference
  const youtubePlayer = useRef<any>(null);

  useEffect(() => {
    // Find the iframe element
    const iframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    setVideoElement(iframe);
    // Load YouTube API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Define the onYouTubeIframeAPIReady function
    (window as any).onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
    };

    // Load saved stations from localStorage
    const savedStationsJson = localStorage.getItem(SAVED_STATIONS_KEY);
    if (savedStationsJson) {
      try {
        const parsedStations = JSON.parse(savedStationsJson) as RadioStation[];
        setSavedStations(parsedStations);
      } catch (error) {
        console.error('Error parsing saved stations:', error);
      }
    }

    return () => {
      // Cleanup
      if (iframe) {
        iframe.src = '';
      }
      // Remove the global function
      delete (window as any).onYouTubeIframeAPIReady;
    };
  }, []);

  // Effect to handle volume changes
  useEffect(() => {
    // Use postMessage to control volume if iframe exists
    if (videoElement && isPlaying) {
      try {
        // YouTube iframe API uses values between 0-100 for volume
        videoElement.contentWindow?.postMessage(JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [volume * 100],
        }), '*');
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }, [volume, videoElement, isPlaying]);

  const changeStation = (station: RadioStation) => {
    setCurrentStation(station);
    setIsCustomStation(false);
    
    if (isPlaying && videoElement) {
      // Include enablejsapi=1 to allow API control
      videoElement.src = `${station.streamUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0&enablejsapi=1`;
      
      // Set volume after a short delay to ensure the iframe has loaded
      setTimeout(() => {
        try {
          videoElement.contentWindow?.postMessage(JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [volume * 100],
          }), '*');
        } catch (error) {
          console.error('Error setting volume after station change:', error);
        }
      }, 1000);
    }
  };

  const handleCustomUrlSubmit = () => {
    // Basic validation for YouTube URL
    if (!customUrl.trim()) {
      setCustomUrlError('Please enter a URL');
      return;
    }
    
    // Check for valid YouTube URL formats
    const isYoutubeUrl = customUrl.includes('youtube.com/watch?v=');
    const isYoutubeShortUrl = customUrl.includes('youtu.be/');
    
    if (!isYoutubeUrl && !isYoutubeShortUrl) {
      setCustomUrlError('Please enter a valid YouTube URL');
      return;
    }
    
    setCustomUrlError('');
    
    // Process the URL to ensure it works with the embed format
    let processedUrl = customUrl;
    
    // Handle youtu.be short links
    if (isYoutubeShortUrl) {
      const videoId = customUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        processedUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
    
    // Use provided title or default
    const stationTitle = customTitle.trim() || 'Custom Stream';
    
    // Create a unique ID for the custom station
    const customId = `custom-${Date.now()}`;
    
    // Create a custom station object
    const customStation: RadioStation = {
      id: customId,
      name: stationTitle,
      description: 'Your custom YouTube stream',
      thumbnailUrl: 'https://i.ibb.co/G0VWw9t/lofi-girl.jpg', // Default thumbnail
      streamUrl: processedUrl,
      isCustom: true
    };
    
    setCurrentStation(customStation);
    setIsCustomStation(true);
    
    // Save to localStorage
    const updatedSavedStations = [...savedStations, customStation];
    setSavedStations(updatedSavedStations);
    localStorage.setItem(SAVED_STATIONS_KEY, JSON.stringify(updatedSavedStations));
    
    if (isPlaying && videoElement) {
      videoElement.src = `${processedUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0&enablejsapi=1`;
      
      // Set volume after a short delay to ensure the iframe has loaded
      setTimeout(() => {
        try {
          videoElement.contentWindow?.postMessage(JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [volume * 100],
          }), '*');
        } catch (error) {
          console.error('Error setting volume for custom station:', error);
        }
      }, 1000);
    }
    
    // Show success toast and close dialog
    toast({
      title: "Custom stream saved",
      description: `Your stream "${stationTitle}" has been saved and is ready to play`,
    });
    
    // Reset the custom fields
    setCustomUrl('');
    setCustomTitle('');
    
    // Close the dialog by simulating a click on the close button
    const closeButton = document.getElementById('closeDialog') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  };

  const nextStation = () => {
    // Combine default and saved stations for navigation
    const allStations = [...radioStations, ...savedStations];
    
    // Find the current station in the combined array
    const currentIndex = allStations.findIndex(station => station.id === currentStation.id);
    
    // If station not found in the combined array, default to the first station
    if (currentIndex === -1) {
      changeStation(allStations[0]);
      return;
    }
    
    // Calculate the next index with wraparound
    const nextIndex = (currentIndex + 1) % allStations.length;
    changeStation(allStations[nextIndex]);
  };

  const prevStation = () => {
    // Combine default and saved stations for navigation
    const allStations = [...radioStations, ...savedStations];
    
    // Find the current station in the combined array
    const currentIndex = allStations.findIndex(station => station.id === currentStation.id);
    
    // If station not found in the combined array, default to the last station
    if (currentIndex === -1) {
      changeStation(allStations[allStations.length - 1]);
      return;
    }
    
    // Calculate the previous index with wraparound
    const prevIndex = (currentIndex - 1 + allStations.length) % allStations.length;
    changeStation(allStations[prevIndex]);
  };
  
  const deleteCustomStation = (stationId: string) => {
    const updatedStations = savedStations.filter(station => station.id !== stationId);
    setSavedStations(updatedStations);
    localStorage.setItem(SAVED_STATIONS_KEY, JSON.stringify(updatedStations));
    
    // If the current station is being deleted, switch to default
    if (currentStation.id === stationId) {
      changeStation(defaultStation);
    }
    
    toast({
      title: "Station removed",
      description: "The custom station has been removed from your saved stations",
    });
  };

  return (
    <div className={cn(`${theme === 'dark' ? 'glass-panel-dark' : 'glass-panel'} transition-all duration-300 delay-100 rounded-2xl p-4 sm:p-6 backdrop-blur-md relative`, className)}>
      <div className="relative flex flex-col">
        {/* Current station and player */}
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
          {/* Station artwork */}
          <div className="relative min-w-[100px] w-28 sm:min-w-[120px] sm:w-32">
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
          <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
            <div>
              <h2 className="text-xl font-semibold leading-tight flex items-center gap-2 justify-center sm:justify-start">
                {currentStation.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStation.description}
              </p>
            </div>
            {/* Player controls */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 sm:mt-6 max-xs:gap-3 max-xs:flex-col">
              <div>
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
              </div>
              <div className="flex">
                <VolumeControl 
                  volume={volume}
                  onChange={setVolume}
                  className="ml-4 mr-2"
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
          
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 max-xs:justify-center">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary/70" />
              <button 
                onClick={() => setShowStationGrid(!showStationGrid)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {showStationGrid ? 'Hide Stations' : 'Show Stations'}
              </button>
            </h2>
            
            {savedStations.length > 0 && (
              <button 
                onClick={() => setShowSavedStations(!showSavedStations)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Save size={14} />
                {showSavedStations ? 'Hide Saved' : 'Show Saved'}
              </button>
            )}
          </div>
          
          <Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus size={16} />
                      <span className="sm:inline">Add Station</span>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add custom YouTube stream</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom YouTube Stream</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter a YouTube URL and title to save as a custom radio station.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="custom-title">Station Title</Label>
                  <Input
                    id="custom-title"
                    placeholder="My Favorite Lofi Mix"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-url">YouTube URL (Playlists not supported yet)</Label>
                  <Input
                    id="custom-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                  {customUrlError && (
                    <p className="text-sm text-destructive">{customUrlError}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button id='closeDialog' variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCustomUrlSubmit}>Save Station</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Default Station Grid */}
        {showStationGrid && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-2">
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
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 overflow-hidden rounded-lg">
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
        
        {/* Saved Custom Stations */}
        {showSavedStations && savedStations.length > 0 && (
          <div className="animate-fade-in mt-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Save size={14} className="text-primary/70" />
              Your Saved Stations
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-2">
              {savedStations.map(station => (
                <div
                  key={station.id}
                  className={cn(
                    "relative flex flex-col items-center p-3 rounded-lg transition-all",
                    "border hover:shadow-md",
                    station.id === currentStation.id 
                      ? "border-primary/50 bg-accent/20" 
                      : "border-border/50 hover:border-border"
                  )}
                >
                  <button
                    onClick={() => changeStation(station)}
                    className="absolute inset-0 w-full h-full z-10"
                    aria-label={`Play ${station.name}`}
                  />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 overflow-hidden rounded-lg">
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
                  
                  {/* Delete button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomStation(station.id);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-destructive/90 hover:text-destructive-foreground z-20 transition-colors"
                          aria-label={`Delete ${station.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete saved station</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Error message for playback issues */}
      {playbackError && isPlaying && (
        <Alert variant="destructive" className={`${theme === 'light' && 'bg-red-500'} mt-4 animate-fade-in `}>
          <AlertTriangle className={'h-4 w-4'} color={theme === 'light' ? 'white' : 'red'} />
          <AlertTitle className={`${theme === 'light' && 'text-white'}`}>Playback Error</AlertTitle>
          <AlertDescription>
            <p className={`${theme === 'light' && 'text-white'}`}>Unable to play this YouTube stream. This may be caused by a VPN connection or network restrictions.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 gap-1"
              onClick={() => {
                // Retry playback with incremented retry count
                setErrorRetryCount(prev => prev + 1);
                setPlaybackError(false);
                
                if (videoElement) {
                  // Reload the iframe with the stream URL
                  videoElement.src = `${currentStation.streamUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0&enablejsapi=1&origin=${window.location.origin}`;
                }
              }}
            >
              <RefreshCw size={14} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Hidden iframe for YouTube */}
      <div className="hidden">
        <iframe 
          id="youtube-iframe"
          width="0" 
          height="0" 
          allow="autoplay" 
          title="YouTube Audio Player"
          enablejsapi="1"
          onError={() => setPlaybackError(true)}
        ></iframe>
      </div>
    </div>
  );
};

export default RadioPlayer;

