import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Cart } from '../cart/cart';
import { testProducts } from '../testing/products';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { Auth } from '../auth/auth';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let cart: Cart;
  let auth: Auth;

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter(routes)],
    }).compileComponents();

    cart = TestBed.inject(Cart);
    auth = TestBed.inject(Auth);
    fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('displays the cart count and total', async () => {
    expect(text()).toContain('0 article(s)');
    cart.add(testProducts[0]);
    cart.add(testProducts[0]);
    await fixture.whenStable();
    expect(text()).toContain('2 article(s)');
    expect(text()).toContain(`${(testProducts[0].price * 2).toFixed(2)} €`);
  });

  it('has an accessible main navigation with login link when logged out', () => {
    const el = fixture.nativeElement as HTMLElement;
    const nav = el.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Navigation principale');
    expect(nav?.textContent).toContain('Accueil');
    expect(nav?.textContent).toContain('Mon compte');
    expect(nav?.textContent).toContain('Se connecter');
  });

  it('hides the login link when logged in', async () => {
    auth.login('Alice');
    await fixture.whenStable();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
    expect(nav?.textContent).not.toContain('Se connecter');
    expect(nav?.textContent).toContain('Mon compte');
  });

  it('clears the cart when the button is clicked', async () => {
    cart.add(testProducts[0]);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')?.click();
    await fixture.whenStable();
    expect(cart.items()).toEqual([]);
    expect(text()).toContain('0 article(s)');
  });
});
