import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Product, CategoryCardContent } from '../content/site';
import { CategoryCard, ProductCard } from './Cards';
import { Icon } from './Primitives';
type CarouselProps = { id: string; label: string } & (
  | { variant: 'categories'; products: CategoryCardContent[] }
  | { variant: 'products'; products: Product[] }
);
export function Carousel(props: CarouselProps) {
  const { id, products, label } = props;
  const track = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({
    start: true,
    end: false,
    index: 1,
  });
  useEffect(() => {
    const element = track.current!;
    const update = () => {
      const step =
        element.firstElementChild?.getBoundingClientRect().width ?? 1;
      setPosition({
        start: element.scrollLeft < 3,
        end:
          element.scrollLeft >= element.scrollWidth - element.clientWidth - 3,
        index: Math.min(
          products.length,
          Math.round(
            element.scrollLeft /
              (step + parseFloat(getComputedStyle(element).gap)),
          ) + 1,
        ),
      });
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [products.length]);
  function move(direction: number, keyboard = false) {
    const element = track.current!;
    const step =
      (element.firstElementChild?.getBoundingClientRect().width ?? 250) +
      parseFloat(getComputedStyle(element).gap);
    element.scrollBy({
      left: direction * step,
      behavior:
        keyboard || matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
    });
  }
  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      move(e.key === 'ArrowRight' ? 1 : -1, true);
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      track.current?.scrollTo({
        left: e.key === 'Home' ? 0 : track.current.scrollWidth,
        behavior: 'instant',
      });
    }
  }
  if (!products.length)
    return <p className="empty-message">New little pieces are on their way.</p>;
  return (
    <div
      className="carousel"
      data-variant={props.variant}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <ul
        id={id}
        ref={track}
        className="carousel__track"
        data-fade-start={!position.start}
        data-fade-end={!position.end}
        tabIndex={0}
        aria-label={`${label}. Use left and right arrow keys to explore.`}
        onKeyDown={onKeyDown}
      >
        {props.variant === 'categories'
          ? props.products.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          : props.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </ul>
      <div className="carousel__controls">
        <button
          className="circle-button"
          aria-label={`Previous ${label.toLowerCase()}`}
          aria-controls={id}
          disabled={position.start}
          onClick={(e) => move(-1, e.detail === 0)}
        >
          <Icon name="arrow-left" />
        </button>
        <button
          className="circle-button"
          aria-label={`Next ${label.toLowerCase()}`}
          aria-controls={id}
          disabled={position.end}
          onClick={(e) => move(1, e.detail === 0)}
        >
          <Icon name="arrow-right" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Showing item {position.index} of {products.length}
      </span>
    </div>
  );
}
