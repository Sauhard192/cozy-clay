import { OrderProvider } from './components/OrderDialog';
import { HeroCollage } from './components/HeroCollage';
import { siteUrl } from './utils/paths';
import { SHOW_PRODUCTS_HERO } from './content/site';
import { useNavigation } from './hooks/useNavigation';
import { useEffect } from 'react';
import { Creator } from './components/Creator';
import { Products } from './pages/Products';
import { About } from './pages/About';
import { SayHello } from './pages/SayHello';
import type { SitePage } from './content/site';
import { CustomCursor } from './components/CustomCursor';
import { PanelPatterns } from './components/PanelPatterns';
import { getImageProps } from './content/images';
import { StickyHeader } from './components/StickyHeader';
import { Carousel } from './components/Carousel';
import { Icon, ShapeButton } from './components/Primitives';
import { Motion } from './components/Motion';
import MusicToggle from './components/MusicToggle';
import {
  getCategoryProducts,
  getFeaturedProducts,
  getSiteContent,
} from './content/site';
const site = getSiteContent();
function Hero() {
  return (
    <section
      id="home"
      className="hero-panel scallop-bottom"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <Icon name="asterisk" />
            {site.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            <span>{site.hero.titleFirst}</span>
            <br />
            {site.hero.titleSecond}
          </h1>
          <p className="hero-description">{site.hero.description}</p>
          <div className="hero-action">
            <ShapeButton href={siteUrl('/products')}>View All Products</ShapeButton>
          </div>
        </div>
        <HeroCollage />
      </div>
    </section>
  );
}
function Collections() {
  return (
    <>
      <section
        id="shelf"
        className="categories-section"
        tabIndex={-1}
        aria-labelledby="categories-title"
      >
        <img
          className="flower flower-sun"
          src={siteUrl('/assets/flowers/flower-yellow.svg')}
          alt=""
          width="192"
          height="192"
        />
        <div className="section-heading">
          <p className="eyebrow">Types of Products</p>
          <h2 id="categories-title">Categories</h2>
        </div>
        <Carousel
          variant="categories"
          id="category-products"
          products={getCategoryProducts()}
          label="Categories"
        />
        <img
          className="flower flower-purple"
          src={siteUrl('/assets/flowers/flower-purple.svg')}
          alt=""
          width="192"
          height="192"
        />
      </section>

      <section
        className="featured-panel scallop-both"
        aria-labelledby="featured-title"
      >
        <div className="section-heading featured-heading">
          <div className="featured-title">
            <p className="eyebrow">Choose Your Favorite</p>
            <h2 id="featured-title">Popular around here</h2>
          </div>
          <a className="secondary-button" href={siteUrl('/products')}>
            See All Pieces <Icon name="arrow-right" />
          </a>
        </div>
        <Carousel
          variant="products"
          id="featured-products"
          products={getFeaturedProducts()}
          label="Featured products"
        />
      </section>
    </>
  );
}
function Footer() {
  return (
    <footer id="contact" className="footer-panel scallop-top" tabIndex={-1}>
      <div className="footer-upper">
        <div>
          <a href={siteUrl('/')} className="footer-wordmark" aria-label="CozyClay home">
            cozyclay<span>.</span>
          </a>
          <p className="footer-tagline">
            Custom Orders.
            <br />
            Surprise your loved ones.
          </p>
        </div>
        <div className="footer-note">
          <p>
            From my desk to yours,
            <br />
            or for someone you love.
          </p>
          <img
            {...getImageProps('images/brand/logo.png', '4.5rem')}
            width="72"
            height="72"
            alt="Cozy Clay"
          />
        </div>
      </div>
      <span className="footer-divider" aria-hidden="true" />
      <div className="footer-lower">
        <small className="copyright">{site.copyright}</small>
        <nav className="social-links" aria-label="Social media">
          {site.contact.socials.map((s) => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={s.icon} />
              {s.label}
            </a>
          ))}
          <a className="email-link" href={`mailto:${site.contact.email}`}>
            <Icon name="mail" />
            {site.contact.email}
          </a>
        </nav>
        <span className="made-in">
          Made in Nepal{' '}
          <img
            {...getImageProps('images/brand/nepal-flag.png', '1.5rem')}
            alt="Nepal flag"
            width="24"
            height="24"
          />
        </span>
      </div>
    </footer>
  );
}
export default function App() {
  const path = useNavigation().replace(/\/$/, '');
  const page: SitePage =
    path === '/products'
      ? 'products'
      : path === '/about'
        ? 'about'
        : path === '/say-hello'
          ? 'say-hello'
          : 'home';
  useEffect(() => {
    document.body.dataset.page = page;
    document.title =
      page === 'home'
        ? 'CozyClay — Handmade from Bhaktapur'
        : page === 'products'
          ? 'The Shelf — CozyClay'
          : page === 'about'
            ? 'About Me — CozyClay'
            : 'Say Hello — CozyClay';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        page === 'home'
          ? 'Little clay pieces, made with care in Bhaktapur. Explore CozyClay’s handmade pieces.'
          : page === 'products'
            ? 'Explore the complete collection of CozyClay handmade pieces.'
            : page === 'about'
              ? 'Meet Apekshya, the maker behind CozyClay’s handmade clay pieces.'
              : 'Have an idea or a question? Say hello to CozyClay on Instagram, WhatsApp or email.',
      );
  }, [page]);
  return (
    <OrderProvider>
      <StickyHeader key={`header-${page}`} page={page} />
      <div
        className={`page-frame ${page === 'home' || (page === 'products' && SHOW_PRODUCTS_HERO) ? 'page-frame--hero' : ''}`}
      >
        <main key={`content-${page}`} id="main" className="page-content" tabIndex={-1}>
          {page === 'products' ? (
            <Products search={window.location.search} />
          ) : page === 'about' ? (
            <About />
          ) : page === 'say-hello' ? (
            <SayHello />
          ) : (
            <>
              <Hero />
              <Collections />
              <Creator />
            </>
          )}
        </main>
        <Footer />
      </div>
      <CustomCursor />
      <PanelPatterns key={`patterns-${page}`} />
      <Motion key={`motion-${page}`} />
      <MusicToggle />
    </OrderProvider>
  );
}
