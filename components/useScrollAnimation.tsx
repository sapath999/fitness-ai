
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options?: ScrollAnimationOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options?.triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return { ref, isVisible };
};
