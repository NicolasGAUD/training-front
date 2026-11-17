import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { catalog } from '../products';

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
});
