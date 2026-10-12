import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function Motion() {
  useEffect(() => {
    if (import.meta.env.DEV) Object.assign(window, { ScrollTrigger });
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
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
