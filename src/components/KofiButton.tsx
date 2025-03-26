import React from 'react';
import { Coffee } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';

interface KofiButtonProps {
  className?: string;
}

const KofiButton: React.FC<KofiButtonProps> = ({ className }) => {
  return (
    <div className={cn('flex justify-end z-40 mt-4', className)}>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            title="Buy me a coffee"
          >
            <Coffee size={16} />
            <span>Buy me a coffee</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] max-h-[800px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Support the dev</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <iframe 
              id='kofiframe' 
              src='https://ko-fi.com/notliad/?hidefeed=true&widget=true&embed=true&preview=true' 
              style={{border: 'none', width: '100%', padding: '4px', background: '#f9f9f9'}} 
              height='712' 
              title='notliad'
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KofiButton;