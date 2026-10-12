import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { RevealImage } from './RevealImage';
import { Icon } from './Primitives';
import { getImageProps, heroImageSizes } from '../content/images';

export function HeroCollage() {
  const collage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = collage.current!;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const entrances = Array.from(root.querySelectorAll<HTMLElement>('.photo-card__entrance'));
      const follows = Array.from(root.querySelectorAll<HTMLElement>('.photo-card__follow'));
      const tag = root.querySelector<HTMLElement>('.handmade__swing')!;
      const pin = tag.querySelector<HTMLElement>('.icon')!;
      const note = root.querySelector<HTMLElement>('.petal-note')!;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const token = (name: string) => parseFloat(getComputedStyle(root).getPropertyValue(name));
      const pivot = () => {
        tag.style.transformOrigin = `${pin.offsetLeft + pin.offsetWidth / 2}px ${pin.offsetTop + pin.offsetHeight / 2}px`;
      };
      pivot();
      const observer = new ResizeObserver(pivot);
      observer.observe(tag);
      observer.observe(pin);
      let entered = false;
      const entrance = gsap.timeline({ onComplete: () => { pivot(); entered = true; } });
      entrance.fromTo(entrances, {
        y: token('--motion-collage-rise') * rem,
        rotation: (index: number) => index === 0 ? -6 : 6,
        opacity: 0,
      }, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: token('--motion-duration-collage-enter') / 1000,
        stagger: .1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
      entrance.from(tag, {
        rotation: 18,
        opacity: 0,
        duration: .65,
        ease: 'back.out(1.2)',
        clearProps: 'transform,opacity',
      }, .45);
      entrance.from(note, {
        scale: .85,
        rotation: -22,
        opacity: 0,
        duration: .65,
        ease: 'power2.out',
        clearProps: 'transform,transformOrigin,opacity',
      }, .65);

      const pointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
      const followDistance = token('--motion-collage-follow-distance') * rem;
      const followRotation = token('--motion-collage-follow-rotation');
      const movers = follows.map((element) => ({
        x: gsap.quickTo(element, 'x', { duration: .28, ease: 'power3.out' }),
        y: gsap.quickTo(element, 'y', { duration: .28, ease: 'power3.out' }),
        rotation: gsap.quickTo(element, 'rotation', { duration: .28, ease: 'power3.out' }),
      }));
      const swingTag = gsap.quickTo(tag, 'rotation', { duration: .28, ease: 'power3.out' });
      const turnNote = gsap.quickTo(note, 'rotation', { duration: .28, ease: 'power3.out' });
      const tagRotation = token('--motion-collage-tag-follow-rotation');
      const noteRotation = token('--motion-collage-note-follow-rotation');
      const reset = () => {
        if (!entered) return;
        movers.forEach((move) => { move.x(0); move.y(0); move.rotation(0); });
        swingTag(0);
        turnNote(0);
      };
      const overPhoto = (target: EventTarget | null) =>
        target instanceof Element && Boolean(target.closest('.photo-card .image-reveal'));
      const move = (event: PointerEvent) => {
        if (!entered || !pointer.matches || event.pointerType !== 'mouse') return;
        if (!overPhoto(event.target)) return reset();
        const bounds = root.getBoundingClientRect();
        const x = gsap.utils.clamp(-1, 1, (event.clientX - bounds.left) / bounds.width * 2 - 1);
        const y = gsap.utils.clamp(-1, 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
        movers.forEach((follow, index) => {
          const depth = followDistance * (index === 0 ? 1 : 2 / 3);
          follow.x(x * depth);
          follow.y(y * depth);
          follow.rotation(x * followRotation * (index === 0 ? 1 : -2 / 3));
        });
        swingTag(x * tagRotation);
        turnNote(x * noteRotation);
      };
      const leavePhoto = (event: PointerEvent) => {
        if (!overPhoto(event.relatedTarget)) reset();
      };
      root.addEventListener('pointermove', move, { passive: true });
      root.addEventListener('pointerout', leavePhoto);
      root.addEventListener('pointerleave', reset);
      pointer.addEventListener('change', reset);
      return () => {
        observer.disconnect();
        root.removeEventListener('pointermove', move);
        root.removeEventListener('pointerout', leavePhoto);
        root.removeEventListener('pointerleave', reset);
        pointer.removeEventListener('change', reset);
        tag.style.removeProperty('transform-origin');
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={collage} className="hero-collage">
      <figure className="photo-card photo-card-first">
        <div className="photo-card__entrance">
          <div className="photo-card__follow">
            <RevealImage
              artwork
              {...getImageProps('images/hero/hero-perfect-surprise.png', heroImageSizes)}
              loading="eager"
              decoding="async"
              alt="Perfect Surprise — a collection of hand-sculpted miniature people"
              width="801"
              height="1041"
              fetchPriority="high"
            />
            <div className="handmade">
              <span className="bookmark handmade__swing">
                Hand Made <Icon name="asterisk" />
              </span>
            </div>
          </div>
        </div>
      </figure>
      <figure className="photo-card photo-card-second">
        <div className="photo-card__entrance">
          <div className="photo-card__follow">
            <RevealImage
              artwork
              {...getImageProps('images/hero/hero-made-for-you.png', heroImageSizes)}
              loading="eager"
              decoding="async"
              alt="Made specially for you — a tiny clay cow being painted by hand"
              width="800"
              height="1040"
            />
          </div>
        </div>
      </figure>
      <div className="petal-note">
        Good
        <br />
        Things
        <br />
        Grow
        <br />
        Slowly
      </div>
    </div>
  );
}
