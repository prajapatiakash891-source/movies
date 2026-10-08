import React from 'react';
import { Film, RefreshCw, ArrowLeft } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  title = 'No Content Found',
  description = 'We couldn’t find any movies or web series matching your request.',
  onReset,
  showGoBack = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel rounded-2xl border border-dark-border my-8">
      <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mb-4">
        <Film size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-md mb-6">{description}</p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {onReset && (
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={onReset}>
            Reset Filters
          </Button>
        )}
        {showGoBack && (
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => window.history.back()}>
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
