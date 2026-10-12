import flowerArtwork from '../assets/flowers-interactive.svg?raw';
import { siteUrl } from '../utils/paths';
import { useEffect, useRef, useState } from 'react';
import { Icon, ShapeButton } from '../components/Primitives';
import { getSiteContent } from '../content/site';

const site = getSiteContent();

function FlowerIllustration() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const node = container.current!;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const link = container.current!.querySelector<HTMLAnchorElement>('.say-hello__talk-soon')!;
    const tooltip = link.querySelector<HTMLElement>('.say-hello__tooltip')!;
    let frame = 0;
    let last = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let tracking = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const paint = () => {
      tooltip.style.setProperty('--tooltip-x', `${x}px`);
      tooltip.style.setProperty('--tooltip-y', `${y}px`);
    };
    const tick = (time: number) => {
      const alpha = reduced.matches ? 1 : 1 - Math.exp(-Math.min(time - last, 64) / 80);
      last = time;
      x += (targetX - x) * alpha;
      y += (targetY - y) * alpha;
      const settled = Math.hypot(targetX - x, targetY - y) < .1;
      if (settled) { x = targetX; y = targetY; }
      paint();
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const width = tooltip.offsetWidth, height = tooltip.offsetHeight;
      targetX = event.clientX + 16;
      targetY = event.clientY + 16;
      if (targetX + width > innerWidth - 8) targetX = event.clientX - width - 16;
      if (targetY + height > innerHeight - 8) targetY = event.clientY - height - 16;
      targetX = Math.max(8, Math.min(targetX, innerWidth - width - 8));
      targetY = Math.max(8, Math.min(targetY, innerHeight - height - 8));
      if (!tracking) {
        tracking = true;
        tooltip.dataset.follow = 'true';
        x = targetX; y = targetY;
        paint();
      }
      if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      tracking = false;
      // Keep the last cursor position throughout the exit fade.
    };
    const keyboardPosition = () => {
      stop();
      delete tooltip.dataset.follow;
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Tab') keyboardPosition();
    };
    const focus = () => {
      if (link.matches(':focus-visible')) keyboardPosition();
    };
    link.addEventListener('focus', focus);
    link.addEventListener('pointerenter', move);
    link.addEventListener('pointermove', move);
    link.addEventListener('pointerleave', stop);
    link.addEventListener('pointercancel', stop);
    window.addEventListener('keydown', key);
    window.addEventListener('blur', stop);
    return () => {
      stop();
      delete tooltip.dataset.follow;
      link.removeEventListener('focus', focus);
      link.removeEventListener('pointerenter', move);
      link.removeEventListener('pointermove', move);
      link.removeEventListener('pointerleave', stop);
      link.removeEventListener('pointercancel', stop);
      window.removeEventListener('keydown', key);
      window.removeEventListener('blur', stop);
    };
  }, [visible]);
  return (
    <div ref={container} className="say-hello__illustration">
      {visible && <>
        <div className="say-hello__artwork" aria-hidden="true" dangerouslySetInnerHTML={{ __html: flowerArtwork }} />
        <a className="say-hello__talk-soon" href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer"
          aria-label="Talk Soon — open WhatsApp in a new tab" aria-describedby="talk-soon-tooltip"
          data-dismissed={dismissed} onPointerEnter={() => setDismissed(false)} onFocus={() => setDismissed(false)}
          onKeyDown={(event) => { if (event.key === 'Escape') setDismissed(true); }}>
          <span id="talk-soon-tooltip" role="tooltip" className="say-hello__tooltip">WhatsApp</span>
        </a>
      </>}
    </div>
  );
}

export function SayHello() {
  const instagram = site.contact.socials.find((social) => social.icon === 'instagram')!;
  const otherSocials = site.contact.socials.filter((social) => social.icon !== 'instagram');
  return (
    <section className="say-hello-page" aria-labelledby="say-hello-title">
      <div className="say-hello__hero">
        <div className="say-hello__copy">
          <p className="eyebrow say-hello__eyebrow">
            <span className="say-hello__petal" aria-hidden="true" />
            {site.sayHello.eyebrow}
          </p>
          <h1 id="say-hello-title">
            <span>{site.sayHello.titleFirst}</span>
            <br />
            {site.sayHello.titleSecond}
          </h1>
          <p className="say-hello__description">{site.sayHello.description}</p>
          <div className="say-hello__action">
            <ShapeButton href={instagram.href} newTab className="say-hello__instagram">
              <Icon name="instagram" />
              {site.sayHello.instagramHandle}
            </ShapeButton>
          </div>
        </div>
        <FlowerIllustration />
      </div>
      <div className="say-hello__contacts">
        <span className="say-hello__divider" aria-hidden="true" />
        <nav className="say-hello__links" aria-label="Contact CozyClay">
          <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />WhatsApp
          </a>
          {otherSocials.map((social) => (
            <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer">
              <Icon name={social.icon} />{social.label}
            </a>
          ))}
          <a className="say-hello__email" href={`mailto:${site.contact.email}`}>
            <Icon name="mail" />{site.contact.email}
          </a>
        </nav>
      </div>
      <img className="flower say-hello__flower say-hello__flower-left" src={siteUrl('/assets/asset/flower-1.svg')} width="68" height="103" alt="" />
      <img className="flower say-hello__flower say-hello__flower-right" src={siteUrl('/assets/asset/flower-4.svg')} width="61" height="102" alt="" />
    </section>
  );
}
