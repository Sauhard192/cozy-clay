import { siteUrl } from '../utils/paths';
import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const POP_VOLUME = 0.15;
const CONTROL =
  'button, a[href], input:not([type="hidden"]), select, summary, [role="button"], [role="link"], [role="tab"], [role="checkbox"], [role="switch"], [role="radio"]';

/** Native clicks cover mouse, touch and keyboard activation without double playback. */
export function useInteractionSounds(enabled: RefObject<boolean>) {
  const players = useRef<HTMLAudioElement[]>([]);
  const silence = useCallback(() => {
    players.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  useEffect(() => {
    players.current = [1, 2].map((number) => {
      const audio = new Audio(siteUrl(`/assets/audio/bubble-pop-${number}.mp3`));
      audio.preload = 'auto';
      audio.volume = POP_VOLUME;
      return audio;
    });
    let next = 0;
    let pointer: { id: number; x: number; y: number } | null = null;
    let dragged = false;
    const down = (event: PointerEvent) => {
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      dragged = false;
    };
    const move = (event: PointerEvent) => {
      if (
        pointer?.id === event.pointerId &&
        Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 10
      )
        dragged = true;
    };
    const cancel = () => {
      dragged = true;
      pointer = null;
    };
    const click = (event: MouseEvent) => {
      if (
        !event.isTrusted ||
        !enabled.current ||
        document.hidden ||
        (event.detail !== 0 && dragged)
      )
        return;
      const control =
        event.target instanceof Element ? event.target.closest(CONTROL) : null;
      if (
        !control ||
        control.closest('[inert], [aria-disabled="true"]') ||
        control.matches(':disabled')
      )
        return;
      const audio = players.current[next];
      next = (next + 1) % 2;
      // Reuse two voices, replacing the oldest when clicks arrive rapidly.
      audio.pause();
      audio.currentTime = 0;
      void audio.play().catch(() => {
        /* Feedback must never block the control. */
      });
    };
    const hide = () => {
      if (document.hidden) silence();
    };
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointercancel', cancel, true);
    document.addEventListener('click', click, true);
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointercancel', cancel, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('visibilitychange', hide);
      silence();
      players.current.forEach((audio) => {
        audio.removeAttribute('src');
        audio.load();
      });
      players.current = [];
    };
  }, [enabled, silence]);
  return silence;
}
