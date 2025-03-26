import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from './ui/dialog';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface SoundProfile {
  name: string;
  activeSounds: Record<string, {
    soundId: string;
    volume: number;
  }>;
  masterVolume: number;
}

interface ProfileManagerProps {
  activeSounds: Record<string, {
    sound: {
      id: string;
      name: string;
      icon: string;
      soundUrl: string;
    };
    volume: number;
    audioElement: HTMLAudioElement | null;
  }>;
  masterVolume: number;
  onLoadProfile: (profile: SoundProfile) => void;
  onClearSounds: () => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({
  activeSounds,
  masterVolume,
  onLoadProfile,
  onClearSounds
}) => {
  const [profiles, setProfiles] = useState<SoundProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  // Load profiles from localStorage on component mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('soundProfiles');
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load saved profiles',
          variant: 'destructive'
        });
      }
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('soundProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const saveCurrentProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a profile name',
        variant: 'destructive'
      });
      return;
    }

    // Check if profile name already exists
    const profileExists = profiles.some(profile => profile.name === newProfileName);
    if (profileExists) {
      toast({
        title: 'Error',
        description: 'A profile with this name already exists',
        variant: 'destructive'
      });
      return;
    }

    // Create a new profile from current state
    const newProfile: SoundProfile = {
      name: newProfileName,
      activeSounds: Object.entries(activeSounds).reduce((acc, [id, { sound, volume }]) => {
        acc[id] = {
          soundId: sound.id,
          volume
        };
        return acc;
      }, {} as Record<string, { soundId: string; volume: number }>),
      masterVolume
    };

    setProfiles([...profiles, newProfile]);
    setNewProfileName('');
    setSaveDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `Profile "${newProfileName}" saved successfully`,
    });
  };

  const loadProfile = (profile: SoundProfile) => {
    onLoadProfile(profile);
    setLoadDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `Profile "${profile.name}" loaded successfully`,
    });
  };

  const deleteProfile = (profileName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the load profile action
    
    setProfiles(profiles.filter(profile => profile.name !== profileName));
    
    toast({
      title: 'Success',
      description: `Profile "${profileName}" deleted`,
    });
  };

  const handleClearSounds = () => {
    onClearSounds();
    
    toast({
      title: 'Success',
      description: 'All sounds cleared',
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Save Profile Button */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" title="Save Profile">
            <Save size={16} />
            <span className="sr-only md:not-sr-only md:inline-block">Save</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Sound Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCurrentProfile}>Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Profile Button */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" title="Load Profile">
            <FolderOpen size={16} />
            <span className="sr-only md:not-sr-only md:inline-block">Load</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Sound Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[300px] overflow-y-auto">
            {profiles.length === 0 ? (
              <p className="text-center text-muted-foreground">No saved profiles</p>
            ) : (
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <div 
                    key={profile.name} 
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                    onClick={() => loadProfile(profile)}
                  >
                    <span>{profile.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => deleteProfile(profile.name, e)}
                      title="Delete Profile"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Sounds Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleClearSounds}
        title="Clear All Sounds"
      >
        <Trash2 size={16} />
        <span className="sr-only md:not-sr-only md:inline-block">Clear</span>
      </Button>
    </div>
  );
};

export default ProfileManager;