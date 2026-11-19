import { TestBed } from '@angular/core/testing';
import { Cart } from './cart';
import { testProducts } from '../testing/products';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = TestBed.inject(Cart);
  });

  it('starts empty', () => {
    expect(cart.items()).toEqual([]);
  });

  it('adds products', () => {
    cart.add(testProducts[0]);
    cart.add(testProducts[0]);
    expect(cart.items().length).toBe(2);
  });

  it('clears the cart', () => {
    cart.add(testProducts[0]);
    cart.clear();
    expect(cart.items()).toEqual([]);
  });
});
