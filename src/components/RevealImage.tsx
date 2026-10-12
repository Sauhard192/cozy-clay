import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ImgHTMLAttributes } from 'react';

// Remember successful downloads so revisits use a faster reveal, not another shimmer.
const decodedSources = new Set<string>();
type Props = ImgHTMLAttributes<HTMLImageElement> & { artwork?: boolean };

export function RevealImage(props: Props) {
  return <ImageSource key={`${props.src}|${props.srcSet}`} {...props} />;
}

function ImageSource({ className = '', artwork = false, width, height, alt = '', ...props }: Props) {
  const frame = useRef<HTMLSpanElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [inView, setInView] = useState(false);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    const node = frame.current!;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      observer.disconnect();
    }, { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = image.current!;
    let disposed = false;
    const failed = () => { if (!disposed) setStatus('error'); };
    const loaded = async () => {
      if (!node.naturalWidth) return failed();
      const source = node.currentSrc || node.src;
      const wasDecoded = decodedSources.has(source);
      try { await node.decode(); } catch {
        // Some SVGs reject decode despite loading successfully.
        if (!node.naturalWidth) return failed();
      }
      if (disposed) return;
      decodedSources.add(source);
      setCached(wasDecoded);
      setStatus('ready');
    };
    node.addEventListener('load', loaded);
    node.addEventListener('error', failed);
    if (node.complete) void loaded();
    return () => {
      disposed = true;
      node.removeEventListener('load', loaded);
      node.removeEventListener('error', failed);
    };
  }, []);

  const ratio = Number(width) / Number(height);
  const style = Number.isFinite(ratio) && ratio > 0
    ? { '--image-aspect-ratio': String(ratio) } as CSSProperties
    : undefined;
  return (
    <span
      ref={frame}
      className={`image-reveal ${artwork ? 'image-reveal--artwork ' : ''}${className}`}
      style={style}
      data-state={status}
      data-in-view={inView}
      data-visible={inView && status === 'ready'}
      data-cached={cached}
    >
      <img ref={image} {...props} width={width} height={height} alt={status === 'error' ? '' : alt} decoding="async" className="image-reveal__image" />
      {status === 'error' && (
        <span className="image-reveal__fallback" role="img" aria-label={alt ? `${alt} — Image unavailable` : 'Image unavailable'}>
          Image unavailable
        </span>
      )}
    </span>
  );
}
