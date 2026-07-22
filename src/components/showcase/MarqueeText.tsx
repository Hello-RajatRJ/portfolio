import React from 'react';

/**
 * Infinite horizontal marquee text — inspired by myshaky.com.
 * Creates a seamless looping text strip.
 *
 * Props:
 *  - items: Array of text strings to display
 *  - separator: Character between items (default '·')
 *  - speed: Animation duration in seconds (default 30)
 *  - direction: 'left' or 'right' (default 'left')
 *  - className: Additional classes for the text
 */
interface MarqueeTextProps {
  items: string[];
  separator?: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  items,
  separator = '·',
  speed = 30,
  direction = 'left',
  className = '',
}) => {
  const content = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div className="relative overflow-hidden whitespace-nowrap py-6 md:py-8">
      <div
        className={`inline-flex ${direction === 'right' ? 'marquee-right' : 'marquee-left'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Duplicate for seamless loop */}
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`inline-block font-orbitron text-xl md:text-3xl lg:text-4xl font-bold tracking-wider uppercase ${className}`}
            style={{ paddingRight: '2rem' }}
          >
            {content}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
