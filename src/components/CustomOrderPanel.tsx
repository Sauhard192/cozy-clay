import { customOrderMessage, whatsappUrl } from '../utils/orders';
import { siteUrl } from '../utils/paths';
import { getSiteContent } from '../content/site';
import { getImageProps } from '../content/images';
import { RevealImage } from './RevealImage';

const content = getSiteContent().customOrder;

export function CustomOrderPanel() {
  return (
    <li className="custom-order-slot">
      <section className="custom-order-panel" aria-labelledby="custom-order-title">
        <div className="custom-order-panel__surface">
          <a
            className="custom-order-panel__mobile-link"
            href={whatsappUrl(customOrderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="custom-order-panel__copy">
            <h2 id="custom-order-title">{content.titleFirst}{' '}{content.titleSecond}</h2>
            <p>{content.description}</p>
            <a className="custom-order-panel__button" href={whatsappUrl(customOrderMessage)} target="_blank" rel="noopener noreferrer">{content.buttonLabel}</a>
          </div>
          <span className="custom-order-panel__petal custom-order-panel__petal--small" aria-hidden="true" />
          <span className="custom-order-panel__petal custom-order-panel__petal--large" aria-hidden="true" />
          <div className="custom-order-panel__photos" aria-hidden="true">
            {['images/hero/products-hero-yomari.png', 'images/hero/products-hero-dumplings.png'].map((image, index) => (
              <RevealImage
                key={image}
                className={`custom-order-panel__photo custom-order-panel__photo--${index + 1}`}
                artwork
                {...getImageProps(image, '(min-width: 1024px) 9rem, 7rem')}
                width="702"
                height="738"
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <img className="custom-order-panel__flower custom-order-panel__flower--left" src={siteUrl('/assets/flowers/flower-blue.svg')} width="65" height="102" alt="" aria-hidden="true" />
        <img className="custom-order-panel__flower custom-order-panel__flower--right" src={siteUrl('/assets/flowers/flower-yellow.svg')} width="65" height="102" alt="" aria-hidden="true" />
      </section>
    </li>
  );
}
