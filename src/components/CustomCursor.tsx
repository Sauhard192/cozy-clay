import { siteUrl } from '../utils/paths';
import { useEffect } from 'react';

const interactive =
  'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

export function CustomCursor() {
  useEffect(() => {
    const mouse = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML =
      '<span class="custom-cursor__rotation"><span class="custom-cursor__shape custom-cursor__shape--four"></span><span class="custom-cursor__shape custom-cursor__shape--eight"></span></span>';
    document.body.append(cursor);
    let ready = false;
    let disposed = false;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;

    const hide = () => {
      visible = false;
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      cursor.classList.remove('is-visible');
      document.documentElement.classList.remove('has-custom-cursor');
    };
    const paint = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const follow = (time: number) => {
      frame = 0;
      if (!visible) return;
      const style = getComputedStyle(cursor);
      const response = parseFloat(style.getPropertyValue('--cursor-follow-time')) || 55;
      const delta = lastTime ? Math.min(time - lastTime, 32) : 16;
      const blend = 1 - Math.exp(-delta / response);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      lastTime = time;
      if (Math.hypot(targetX - x, targetY - y) < .1) {
        x = targetX;
        y = targetY;
        lastTime = 0;
      } else {
        frame = requestAnimationFrame(follow);
      }
      paint();
    };
    const snap = () => {
      if (!visible) return;
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      x = targetX;
      y = targetY;
      paint();
    };
    const footer = document.querySelector<HTMLElement>('.footer-panel');
    const isOverFooterScallop = () => {
      if (!footer) return false;
      const bounds = footer.getBoundingClientRect();
      if (
        targetX < bounds.left ||
        targetX > bounds.right ||
        targetY >= bounds.top
      )
        return false;
      const edge = getComputedStyle(footer, '::before');
      const depth = parseFloat(edge.height);
      const count = parseInt(
        getComputedStyle(footer).getPropertyValue('--scallop-count'),
        10,
      );
      const width = bounds.width / count;
      const overlap = bounds.height - parseFloat(edge.bottom);
      const centerY = bounds.top + overlap;
      if (!(depth > 0 && width > 0) || targetY < centerY - depth) return false;
      const dx = (((targetX - bounds.left) % width) - width / 2) / (width / 2);
      const dy = (targetY - centerY) / depth;
      return dx * dx + dy * dy <= 1;
    };
    const updateHover = () => {
      const target = document.elementFromPoint(targetX, targetY);
      const control = target?.closest(interactive);
      const orderDialog = document.querySelector('dialog.order-dialog[open]');
      cursor.classList.toggle(
        'is-order-contrast',
        Boolean(orderDialog && (
          target?.closest('.order-dialog__close') ||
          !target?.closest('.order-dialog__surface')
        )),
      );
      cursor.classList.toggle(
        'is-on-dark',
        Boolean(target?.closest('.footer-panel, .mobile-menu')) ||
          (!document.querySelector('dialog[open]') && isOverFooterScallop()),
      );
      cursor.classList.toggle(
        'is-interactive',
        Boolean(
          control &&
            !control.matches(':disabled, [aria-disabled="true"]') &&
            !control.closest('[inert]'),
        ),
      );
    };
    const move = (event: PointerEvent) => {
      if (!ready || !mouse.matches || event.pointerType !== 'mouse') {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      updateHover();
      if (!visible) {
        x = targetX;
        y = targetY;
        paint();
        visible = true;
        cursor.classList.add('is-visible');
        document.documentElement.classList.add('has-custom-cursor');
      }
      if (reduced.matches) snap();
      else if (!frame) frame = requestAnimationFrame(follow);
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Tab') hide();
    };
    const visibility = () => {
      if (document.hidden) hide();
    };
    const scroll = () => {
      if (visible) updateHover();
    };
    // A modal dialog lives above ordinary z-index layers; keep the cursor in its layer.
    const syncLayer = () => {
      const dialogs = document.querySelectorAll('dialog[open]');
      const host = dialogs[dialogs.length - 1] ?? document.body;
      if (cursor.parentElement !== host) host.append(cursor);
      if (visible) updateHover();
    };
    const observer = new MutationObserver(syncLayer);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['open'],
    });
    syncLayer();
    Promise.all(
      ['shape-4-petal.svg', 'shape-8-petal.svg'].map((name) => {
        const image = new Image();
        image.src = siteUrl(`/assets/shapes/${name}`);
        return image.decode();
      }),
    )
      .then(() => {
        if (!disposed) ready = true;
      })
      .catch(() => {
        /* Keep the native cursor if an asset fails. */
      });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('pointerdown', snap, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', key);
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('scroll', scroll, true);
    mouse.addEventListener('change', hide);
    reduced.addEventListener('change', hide);
    return () => {
      disposed = true;
      hide();
      observer.disconnect();
      cursor.remove();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('pointerdown', snap);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('scroll', scroll, true);
      mouse.removeEventListener('change', hide);
      reduced.removeEventListener('change', hide);
    };
  }, []);
  return null;
}
