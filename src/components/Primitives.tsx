import { siteUrl } from '../utils/paths';
import { getImageProps } from '../content/images';
import type { CSSProperties, ReactNode, MouseEventHandler } from 'react';
export function Icon({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${className}`}
      style={
        { '--icon-url': `url('${siteUrl(`/assets/icon/${name}.svg`)}')` } as CSSProperties
      }
    />
  );
}
export function Brand({
  inverse = false,
  href = '/',
  onClick,
}: {
  inverse?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      className={`brand ${inverse ? 'brand-inverse' : ''}`}
      href={siteUrl(href)}
      onClick={onClick}
      aria-label="CozyClay home"
    >
      <img
        {...getImageProps('logo.png', '3rem')}
        alt=""
        width="48"
        height="48"
      />
      <span>
        cozyclay<span className="brand-dot">.</span>store
      </span>
    </a>
  );
}
export function ShapeButton({
  children,
  href,
  outline = false,
  newTab = false,
  className = '',
}: {
  children: ReactNode;
  href: string;
  outline?: boolean;
  newTab?: boolean;
  className?: string;
}) {
  return (
    <a
      href={siteUrl(href)}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`primary-button ${outline ? 'primary-button-outline' : ''} ${className}`}
    >
      {children}
    </a>
  );
}
