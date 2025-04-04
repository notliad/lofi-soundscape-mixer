import React, { useState, useEffect, useRef } from 'react';
import { Timer, Pause, Play, RotateCcw, Coffee, ChevronDown, ChevronUp, CopyrightIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  className?: string;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
};

const POMODORO_COLLAPSED_KEY = 'lofi-pomodoro-collapsed';
const POMODORO_SETTINGS_KEY = 'lofi-pomodoro-settings';

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ className }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIMER_SETTINGS.work);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Default to collapsed
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications and load saved states
  useEffect(() => {
    audioRef.current = new Audio('/effects/bell.mp3');
    
    // Load collapsed state from localStorage
    const savedCollapsedState = localStorage.getItem(POMODORO_COLLAPSED_KEY);
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
    
    // Load timer settings from localStorage
    const savedSettings = localStorage.getItem(POMODORO_SETTINGS_KEY);
    if (savedSettings !== null) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as TimerSettings;
        setTimerSettings(parsedSettings);
        setTempSettings(parsedSettings);
        if (!isActive) {
          setTimeLeft(parsedSettings[mode]);
        }
      } catch (error) {
        console.error('Error parsing saved timer settings:', error);
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            playNotificationSound();
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Update progress bar
  useEffect(() => {
    const totalTime = timerSettings[mode];
    const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
    setProgress(progressPercentage);
  }, [timeLeft, mode, timerSettings]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'work') {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // After 4 pomodoros, take a long break
      if (newCompletedPomodoros % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      // After break, go back to work
      switchMode('work');
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(timerSettings[newMode]);
    setProgress(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerSettings[mode]);
    setProgress(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    switch (mode) {
      case 'work':
        return 'bg-red-500';
      case 'shortBreak':
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
      default:
        return 'bg-primary';
    }
  };

  // Toggle collapsed state and save to localStorage
  const toggleCollapsed = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem(POMODORO_COLLAPSED_KEY, newCollapsedState.toString());
  };
  
  // Save timer settings
  const saveSettings = () => {
    // Validate settings
    if (tempSettings.work <= 0 || tempSettings.shortBreak <= 0 || tempSettings.longBreak <= 0) {
      toast({
        title: "Invalid settings",
        description: "All timer durations must be greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    // Update settings
    setTimerSettings(tempSettings);
    localStorage.setItem(POMODORO_SETTINGS_KEY, JSON.stringify(tempSettings));
    
    // Update current timer if not active
    if (!isActive) {
      setTimeLeft(tempSettings[mode]);
      setProgress(0);
    }
    
    setSettingsOpen(false);
    
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated."
    });
  };
  
  // Handle input changes for timer settings
  const handleSettingChange = (setting: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setTempSettings(prev => ({
        ...prev,
        [setting]: numValue * 60 // Convert minutes to seconds
      }));
    }
  };
  
  // Format minutes for input display
  const formatMinutes = (seconds: number): string => {
    return Math.floor(seconds / 60).toString();
  };

  return (
    <Collapsible
      open={!isCollapsed}
      onOpenChange={(open) => {
        setIsCollapsed(!open);
        localStorage.setItem(POMODORO_COLLAPSED_KEY, (!open).toString());
      }}
      className={cn('flex flex-col', className)}
    >
      <div className="flex items-center justify-between max-xs:gap-1 max-xs:flex-col">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5" aria-hidden="true" />
          <h2 className="text-lg font-medium">Pomodoro Timer</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {completedPomodoros} {completedPomodoros === 1 ? 'session' : 'sessions'} completed
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label={isCollapsed ? "Expand timer" : "Collapse timer"}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
      <div className='animate-fade-in'>
        <Tabs 
          defaultValue="work" 
          value={mode}
          onValueChange={(value) => switchMode(value as TimerMode)}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
        </Tabs>

      <div className={cn(
        `${theme === 'dark' ? 'bg-background/30' : 'bg-background/70'} rounded-xl p-6 mt-4 flex flex-col items-center justify-center`,
        isActive ? 'animate-pulse-subtle' : ''
      )}>
        <div className="text-4xl font-bold mb-4">
          {formatTime(timeLeft)}
        </div>
        
        <Progress 
          value={progress} 
          className="w-full h-2 mb-4" 
          indicatorClassName={getTimerColor()} 
        />
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTimer}
            aria-label={isActive ? "Pause Timer" : "Start Timer"}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTimer}
            aria-label="Reset Timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setTempSettings({...timerSettings});
              setSettingsOpen(true);
            }}
            aria-label="Timer Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

        <div className="mt-2 text-xs text-muted-foreground text-center">
          {mode === 'work' ? (
            <div className="flex items-center justify-center gap-1">
              <Timer className="w-3 h-3" /> Focus time
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Coffee className="w-3 h-3" /> Break time
            </div>
          )}
            <div className="flex items-center justify-center gap-1 mt-4">
          <CopyrightIcon className='w-3 h-3' /> Sound Effect by <a href="https://pixabay.com/pt/users/liecio-3298866/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=189741">LIECIO</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=189741">Pixabay</a>
          </div>
        </div>
      </div>
      </CollapsibleContent>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workTime" className="text-right">
                Work Time
              </Label>
              <Input
                id="workTime"
                type="number"
                min="1"
                max="120"
                className="col-span-3"
                value={formatMinutes(tempSettings.work)}
                onChange={(e) => handleSettingChange('work', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortBreakTime" className="text-right">
                Short Break
              </Label>
              <Input
                id="shortBreakTime"
                type="number"
                min="1"
                max="30"
                className="col-span-3"
                value={formatMinutes(tempSettings.shortBreak)}
                onChange={(e) => handleSettingChange('shortBreak', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longBreakTime" className="text-right">
                Long Break
              </Label>
              <Input
                id="longBreakTime"
                type="number"
                min="1"
                max="60"
                className="col-span-3"
                value={formatMinutes(tempSettings.longBreak)}
                onChange={(e) => handleSettingChange('longBreak', e.target.value)}
              />
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              All times are in minutes.
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={saveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Collapsible>
  );
};

export default PomodoroTimer;