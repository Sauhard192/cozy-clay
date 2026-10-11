import { siteUrl } from '../utils/paths';
import { getSiteContent } from '../content/site';
import { getImageProps } from '../content/images';
import { Icon, ShapeButton } from './Primitives';

const site = getSiteContent();

export function Creator({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? 'h1' : 'h2';
  return (
    <section
      id="about"
      className="creator-section"
      tabIndex={-1}
      aria-labelledby="creator-title"
    >
      <div className="creator-panel">
        <div className="creator-portrait">
          <img
            {...getImageProps(
              site.maker.image,
              '(min-width: 1024px) 28rem, (min-width: 768px) 24rem, 19rem',
            )}
            decoding="async"
            alt={site.maker.imageAlt}
            width="720"
            height="900"
            loading={standalone ? 'eager' : 'lazy'}
          />
          <span className="bookmark creator-tag">
            Meet The Creator <Icon name="asterisk" />
          </span>
        </div>
        <div className="creator-copy">
          <Heading id="creator-title">
            <span>Hi, I’m</span>
            <br />
            {site.maker.name}.
          </Heading>
          <span className="creator-divider" aria-hidden="true" />
          {site.maker.paragraphs.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <div className="creator-actions">
            <ShapeButton href={siteUrl('/say-hello')}>
              Contact Me
            </ShapeButton>
            <span>OR</span>
            <a
              className="icon-button whatsapp-link"
              href={site.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact CozyClay on WhatsApp"
            >
              <Icon name="whatsapp" />
            </a>
          </div>
        </div>
      </div>
      <img
        className="flower creator-flower creator-flower-left"
        src={siteUrl('/assets/asset/flower-1.svg')}
        alt=""
        aria-hidden="true"
        width="68"
        height="103"
      />
      <img
        className="flower creator-flower creator-flower-right"
        src={siteUrl('/assets/asset/flower-4.svg')}
        alt=""
        aria-hidden="true"
        width="61"
        height="102"
      />
    </section>
  );
}
