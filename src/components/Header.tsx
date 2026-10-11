import { navigate } from '../hooks/useNavigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { getSiteContent } from '../content/site';
import type { SitePage } from '../content/site';
import { Brand, Icon } from './Primitives';
const { navigation, announcement } = getSiteContent();
export function Announcement() {
  return (
    <div className="announcement">
      <p>{announcement}</p>
    </div>
  );
}
export function Header({ page = 'home' }: { page?: SitePage }) {
  const homeHref = '/';
  const resolveHref = (href: string) => {
    if (href === '#home') return '/';
    return page !== 'home' && href.startsWith('#') ? `/${href}` : href;
  };
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeAnimation = useRef<gsap.core.Timeline | null>(null);
  const pendingHref = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(page === 'home' ? '#home' : `/${page}`);
  useEffect(() => {
    if (page !== 'home') return;
    const update = () => {
      let current = '#home';
      for (const item of navigation) {
        if (!item.href.startsWith('#')) continue;
        const section = document.querySelector(item.href);
        if (
          section &&
          section.getBoundingClientRect().top <= innerHeight * 0.35
        )
          current = item.href;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [page]);
  useLayoutEffect(() => {
    if (!open) return;
    const node = dialog.current!;
    node.showModal();
    node
      .querySelector<HTMLButtonElement>('[aria-label="Close navigation"]')
      ?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        node.querySelector('.menu-surface'),
        { opacity: 0, y: '-.75rem' },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
      );
      gsap.fromTo(
        node.querySelectorAll('.menu-links a'),
        { opacity: 0, y: '.5rem' },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          duration: 0.28,
          clearProps: 'transform,opacity',
          ease: 'power2.out',
        },
      );
    });
    return () => {
      closeAnimation.current?.kill();
      closeAnimation.current = null;
      const closeIcon = node.querySelector('.menu-close .icon');
      if (closeIcon)
        gsap.set(closeIcon, {
          clearProps: 'transform,opacity,animation,transition',
        });
      mm.revert();
      gsap.set(node.querySelectorAll('.menu-surface, .menu-links a'), {
        clearProps: 'transform,opacity',
      });
      node.close();
      document.body.style.overflow = previous;
      trigger.current?.focus({ preventScroll: true });
      const href = pendingHref.current;
      pendingHref.current = null;
      if (href) navigate(href);
    };
  }, [open]);
  useEffect(() => {
    const query = matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, []);
  function closeMenu(href?: string) {
    if (closeAnimation.current) return;
    pendingHref.current = href ?? null;
    const node = dialog.current;
    if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(false);
      return;
    }
    const surface = node.querySelector('.menu-surface');
    const links = node.querySelectorAll('.menu-links a');
    const icon = node.querySelector('.menu-close .icon');
    gsap.killTweensOf([surface, ...links]);
    const timeline = gsap.timeline({ onComplete: () => setOpen(false) });
    closeAnimation.current = timeline;
    timeline.to(
      surface,
      { opacity: 0, y: '-.5rem', duration: 0.2, ease: 'power2.in' },
      0,
    );
    timeline.to(
      links,
      { opacity: 0, y: '-.5rem', duration: 0.2, ease: 'power2.in' },
      0,
    );
    if (icon) {
      gsap.set(icon, { animation: 'none', transition: 'none' });
      timeline.to(
        icon,
        {
          rotation: -90,
          scale: 0.65,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        0,
      );
    }
  }
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(
      dialog.current!.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled)',
      ),
    );
    const first = controls[0],
      last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function navigateToSection(href: string) {
    closeMenu(href);
  }
  return (
    <>
      <header
        className={`site-header page-header ${page === 'home' || page === 'products' ? 'site-header--overlay' : ''}`}
      >
        <Brand href={homeHref} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={resolveHref(item.href)}
              aria-current={
                active === item.href
                  ? page !== 'home'
                    ? 'page'
                    : 'location'
                  : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          ref={trigger}
          className="icon-button menu-trigger"
          aria-label="Open navigation"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" />
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Main navigation"
        onKeyDown={trapFocus}
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
      >
        <div className="menu-surface" aria-hidden="true" />
        <Announcement />
        <div className="menu-header">
          <Brand
            inverse
            href={homeHref}
            onClick={(e) => {
              e.preventDefault();
              navigateToSection(homeHref);
            }}
          />
          <button
            autoFocus
            className="icon-button menu-close"
            aria-label="Close navigation"
            onClick={() => closeMenu()}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="menu-links" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={resolveHref(item.href)}
              aria-current={
                active === item.href
                  ? page !== 'home'
                    ? 'page'
                    : 'location'
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                navigateToSection(resolveHref(item.href));
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </dialog>
    </>
  );
}
