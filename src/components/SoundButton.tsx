
import React from 'react';
import { cn } from '@/lib/utils';

interface SoundButtonProps {
  name: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const SoundButton: React.FC<SoundButtonProps> = ({
  name,
  icon,
  isActive,
  onClick,
  className
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        'sound-button w-12 h-12 rounded-full bg-background border transition-all duration-300',
        isActive ? 'sound-button-active border-accent shadow-md scale-105' : 'border-border/50',
        className
      )}
      aria-label={`${isActive ? 'Disable' : 'Enable'} ${name} sound`}
      title={name}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
};

export default SoundButton;
