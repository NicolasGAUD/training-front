import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Training Shop');
  });

  it('renders the product list inside main', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('main app-product-list')).not.toBeNull();
  });

  it('adds a product to the cart then clears it', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const counter = el.querySelector('app-header p[aria-live="polite"]');
    expect(counter?.textContent).toContain('Panier : 0 article(s)');

    el.querySelector<HTMLButtonElement>('app-product-card button:not([disabled])')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.cart.length).toBe(1);
    expect(counter?.textContent).toContain('Panier : 1 article(s)');

    el.querySelector<HTMLButtonElement>('app-header button')?.click();
    await fixture.whenStable();
    expect(counter?.textContent).toContain('Panier : 0 article(s)');
  });
});
