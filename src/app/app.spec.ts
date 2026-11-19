import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { Cart } from './cart/cart';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Training Shop');
  });

  it('has a single main landmark containing the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('main').length).toBe(1);
    expect(el.querySelector('main router-outlet')).not.toBeNull();
  });

  it('shows the product list on the home route only', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.querySelector('app-product-list')).not.toBeNull();
    await harness.navigateByUrl('/inconnue');
    expect(harness.routeNativeElement?.querySelector('app-product-list')).toBeNull();
    expect(harness.routeNativeElement?.textContent).toContain("Cette page n'existe pas");
  });

  it('adds a product to the cart then clears it', async () => {
    const fixture = TestBed.createComponent(App);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    await fixture.whenStable();
    const cart = TestBed.inject(Cart);
    const el: HTMLElement = harness.routeNativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('app-product-card button:not([disabled])')?.click();
    expect(cart.items().length).toBe(1);
  });
});
