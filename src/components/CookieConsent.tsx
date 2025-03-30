import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

type CookiePreferences = {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
};

const COOKIE_CONSENT_KEY = 'lofi-cookie-consent';

export const getCookieConsent = (): CookiePreferences | null => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent ? JSON.parse(consent) : null;
};

export const setCookieConsent = (preferences: CookiePreferences) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
};

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Essential cookies are always required
    preferences: false,
    analytics: false,
  });

  useEffect(() => {
    // Check if user has already set cookie preferences
    const savedConsent = getCookieConsent();
    
    // If no consent is found, show the banner
    if (!savedConsent) {
      // Small delay to prevent banner from appearing immediately on page load
      const timer = setTimeout(() => {
        setVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Apply saved preferences
      setPreferences(savedConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      preferences: true,
      analytics: true,
    };
    setPreferences(newPreferences);
    setCookieConsent(newPreferences);
    setVisible(false);
    toast({
      title: 'Cookies accepted',
      description: 'Thank you for accepting all cookies.',
    });
  };

  const handleAcceptEssential = () => {
    const newPreferences = {
      essential: true,
      preferences: false,
      analytics: false,
    };
    setPreferences(newPreferences);
    setCookieConsent(newPreferences);
    setVisible(false);
    toast({
      title: 'Essential cookies accepted',
      description: 'Only essential cookies will be used.',
    });
  };

  const handleCustomize = () => {
    setCookieConsent(preferences);
    setVisible(false);
    toast({
      title: 'Cookie preferences saved',
      description: 'Your cookie preferences have been saved.',
    });
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be toggled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!visible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg animate-slide-up">
      {/* Compact Banner */}
      <div className={`p-4 ${expanded ? 'hidden' : 'block'}`}>
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <Button size="sm" variant="outline" onClick={toggleExpanded}>Customize</Button>
            <Button size="sm" variant="outline" onClick={handleAcceptEssential}>Essential Only</Button>
            <Button size="sm" onClick={handleAcceptAll}>Accept All</Button>
          </div>
        </div>
      </div>
      
      {/* Expanded Settings */}
      <div className={`p-4 ${expanded ? 'block' : 'hidden'}`}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Cookie Preferences</h3>
            <Button variant="ghost" size="icon" onClick={() => setExpanded(false)}>
              <X size={18} />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            We use cookies to enhance your experience on our website. This includes storing your preferences and providing analytics to improve our service.
          </p>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">Required for the website to function properly.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.essential} 
                disabled 
                className="accent-primary" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Preference Cookies</h4>
                <p className="text-sm text-muted-foreground">Remember your sound settings and theme preferences.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.preferences} 
                onChange={() => handlePreferenceChange('preferences')} 
                className="accent-primary" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">Help us understand how you use our website.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.analytics} 
                onChange={() => handlePreferenceChange('analytics')} 
                className="accent-primary" 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleAcceptEssential}>Essential Only</Button>
            <Button variant="outline" onClick={handleCustomize}>Save Preferences</Button>
            <Button onClick={handleAcceptAll}>Accept All</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;