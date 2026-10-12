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
          <div className="custom-order-panel__copy">
            <h2 id="custom-order-title">{content.titleFirst}{' '}{content.titleSecond}</h2>
            <p>{content.description}</p>
            <button type="button" className="custom-order-panel__button" disabled>{content.buttonLabel}</button>
          </div>
          <span className="custom-order-panel__petal custom-order-panel__petal--small" aria-hidden="true" />
          <span className="custom-order-panel__petal custom-order-panel__petal--large" aria-hidden="true" />
          <div className="custom-order-panel__photos" aria-hidden="true">
            {['products-hero-yomari.png', 'products-hero-dumplings.png'].map((image, index) => (
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
        <img className="custom-order-panel__flower custom-order-panel__flower--left" src={siteUrl('/assets/asset/flower-3.svg')} width="65" height="102" alt="" aria-hidden="true" />
        <img className="custom-order-panel__flower custom-order-panel__flower--right" src={siteUrl('/assets/asset/flower-2.svg')} width="65" height="102" alt="" aria-hidden="true" />
      </section>
    </li>
  );
}
