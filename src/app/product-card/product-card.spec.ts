import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '../products';

const product: Product = {
  id: 1,
  title: 'Volleyball',
  price: 11.99,
  thumbnail: 'https://cdn.dummyjson.com/product-images/sports-accessories/volleyball/thumbnail.webp',
  stock: 0,
  availabilityStatus: 'Out of Stock',
};

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the product title and an accessible button', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h3')?.textContent).toContain('Volleyball');
    expect(el.querySelector('button')?.getAttribute('aria-label')).toBe('Ajouter Volleyball au panier');
  });

  it('shows the availability status', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Out of Stock');
  });

  it('disables the button when stock is 0', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('emits addedToCart with the product when the button is clicked', async () => {
    const inStock: Product = { ...product, stock: 5, availabilityStatus: 'In Stock' };
    fixture.componentRef.setInput('product', inStock);
    await fixture.whenStable();

    const emitted: Product[] = [];
    fixture.componentInstance.addedToCart.subscribe((p) => emitted.push(p));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(false);
    button.click();

    expect(emitted).toEqual([inStock]);
  });
});
