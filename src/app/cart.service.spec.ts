import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { testProducts } from './testing/products';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts empty', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('adds products', () => {
    service.add(testProducts[0]);
    service.add(testProducts[0]);
    expect(service.items().length).toBe(2);
  });

  it('clears the cart', () => {
    service.add(testProducts[0]);
    service.clear();
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('computes count and total', () => {
    service.add(testProducts[0]);
    service.add(testProducts[0]);
    service.add(testProducts[1]);
    expect(service.count()).toBe(3);
    expect(service.total()).toBeCloseTo(testProducts[0].price * 2 + testProducts[1].price);
  });

  it('counts the quantity of a given product', () => {
    service.add(testProducts[0]);
    service.add(testProducts[0]);
    service.add(testProducts[1]);
    expect(service.quantityOf(testProducts[0])).toBe(2);
    expect(service.quantityOf(testProducts[1])).toBe(1);
    service.clear();
    expect(service.quantityOf(testProducts[0])).toBe(0);
  });

  it('is a singleton shared through the injector', () => {
    expect(TestBed.inject(CartService)).toBe(service);
  });
});
