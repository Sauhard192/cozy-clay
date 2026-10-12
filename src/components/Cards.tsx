import { RevealImage } from './RevealImage';
import { siteUrl } from '../utils/paths';
import { getImageProps, cardImageSizes } from '../content/images';
import type { CategoryCardContent, Product } from '../content/site';
import { formatPrice } from '../content/products';
import { Icon } from './Primitives';

export function CategoryCard({ category }: { category: CategoryCardContent }) {
  return (
    <li className="collection-card category-card">
      <a className="category-card__link" href={siteUrl(`/products?category=${category.categoryId}`)}>
        <RevealImage
          className="collection-card__image"
          {...getImageProps(category.image, cardImageSizes)}
          alt={category.imageAlt}
          width="300"
          height="300"
          loading="lazy"
          decoding="async"
        />
        <h3 className="category-card__title">
          <img
            className="category-card__icon"
            src={siteUrl(`/assets/icons/image-icons/${category.categoryIcon}`)}
            alt=""
            width="32"
            height="32"
          />
          {category.name}
        </h3>
        <p className="category-card__preparation">
          <Icon name="clock" />
          <span>
            <span className="sr-only">Preparation time: </span>
            {category.preparationTime}
          </span>
        </p>
      </a>
    </li>
  );
}

export function ProductCard({
  product,
  showBadge = false,
}: {
  product: Product;
  showBadge?: boolean;
}) {
  return (
    <li className="collection-card product-card">
      <div className="product-card__photo">
        <RevealImage
          className="collection-card__image"
          {...getImageProps(product.image, showBadge ? '(min-width: 1024px) 20vw, (min-width: 768px) 28vw, 44vw' : cardImageSizes)}
          alt={product.imageAlt}
          width="300"
          height="300"
          loading="lazy"
          decoding="async"
        />
        {showBadge && product.tag && (
          <span className={`product-card__badge product-card__badge--${product.tag}`}>
            {product.tag === 'new' && (
              <img
                className="product-card__badge-shape"
                src={siteUrl('/assets/shapes/tag-new.svg')}
                alt=""
                aria-hidden="true"
                width="48"
                height="24"
              />
            )}
            <span className="product-card__badge-label">
              {product.tag === 'new' ? 'New' : 'Bestseller'}
            </span>
          </span>
        )}
      </div>
      <p className="product-card__category">{product.categoryName}</p>
      <h3>{product.name}</h3>
      <p className="product-card__price">
        {formatPrice(product.price)}
      </p>
    </li>
  );
}
