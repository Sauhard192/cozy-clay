import { useLayoutEffect } from 'react';

/** Fit whole semicircles to each panel while keeping width twice the depth. */
export function PanelPatterns() {
  useLayoutEffect(() => {
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.page-header, .scallop-bottom, .scallop-top, .scallop-both, .announcement',
      ),
    );
    const fit = (panel: HTMLElement, width: number) => {
      if (!width) return;
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const announcement = panel.classList.contains('announcement');
      const count = announcement
        ? Math.max(1, Math.round(width / rem))
        : parseInt(
            getComputedStyle(panel).getPropertyValue('--scallop-count'),
            10,
          );
      const diameter = width / count;
      const prefix = announcement ? '--announcement-scallop' : '--scallop';
      panel.style.setProperty(`${prefix}-width`, `${diameter / rem}rem`);
      panel.style.setProperty(`${prefix}-depth`, `${diameter / (2 * rem)}rem`);
      if (!announcement)
        panel.style.setProperty(
          '--pattern-grid-size',
          `${diameter / (2 * rem)}rem`,
        );
    };
    const aboutHeader = document.querySelector('.about-page')
      ? document.querySelector<HTMLElement>('.page-header')
      : null;
    const measureAboutGrid = () => {
      if (!aboutHeader) return;
      const bounds = aboutHeader.getBoundingClientRect();
      const shell = aboutHeader.closest<HTMLElement>('.sticky-header');
      const sticky = shell?.dataset.sticky === 'true';
      const gridTop = sticky
        ? bounds.top - (shell?.getBoundingClientRect().top ?? 0)
        : bounds.top + window.scrollY;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const body = document.body;
      body.style.setProperty('--about-grid-size', getComputedStyle(aboutHeader).getPropertyValue('--pattern-grid-size'));
      body.style.setProperty('--about-grid-x', `${bounds.left / rem}rem`);
      // Match document coordinates normally, or the resting viewport position when sticky.
      body.style.setProperty('--about-grid-y', `${gridTop / rem}rem`);
      body.style.setProperty('--about-grid-attachment', sticky ? 'fixed' : 'scroll');
    };
    const homeFrame = document.querySelector<HTMLElement>('.page-frame--hero');
    const overlayHeader = document.querySelector<HTMLElement>('.site-header--overlay');
    const measureHeader = () => {
      if (!homeFrame || !overlayHeader) return;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      homeFrame.style.setProperty(
        '--home-header-height',
        `${overlayHeader.getBoundingClientRect().height / rem}rem`,
      );
    };
    const hero = document.querySelector<HTMLElement>('.hero-panel');
    const categories = document.querySelector<HTMLElement>(
      '.categories-section',
    );
    const measureArtwork = () => {
      if (!hero || !categories) return;
      if (matchMedia('(min-width: 1024px)').matches) {
        categories.style.removeProperty('--hero-artwork-overhang');
        return;
      }
      const bounds = hero.getBoundingClientRect();
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const depth =
        bounds.width /
        parseInt(
          getComputedStyle(hero).getPropertyValue('--scallop-count'),
          10,
        ) /
        2;
      const bottoms = Array.from(
        hero.querySelectorAll('.photo-card, .petal-note'),
      ).map((element) => {
        // Static frame bounds stay independent of entrance and pointer movement.
        const tagClearance = element.querySelector('.handmade') ? rem * 2 : 0;
        return element.getBoundingClientRect().bottom + tagClearance;
      });
      const overhang = Math.max(
        depth,
        ...bottoms.map((bottom) => bottom - bounds.bottom),
      );
      categories.style.setProperty(
        '--hero-artwork-overhang',
        `${overhang / rem}rem`,
      );
    };
    const update = () => {
      panels.forEach((panel) =>
        fit(panel, panel.getBoundingClientRect().width),
      );
      measureHeader();
      measureAboutGrid();
      measureArtwork();
    };
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const panel = entry.target as HTMLElement;
        fit(panel, panel.getBoundingClientRect().width);
      });
      measureHeader();
      measureAboutGrid();
      measureArtwork();
    });
    panels.forEach((panel) => observer.observe(panel));
    update();
    window.addEventListener('resize', update);
    hero?.addEventListener('load', measureArtwork, true);
    return () => {
      observer.disconnect();
      if (aboutHeader) {
        ['--about-grid-size', '--about-grid-x', '--about-grid-y', '--about-grid-attachment'].forEach((property) =>
          document.body.style.removeProperty(property),
        );
      }
      homeFrame?.style.removeProperty('--home-header-height');
      window.removeEventListener('resize', update);
      hero?.removeEventListener('load', measureArtwork, true);
    };
  }, []);
  return null;
}
