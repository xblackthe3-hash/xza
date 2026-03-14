import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';

export default function DecryptText({ text, className = '', speed = 50, delay = 0 }: DecryptTextProps) {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      let timeoutId: NodeJS.Timeout;
      
      const startAnimation = () => {
        let iteration = 0;
        const interval = setInterval(() => {
          setDisplayText((prev) =>
            text
              .split('')
              .map((char, index) => {
                if (index < iteration) {
                  return text[index];
                }
                // Don't scramble spaces
                if (char === ' ') return ' ';
                return characters[Math.floor(Math.random() * characters.length)];
              })
              .join('')
          );

          if (iteration >= text.length) {
            clearInterval(interval);
            setHasAnimated(true);
          }

          iteration += 1 / 3; // Controls how many random ticks before resolving a letter
        }, speed);
      };

      if (delay > 0) {
        timeoutId = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [isInView, text, speed, delay, hasAnimated]);

  // Initial state before animation
  useEffect(() => {
    if (!hasAnimated && !isInView) {
      setDisplayText(text.replace(/[^\s]/g, '_')); // Show underscores initially
    }
  }, [text, hasAnimated, isInView]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText}
    </span>
  );
}
