import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '../models/product';

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

  it('renders the product title and an accessible button', async () => {
    fixture.componentRef.setInput('product', { ...product, stock: 5, availabilityStatus: 'In Stock' });
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h3')?.textContent).toContain('Volleyball');
    expect(el.querySelector('button')?.getAttribute('aria-label')).toBe('Ajouter Volleyball au panier');
  });

  it('shows "En stock" for In Stock', async () => {
    fixture.componentRef.setInput('product', { ...product, stock: 20, availabilityStatus: 'In Stock' });
    await fixture.whenStable();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent?.trim()).toBe('En stock');
  });

  it('shows "Plus que 4" for Low Stock', async () => {
    fixture.componentRef.setInput('product', { ...product, stock: 4, availabilityStatus: 'Low Stock' });
    await fixture.whenStable();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent?.trim()).toBe('Plus que 4');
  });

  it('shows "Rupture" for Out of Stock', async () => {
    fixture.componentRef.setInput('product', { ...product, stock: 0, availabilityStatus: 'Out of Stock' });
    await fixture.whenStable();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent?.trim()).toBe('Rupture');
  });

  it('renders no button and shows the sold-out message when stock is 0', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('button')).toBeNull();
    expect(el.textContent).toContain('Victime de son succès');
  });

  it('renders the button and no sold-out message when stock is above 0', async () => {
    fixture.componentRef.setInput('product', { ...product, stock: 5, availabilityStatus: 'In Stock' });
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('button')).not.toBeNull();
    expect(el.textContent).not.toContain('Victime de son succès');
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
