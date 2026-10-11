import { useLayoutEffect, useRef } from 'react';
import { Announcement, Header } from './Header';
import type { SitePage } from '../content/site';

export function StickyHeader({
  page,
  enabled = false,
}: {
  page: SitePage;
  enabled?: boolean;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = shell.current!;
    const space = spacer.current!;
    let previousY = Math.max(0, window.scrollY);
    let direction = 0;
    let distance = 0;
    let frame = 0;
    const show = () => { node.dataset.hidden = 'false'; };
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const height = node.getBoundingClientRect().height;
      const announcementHeight = node.querySelector('.announcement')!.getBoundingClientRect().height;
      space.style.height = `${(page === 'home' || page === 'products' ? announcementHeight : height) / rem}rem`;
      document.documentElement.style.setProperty('--sticky-header-clearance', `${enabled ? height / rem : 0}rem`);
    };
    const update = () => {
      frame = 0;
      if (!enabled) return;
      const y = Math.max(0, window.scrollY);
      const delta = y - previousY;
      previousY = y;
      node.dataset.scrolled = String(y > 1);
      const keyboardFocus = node.contains(document.activeElement)
        && document.activeElement?.matches(':focus-visible');
      if (y <= 1 || node.querySelector('dialog[open]') || keyboardFocus) {
        show();
        distance = 0;
        direction = 0;
        return;
      }
      if (!delta) return;
      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) distance = 0;
      direction = nextDirection;
      distance += Math.abs(delta);
      const threshold = parseFloat(getComputedStyle(document.documentElement).fontSize) / 2;
      if (distance >= threshold) node.dataset.hidden = String(direction < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') show();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    measure();
    update();
    if (enabled) {
      window.addEventListener('scroll', onScroll, { passive: true });
      node.addEventListener('focusin', show);
      window.addEventListener('keydown', onKeyDown);
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      node.removeEventListener('focusin', show);
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.removeProperty('--sticky-header-clearance');
    };
  }, [page, enabled]);

  return (
    <>
      <div
        ref={shell}
        className="sticky-header"
        data-sticky={enabled}
        data-hidden="false"
        data-scrolled="false"
      >
        <Announcement />
        <div className="sticky-header__frame">
          <Header page={page} />
        </div>
      </div>
      <div ref={spacer} className="sticky-header__space" aria-hidden="true" />
    </>
  );
}
