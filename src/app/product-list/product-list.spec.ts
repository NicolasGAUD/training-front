import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductList } from './product-list';
import { Cart } from '../cart/cart';
import { dummyJsonListBody, testProducts } from '../testing/products';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let cart: Cart;
  let http: HttpTestingController;

  const el = (): HTMLElement => fixture.nativeElement;
  const listRequest = () => http.expectOne((req) => req.url.startsWith('https://dummyjson.com/products?'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    cart = TestBed.inject(Cart);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductList);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  const loadProducts = async (): Promise<void> => {
    listRequest().flush(dummyJsonListBody());
    await fixture.whenStable();
  };

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    listRequest();
  });

  it('shows a loading status while the request is pending', () => {
    listRequest();
    expect(el().querySelector('[role="status"]')?.textContent).toContain('Chargement');
    expect(el().querySelectorAll('app-product-card').length).toBe(0);
  });

  it('shows an alert when the request fails', async () => {
    listRequest().flush('erreur', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(el().querySelector('[role="alert"]')?.textContent).toContain('Impossible de charger');
    expect(el().querySelectorAll('app-product-card').length).toBe(0);
  });

  it('shows an alert when the response is invalid', async () => {
    listRequest().flush({ products: [{ id: 'x' }] });
    await fixture.whenStable();
    expect(el().querySelector('[role="alert"]')).not.toBeNull();
  });

  it('renders one app-product-card per product', async () => {
    await loadProducts();
    expect(el().querySelectorAll('app-product-card').length).toBe(testProducts.length);
    expect(el().querySelector('[role="status"]')).toBeNull();
  });

  it('gives priority only to the first card image', async () => {
    await loadProducts();
    const images = Array.from(el().querySelectorAll('app-product-card img'));
    expect(images.length).toBeGreaterThan(1);
    images.forEach((img, index) => {
      expect(img.getAttribute('fetchpriority')).toBe(index === 0 ? 'high' : 'auto');
    });
  });

  it('adds the product to the cart when an enabled add button is clicked', async () => {
    await loadProducts();
    const button = el().querySelector<HTMLButtonElement>('app-product-card button:not([disabled])');
    expect(button).not.toBeNull();
    button?.click();

    expect(cart.items()).toEqual(testProducts.filter((p) => p.stock > 0).slice(0, 1));
  });

  it('passes the quantity in the cart to each card', async () => {
    await loadProducts();
    cart.add(testProducts[0]);
    cart.add(testProducts[0]);
    await fixture.whenStable();
    const cards = el().querySelectorAll('app-product-card');
    cards.forEach((card, index) => {
      const expected = index === 0 ? 2 : 0;
      expect(card.textContent).toContain(`Dans ton panier : ${expected}`);
    });
  });

  describe('filters', () => {
    const cardCount = (): number => el().querySelectorAll('app-product-card').length;

    const clickFilter = async (label: string): Promise<void> => {
      const buttons = Array.from(el().querySelectorAll<HTMLButtonElement>('[role="group"] button'));
      const button = buttons.find((b) => b.textContent?.trim() === label);
      expect(button).toBeDefined();
      button?.click();
      await fixture.whenStable();
    };

    beforeEach(async () => {
      await loadProducts();
    });

    it('shows only in-stock products when clicking "Disponibles"', async () => {
      await clickFilter('Disponibles');
      expect(cardCount()).toBe(testProducts.filter((p) => p.stock > 0).length);
    });

    it('shows only products above 1000 when clicking "Plus de 1 000 €"', async () => {
      await clickFilter('Plus de 1 000 €');
      expect(cardCount()).toBe(testProducts.filter((p) => p.price > 1000).length);
    });

    it('renders one li containing an app-product-card per product on initial render', () => {
      const items = el().querySelectorAll('ul > li');
      expect(items.length).toBe(testProducts.length);
      items.forEach((li) => expect(li.querySelector('app-product-card')).not.toBeNull());
    });

    it('does not show the empty message on initial render', () => {
      expect(cardCount()).toBe(testProducts.length);
      expect(el().textContent).not.toContain('Aucun produit à afficher');
    });

    it('shows all products when clicking "Tous" after a filter', async () => {
      await clickFilter('Disponibles');
      await clickFilter('Tous');
      expect(cardCount()).toBe(testProducts.length);
    });
  });
});
