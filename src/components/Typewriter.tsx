import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  startDelay?: number;
  className?: string;
  glitch?: boolean;
}

export default function Typewriter({ text, delay = 50, startDelay = 0, className = "", glitch = false }: TypewriterProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);
    return () => clearTimeout(startTimeout);
  }, [startDelay]);

  useEffect(() => {
    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, hasStarted]);

  if (!hasStarted) return <span className={className}></span>;

  return (
    <span className={`${className} ${glitch && currentIndex === text.length ? 'glitch-text' : ''}`} data-text={glitch && currentIndex === text.length ? text : undefined}>
      {currentText}
      {currentIndex < text.length && (
        <span className="animate-pulse border-r-2 border-emerald-500 ml-1 inline-block h-[1em] translate-y-1"></span>
      )}
    </span>
  );
}
