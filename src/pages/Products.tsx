import { useEffect, useRef, useState } from 'react';
import { getCategoryProducts, getSiteContent } from '../content/site';
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
    <div className="products-page">
      <section className="hero-panel products-hero scallop-bottom" aria-labelledby="products-title">
        <div className="products-hero__content">
          <div className="products-hero__copy">
            <p className="eyebrow products-hero__eyebrow"><Icon name="asterisk" />{hero.eyebrow}</p>
            <h1 id="products-title"><span>{hero.titleFirst}</span><br />{hero.titleSecond}</h1>
            <p className="products-hero__description">{hero.description}</p>
          </div>
          <div className="products-hero__photos">
            {['clay-charm.webp', 'dumpling-pair.webp'].map((image, index) => (
              <div className={`products-hero__frame products-hero__frame--${index + 1}`} key={image}>
                <div className="products-hero__photo">
                  <img {...getImageProps(image, '(min-width: 1024px) 18rem, 46vw')} alt={index === 0 ? 'A tiny smiling handmade clay yomari' : 'Two smiling clay dumplings on a Cozy Clay card'} width="400" height="400" loading="eager" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <img className="flower products-hero__flower products-hero__flower--left" src="/assets/asset/flower-3.svg" width="65" height="102" alt="" />
        <img className="flower products-hero__flower products-hero__flower--right" src="/assets/asset/flower-2.svg" width="65" height="102" alt="" />
      </section>

      <section className="products-catalogue" aria-label="Products">
        <div className="products-toolbar">
          <div className="category-filters" role="group" aria-label="Filter products by category">
            <button className="category-filter" aria-pressed={category === 'all'} onClick={() => update('category', 'all')}>
              <img src="/assets/icon/image-icons/category-all.png" alt="" width="32" height="32" />All
            </button>
            {categories.map((item) => (
              <button key={item.categoryId} className="category-filter" aria-pressed={category === item.categoryId} onClick={() => update('category', item.categoryId)}>
                <img src={`/assets/icon/image-icons/${item.categoryIcon}`} alt="" width="32" height="32" />{item.name}
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
                    <span>{item.label}</span><span className="products-sort__check" aria-hidden="true">✓</span>
                  </label>
                ))}
              </fieldset>
            )}
          </div>
        </div>
        <p className="sr-only" role="status">{products.length} products{category !== 'all' ? ` in ${categories.find((item) => item.categoryId === category)?.name}` : ''}</p>
        {products.length ? (
          <ul className="products-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} showBadge />)}
          </ul>
        ) : <p className="empty-message">No pieces in this category yet. Choose another category or All.</p>}
      </section>
    </div>
  );
}
