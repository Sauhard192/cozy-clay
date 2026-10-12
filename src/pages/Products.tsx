import { CustomOrderPanel } from '../components/CustomOrderPanel';
import { useProductColumns } from '../hooks/useProductColumns';
import type { CSSProperties } from 'react';
import { RevealImage } from '../components/RevealImage';
import { siteUrl } from '../utils/paths';
import { useEffect, useRef, useState } from 'react';
import { getCategoryProducts, getSiteContent, SHOW_PRODUCTS_HERO } from '../content/site';
import { selectProducts } from '../content/products';
import type { ProductSort } from '../content/products';
import { getImageProps } from '../content/images';
import { navigate } from '../hooks/useNavigation';
import { ProductCard } from '../components/Cards';
import { Icon } from '../components/Primitives';

const hero = getSiteContent().productsHero;
const categories = getCategoryProducts();
const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export function Products({ search }: { search: string }) {
  const parameters = new URLSearchParams(search);
  const categoryValue = parameters.get('category');
  const category = categories.some((item) => item.categoryId === categoryValue) ? categoryValue! : 'all';
  const sort = sortOptions.find((item) => item.value === parameters.get('sort'))?.value ?? 'featured';
  const products = selectProducts(category, sort);
  const columns = useProductColumns();
  const insertion = Math.min(products.length, columns * 2);
  const rowsBefore = Math.ceil(insertion / columns);
  const rowsAfter = Math.ceil((products.length - insertion) / columns);
  // Product rows share equal fractional heights; the full-width panel gets its own natural row.
  const gridStyle = {
    '--products-row-template': [
      rowsBefore ? `repeat(${rowsBefore}, 1fr)` : '',
      'auto',
      rowsAfter ? `repeat(${rowsAfter}, 1fr)` : '',
    ].filter(Boolean).join(' '),
  } as CSSProperties;
  const [sortOpen, setSortOpen] = useState(false);
  const sortControl = useRef<HTMLDivElement>(null);
  const sortTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const outside = (event: PointerEvent) => {
      if (!sortControl.current?.contains(event.target as Node)) setSortOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [sortOpen]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(search);
    if (value === 'all' || value === 'featured') next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    navigate(`/products${query ? `?${query}` : ''}`);
    if (key === 'sort') sortTrigger.current?.focus({ preventScroll: true });
    setSortOpen(false);
  }

  return (
    <div className={`products-page${SHOW_PRODUCTS_HERO ? '' : ' products-page--catalogue-first'}`}>
      {SHOW_PRODUCTS_HERO && (
      <section className="hero-panel products-hero scallop-bottom" aria-labelledby="products-title">
        <div className="products-hero__content">
          <div className="products-hero__copy">
            <p className="eyebrow products-hero__eyebrow"><Icon name="asterisk" />{hero.eyebrow}</p>
            <h1 id="products-title"><span>{hero.titleFirst}</span><br />{hero.titleSecond}</h1>
            <p className="products-hero__description">{hero.description}</p>
          </div>
          <div className="products-hero__photos">
            {['images/hero/products-hero-yomari.png', 'images/hero/products-hero-dumplings.png'].map((image, index) => (
              <RevealImage
                artwork
                className={`products-hero__image products-hero__image--${index + 1}`}
                key={image}
                {...getImageProps(image, '(min-width: 1024px) 18rem, 46vw')}
                alt={index === 0 ? 'A tiny smiling handmade clay yomari' : 'Two smiling clay dumplings on a Cozy Clay card'}
                width="702"
                height="738"
                loading="eager"
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            ))}
          </div>
        </div>
        <img className="flower products-hero__flower products-hero__flower--left" src={siteUrl('/assets/flowers/flower-blue.svg')} width="65" height="102" alt="" />
        <img className="flower products-hero__flower products-hero__flower--right" src={siteUrl('/assets/flowers/flower-yellow.svg')} width="65" height="102" alt="" />
      </section>
      )}

      <section className="products-catalogue" aria-label="Products">
        {!SHOW_PRODUCTS_HERO && <h1 className="products-catalogue__title heading-1">Our Products</h1>}
        <div className="products-toolbar">
          <div className="category-filters" role="group" aria-label="Filter products by category">
            <button className="category-filter" aria-pressed={category === 'all'} onClick={() => update('category', 'all')}>
              <img src={siteUrl('/assets/icons/image-icons/category-all.png')} alt="" width="32" height="32" />All
            </button>
            {categories.map((item) => (
              <button key={item.categoryId} className="category-filter" aria-pressed={category === item.categoryId} onClick={() => update('category', item.categoryId)}>
                <img src={siteUrl(`/assets/icons/image-icons/${item.categoryIcon}`)} alt="" width="32" height="32" />{item.name}
              </button>
            ))}
          </div>
          <div className="products-sort" ref={sortControl} onKeyDown={(event) => {
            if (event.key === 'Escape') { setSortOpen(false); sortTrigger.current?.focus(); }
          }} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setSortOpen(false);
          }}>
            <button ref={sortTrigger} className="products-sort__trigger" aria-expanded={sortOpen} aria-controls="product-sort-options" onClick={() => setSortOpen(!sortOpen)}>
              Sort By: {sortOptions.find((item) => item.value === sort)!.label}<Icon name="sort" />
            </button>
            {sortOpen && (
              <fieldset id="product-sort-options" className="products-sort__options">
                <legend className="sr-only">Sort products</legend>
                {sortOptions.map((item) => (
                  <label key={item.value}>
                    <input type="radio" name="product-sort" value={item.value} checked={sort === item.value} onChange={() => update('sort', item.value)} />
                    <span>{item.label}</span><Icon name="check" className="products-sort__check" />
                  </label>
                ))}
              </fieldset>
            )}
          </div>
        </div>
        <p className="sr-only" role="status">{products.length} products{category !== 'all' ? ` in ${categories.find((item) => item.categoryId === category)?.name}` : ''}</p>
        {!products.length && <p className="empty-message">No pieces in this category yet. Choose another category or All.</p>}
        <ul className="products-grid" style={gridStyle}>
          {products.flatMap((product, index) => [
            <ProductCard key={product.id} product={product} showBadge />,
            ...(index === insertion - 1 ? [<CustomOrderPanel key="custom-order" />] : []),
          ])}
          {!products.length && <CustomOrderPanel />}
        </ul>
      </section>
    </div>
  );
}
