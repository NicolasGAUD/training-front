import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { dummyJsonListBody } from './testing/products';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { Cart } from './cart/cart';

describe('App', () => {
  let http: HttpTestingController;

  const flushProducts = (): void => {
    http
      .expectOne((req) => req.url.startsWith('https://dummyjson.com/products?'))
      .flush(dummyJsonListBody());
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

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
    flushProducts();
    expect(harness.routeNativeElement?.querySelector('app-product-list')).not.toBeNull();
    await harness.navigateByUrl('/inconnue');
    expect(harness.routeNativeElement?.querySelector('app-product-list')).toBeNull();
    expect(harness.routeNativeElement?.textContent).toContain("Cette page n'existe pas");
  });

  it('redirects /account to /login when logged out', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/account');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Faccount');
    expect(harness.routeNativeElement?.textContent).toContain('Connexion');
  });

  it('adds a product to the cart then clears it', async () => {
    const fixture = TestBed.createComponent(App);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    flushProducts();
    await fixture.whenStable();
    const cart = TestBed.inject(Cart);
    const el: HTMLElement = harness.routeNativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('app-product-card button:not([disabled])')?.click();
    expect(cart.items().length).toBe(1);
  });
});
