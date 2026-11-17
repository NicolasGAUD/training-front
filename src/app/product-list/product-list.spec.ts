import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { catalog } from '../catalog';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one app-product-card per product in catalog', () => {
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-product-card');
    expect(cards.length).toBe(catalog.length);
  });

  it('increments the displayed cart count when an enabled add button is clicked', async () => {
    const el: HTMLElement = fixture.nativeElement;
    const counter = el.querySelector('p[aria-live="polite"]');
    expect(counter?.textContent).toContain('Panier : 0 article(s)');

    const button = el.querySelector<HTMLButtonElement>('app-product-card button:not([disabled])');
    expect(button).not.toBeNull();
    button?.click();
    await fixture.whenStable();

    expect(counter?.textContent).toContain('Panier : 1 article(s)');
  });

  describe('filters', () => {
    const cardCount = (): number =>
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-product-card').length;

    const clickFilter = async (label: string): Promise<void> => {
      const buttons = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
          '[role="group"] button',
        ),
      );
      const button = buttons.find((b) => b.textContent?.trim() === label);
      expect(button).toBeDefined();
      button?.click();
      await fixture.whenStable();
    };

    it('shows only in-stock products when clicking "Disponibles"', async () => {
      await clickFilter('Disponibles');
      expect(cardCount()).toBe(catalog.filter((p) => p.stock > 0).length);
    });

    it('shows only products above 1000 when clicking "Plus de 1 000 €"', async () => {
      await clickFilter('Plus de 1 000 €');
      expect(cardCount()).toBe(catalog.filter((p) => p.price > 1000).length);
    });

    const emptyMessage = (): HTMLElement | null =>
      Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('ul > li')).find(
        (li) => li.textContent?.trim() === 'Aucun produit à afficher',
      ) ?? null;

    it('renders one li containing an app-product-card per product on initial render', () => {
      const items = (fixture.nativeElement as HTMLElement).querySelectorAll('ul > li');
      expect(items.length).toBe(catalog.length);
      items.forEach((li) => expect(li.querySelector('app-product-card')).not.toBeNull());
    });

    it('does not show the empty message on initial render', () => {
      expect(cardCount()).toBe(catalog.length);
      expect(emptyMessage()).toBeNull();
      expect(fixture.nativeElement.textContent).not.toContain('Aucun produit à afficher');
    });

    it('shows the empty message only when the "Plus de 1 000 €" filter matches nothing', async () => {
      await clickFilter('Plus de 1 000 €');
      const expected = catalog.filter((p) => p.price > 1000).length;
      expect(cardCount()).toBe(expected);
      if (expected === 0) {
        expect(emptyMessage()?.textContent?.trim()).toBe('Aucun produit à afficher');
      } else {
        expect(emptyMessage()).toBeNull();
      }
    });

    it('shows all products when clicking "Tous" after a filter', async () => {
      await clickFilter('Disponibles');
      await clickFilter('Tous');
      expect(cardCount()).toBe(catalog.length);
    });
  });
});
