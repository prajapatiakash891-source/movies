import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ value = 0, max = 10, size = 16, showValue = true, interactive = false, onChange }) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const starsCount = 5; // 5 star scale display
  const fillRatio = (normalizedValue / max) * starsCount;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(starsCount)].map((_, i) => {
          const filled = i + 1 <= Math.round(fillRatio);
          return (
            <Star
              key={i}
              size={size}
              className={`${
                filled ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'
              } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              onClick={() => interactive && onChange && onChange((i + 1) * (max / starsCount))}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-bold text-yellow-400 ml-0.5">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
