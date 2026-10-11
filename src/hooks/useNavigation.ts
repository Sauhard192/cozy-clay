import { routePath, siteUrl } from '../utils/paths';
import { useEffect, useLayoutEffect, useState } from 'react';

const navigationEvent = 'cozy:navigate';
const routes = new Set(['/', '/about', '/say-hello', '/products']);

export function navigate(href: string) {
  const url = new URL(siteUrl(href), window.location.href);
  if (
    url.origin !== location.origin ||
    !routes.has(routePath(url.pathname) ?? '')
  ) {
    location.assign(href);
    return;
  }
  history.replaceState({ ...history.state, scrollY: window.scrollY }, '');
  const preserveScroll = routePath(url.pathname) === routePath(location.pathname);
  history.pushState({ scrollY: preserveScroll ? window.scrollY : 0, preserveScroll }, '', url);
  window.dispatchEvent(new Event(navigationEvent));
}

export function useNavigation() {
  const [route, setRoute] = useState(() => ({
    href: location.href,
    back: false,
  }));
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const update = () => setRoute({ href: location.href, back: false });
    const back = () => setRoute({ href: location.href, back: true });
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href]',
      );
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href);
      if (
        url.origin !== location.origin ||
        !routes.has(routePath(url.pathname) ?? '')
      )
        return;
      // Preserve native same-page section links and their smooth scrolling.
      if (routePath(url.pathname) === routePath(location.pathname) && url.hash) return;
      event.preventDefault();
      navigate(anchor.href);
    };
    window.addEventListener(navigationEvent, update);
    window.addEventListener('popstate', back);
    document.addEventListener('click', click);
    return () => {
      history.scrollRestoration = previous;
      window.removeEventListener(navigationEvent, update);
      window.removeEventListener('popstate', back);
      document.removeEventListener('click', click);
    };
  }, []);
  useLayoutEffect(() => {
    const url = new URL(route.href);
    let target: HTMLElement | null = null;
    try {
      target = url.hash
        ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
        : null;
    } catch {
      /* Invalid fragment: use page top. */
    }
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({
        top: route.back || history.state?.preserveScroll ? (history.state?.scrollY ?? 0) : 0,
        behavior: 'instant',
      });
      if (!history.state?.preserveScroll) document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [route]);
  return routePath(new URL(route.href).pathname) ?? '/';
}
