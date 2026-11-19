import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Cart } from '../cart/cart';
import { testProducts } from '../testing/products';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let cart: Cart;

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();

    cart = TestBed.inject(Cart);
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

  it('clears the cart when the button is clicked', async () => {
    cart.add(testProducts[0]);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')?.click();
    await fixture.whenStable();
    expect(cart.items()).toEqual([]);
    expect(text()).toContain('0 article(s)');
  });
});
