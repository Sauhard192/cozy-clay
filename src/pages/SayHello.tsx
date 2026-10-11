import { siteUrl } from '../utils/paths';
import { useEffect, useRef, useState } from 'react';
import { Icon, ShapeButton } from '../components/Primitives';
import { getSiteContent } from '../content/site';

const site = getSiteContent();

function FlowerIllustration() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = container.current!;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={container} className="say-hello__illustration" aria-hidden="true">
      {visible && (
        <img
          src={siteUrl('/assets/asset/flowers-once.svg')}
          width="479"
          height="412"
          alt=""
        />
      )}
    </div>
  );
}

export function SayHello() {
  const instagram = site.contact.socials.find((social) => social.icon === 'instagram')!;
  const otherSocials = site.contact.socials.filter((social) => social.icon !== 'instagram');
  return (
    <section className="say-hello-page" aria-labelledby="say-hello-title">
      <div className="say-hello__hero">
        <div className="say-hello__copy">
          <p className="eyebrow say-hello__eyebrow">
            <span className="say-hello__petal" aria-hidden="true" />
            {site.sayHello.eyebrow}
          </p>
          <h1 id="say-hello-title">
            <span>{site.sayHello.titleFirst}</span>
            <br />
            {site.sayHello.titleSecond}
          </h1>
          <p className="say-hello__description">{site.sayHello.description}</p>
          <div className="say-hello__action">
            <ShapeButton href={instagram.href} newTab className="say-hello__instagram">
              <Icon name="instagram" />
              {site.sayHello.instagramHandle}
            </ShapeButton>
          </div>
        </div>
        <FlowerIllustration />
      </div>
      <div className="say-hello__contacts">
        <span className="say-hello__divider" aria-hidden="true" />
        <nav className="say-hello__links" aria-label="Contact CozyClay">
          <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />WhatsApp
          </a>
          {otherSocials.map((social) => (
            <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer">
              <Icon name={social.icon} />{social.label}
            </a>
          ))}
          <a className="say-hello__email" href={`mailto:${site.contact.email}`}>
            <Icon name="mail" />{site.contact.email}
          </a>
        </nav>
      </div>
      <img className="flower say-hello__flower say-hello__flower-left" src={siteUrl('/assets/asset/flower-1.svg')} width="68" height="103" alt="" />
      <img className="flower say-hello__flower say-hello__flower-right" src={siteUrl('/assets/asset/flower-4.svg')} width="61" height="102" alt="" />
    </section>
  );
}
