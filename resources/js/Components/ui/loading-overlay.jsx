import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay = ({ 
  loading, 
  children, 
  text = 'Loading...', 
  blur = false,
  spinnerSize = 'w-8 h-8'
}) => {
  if (!loading) return children;

  return (
    <div className="relative">
      {blur ? (
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
      ) : children}
      
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/80 shadow-lg">
          <Loader2 className={`animate-spin ${spinnerSize} text-primary`} />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}; 