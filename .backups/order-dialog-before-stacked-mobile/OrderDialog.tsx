import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Product } from '../content/products';
import { formatPrice } from '../content/products';
import { getImageProps } from '../content/images';
import { getCategoryProducts } from '../content/site';
import { orderMessage, quantityPrice, whatsappUrl } from '../utils/orders';
import { Icon } from './Primitives';

const OrderContext = createContext<(product: Product) => void>(() => {});
export const useProductOrder = () => useContext(OrderContext);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  return (
    <OrderContext.Provider value={setProduct}>
      {children}
      {product && <OrderDialog key={product.id} product={product} onClose={() => setProduct(null)} />}
    </OrderContext.Provider>
  );
}

function OrderDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const category = getCategoryProducts().find(category => category.categoryId === product.categoryId);
  const preparationTime = category?.preparationTime;
  const dialog = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const backdropPress = useRef(false);
  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  function outside(x: number, y: number) {
    const bounds = dialog.current!.getBoundingClientRect();
    return x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom;
  }
  return createPortal(
    <dialog ref={dialog} className="order-dialog" aria-labelledby="order-title" aria-describedby="order-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDown={(event) => { backdropPress.current = outside(event.clientX, event.clientY); }}
      onClick={(event) => { if (backdropPress.current && outside(event.clientX, event.clientY)) onClose(); backdropPress.current = false; }}>
      <button type="button" className="icon-button order-dialog__close" aria-label="Close Order" onClick={onClose} autoFocus><Icon name="close" /></button>
      <div className="order-dialog__surface">
        <div className="order-dialog__scroll">
          <header className="order-dialog__header">
            <h2 id="order-title">Your Order</h2>
            <p id="order-description">Review your order and add a note before continuing to WhatsApp.</p>
          </header>
          <div className="order-dialog__body">
            <div className="order-dialog__product">
              <img className="order-dialog__photo" {...getImageProps(product.image, '6.5rem')} width="128" height="128" alt={product.name} decoding="async" />
              <div className="order-dialog__info">
                <div className="order-dialog__details">
                  <h3>{product.name}</h3>
                  <div className="order-dialog__metadata">
                    <p className="order-dialog__category">
                      <span>{product.categoryName}</span>
                    </p>
                    {preparationTime && <p className="order-dialog__preparation"><Icon name="clock" /><span><span className="sr-only">Preparation time: </span>{preparationTime}</span></p>}
                  </div>
                  <p>{formatPrice(product.price)}</p>
                </div>
                <div className="order-dialog__quantity" role="group" aria-label="Quantity">
                  <button type="button" className="order-dialog__step" aria-label="Decrease Quantity" disabled={quantity === 1} onClick={() => setQuantity(value => value - 1)}><Icon name="minus" /></button>
                  <output aria-live="polite" aria-label="Selected quantity">{quantity}</output>
                  <button type="button" className="order-dialog__step" aria-label="Increase Quantity" disabled={quantity === 99} onClick={() => setQuantity(value => value + 1)}><Icon name="plus" /></button>
                </div>
              </div>
            </div>
            <label className="sr-only" htmlFor="order-note">Customization details, questions, or a note</label>
            <textarea id="order-note" className="order-dialog__note" value={note} onChange={event => setNote(event.target.value)} placeholder="Add customization details, questions, or a note…" maxLength={2000} />
            <p className="order-dialog__total" aria-live="polite">Total: <strong>{formatPrice(quantityPrice(product.price, quantity))}</strong></p>
            {typeof product.price === 'object' && <p className="order-dialog__confirmation">Final price confirmed on WhatsApp.</p>}
          </div>
          <footer className="order-dialog__actions">
            <a className="primary-button order-dialog__send" href={whatsappUrl(orderMessage(product, quantity, note))} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
            <button type="button" className="primary-button primary-button-outline order-dialog__cancel" onClick={onClose}>Cancel</button>
          </footer>
        </div>
      </div>
    </dialog>, document.body,
  );
}
