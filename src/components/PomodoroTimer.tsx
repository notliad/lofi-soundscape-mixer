import React, { useState, useEffect, useRef } from 'react';
import { Timer, Pause, Play, RotateCcw, Coffee, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ className }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIMER_SETTINGS.work);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Default to collapsed
  const { theme } = useTheme();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications and load collapsed state
  useEffect(() => {
    audioRef.current = new Audio('/effects/bell.mp3');
    
    // Load collapsed state from localStorage
    const savedCollapsedState = localStorage.getItem(POMODORO_COLLAPSED_KEY);
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
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
    const totalTime = DEFAULT_TIMER_SETTINGS[mode];
    const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
    setProgress(progressPercentage);
  }, [timeLeft, mode]);

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
    setTimeLeft(DEFAULT_TIMER_SETTINGS[newMode]);
    setProgress(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIMER_SETTINGS[mode]);
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
        </div>
      </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PomodoroTimer;