const base = import.meta.env.BASE_URL;

/** Prefix site-local URLs once; leave external links and fragments untouched. */
export function siteUrl(path: string) {
  if (!path.startsWith('/') || path.startsWith('//') || base === '/') return path;
  const root = base.slice(0, -1);
  if (path === root || path.startsWith(base)) return path;
  return `${root}${path}`;
}

/** Convert deployed URLs back to the route names used by the app. */
export function routePath(pathname: string) {
  const root = base === '/' ? '' : base.slice(0, -1);
  if (root && pathname !== root && !pathname.startsWith(base)) return null;
  return pathname.slice(root.length).replace(/\/$/, '') || '/';
}
