import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function Motion() {
  useEffect(() => {
    if (import.meta.env.DEV) Object.assign(window, { ScrollTrigger });
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const mobile = matchMedia('(width < 768px)').matches;
      if (document.querySelector('.hero-content')) {
        gsap.from('.hero-copy > *', {
          y: mobile ? '.625rem' : '1.125rem',
          opacity: 0,
          stagger: 0.07,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
        gsap.from('.photo-card', {
          y: mobile ? '.75rem' : '1.5rem',
          opacity: 0,
          stagger: 0.12,
          duration: 0.85,
          delay: 0.15,
          ease: 'power3.out',
          clearProps: 'opacity,translate',
        });
        gsap.from('.hero-collage .petal-note', {
          scale: 0.85,
          opacity: 0,
          rotation: -22,
          transformOrigin: '50% 50%',
          duration: 0.65,
          delay: 0.4,
          ease: 'power2.out',
          clearProps: 'transform,transformOrigin,opacity',
        });
      }
      gsap.utils
        .toArray<HTMLElement>('.section-heading, .creator-panel, .say-hello__copy, .say-hello__contacts')
        .forEach((element) => {
          gsap.from(element, {
            y: '.875rem',
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 95%', once: true },
            clearProps: 'transform',
          });
        });
      // A brief flower fade marks the transition between sections, without perpetual movement.
      gsap.utils.toArray<HTMLElement>('.flower').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.65 },
          {
            opacity: 1,
            duration: 0.7,
            ease: 'sine.out',
            scrollTrigger: { trigger: element, start: 'top 95%', once: true },
            clearProps: 'opacity',
          },
        );
      });
    });
    return () => mm.revert();
  }, []);
  return null;
}
