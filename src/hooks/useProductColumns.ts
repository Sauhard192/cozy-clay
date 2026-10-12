import { useSyncExternalStore } from 'react';

// Match the Products grid's shared structural breakpoints, not individual widths.
const tablet = window.matchMedia('(min-width: 768px)');
const desktop = window.matchMedia('(min-width: 1024px)');
const snapshot = () => desktop.matches ? 4 : tablet.matches ? 3 : 2;
const subscribe = (update: () => void) => {
  tablet.addEventListener('change', update);
  desktop.addEventListener('change', update);
  return () => {
    tablet.removeEventListener('change', update);
    desktop.removeEventListener('change', update);
  };
};

export function useProductColumns() {
  return useSyncExternalStore(subscribe, snapshot);
}
