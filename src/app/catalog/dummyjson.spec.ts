import {
  deriveAvailability,
  isDummyJsonProduct,
  isDummyJsonProductList,
  isRecord,
  parseProduct,
  parseProductList,
  toProduct,
} from './dummyjson';
import { dummyJsonListBody, testProducts } from '../testing/products';

describe('dummyjson', () => {
  describe('isRecord', () => {
    it('accepts plain objects only', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord(null)).toBe(false);
      expect(isRecord([])).toBe(false);
      expect(isRecord('x')).toBe(false);
    });
  });

  describe('isDummyJsonProduct', () => {
    it('accepts a valid product', () => {
      expect(isDummyJsonProduct(testProducts[0])).toBe(true);
    });

    it('accepts a product without availabilityStatus', () => {
      const { availabilityStatus: _ignored, ...withoutStatus } = testProducts[0];
      expect(isDummyJsonProduct(withoutStatus)).toBe(true);
    });

    it('rejects a product with a wrong field type', () => {
      expect(isDummyJsonProduct({ ...testProducts[0], price: '9.99' })).toBe(false);
    });

    it('rejects a product with a missing field', () => {
      const { title: _ignored, ...withoutTitle } = testProducts[0];
      expect(isDummyJsonProduct(withoutTitle)).toBe(false);
    });

    it('rejects non-objects', () => {
      expect(isDummyJsonProduct(null)).toBe(false);
      expect(isDummyJsonProduct(42)).toBe(false);
    });
  });

  describe('isDummyJsonProductList', () => {
    it('accepts a valid list', () => {
      expect(isDummyJsonProductList(dummyJsonListBody())).toBe(true);
    });

    it('rejects a list containing an invalid product', () => {
      expect(
        isDummyJsonProductList({ products: [{ id: 1 }], total: 1, skip: 0, limit: 30 }),
      ).toBe(false);
    });

    it('rejects a body without products or pagination', () => {
      expect(isDummyJsonProductList({ total: 0, skip: 0, limit: 30 })).toBe(false);
      expect(isDummyJsonProductList({ products: [] })).toBe(false);
    });
  });

  describe('deriveAvailability', () => {
    it('keeps a known API status', () => {
      expect(deriveAvailability(50, 'Low Stock')).toBe('Low Stock');
    });

    it('derives from stock when the status is missing or unknown', () => {
      expect(deriveAvailability(0)).toBe('Out of Stock');
      expect(deriveAvailability(5)).toBe('Low Stock');
      expect(deriveAvailability(10)).toBe('In Stock');
      expect(deriveAvailability(5, 'Autre')).toBe('Low Stock');
    });
  });

  describe('mapping', () => {
    it('toProduct maps the fields and derives the status', () => {
      const { availabilityStatus: _ignored, ...dto } = testProducts[2];
      expect(toProduct(dto)).toEqual(testProducts[2]);
    });

    it('parseProductList returns the products for a valid body', () => {
      expect(parseProductList(dummyJsonListBody())).toEqual(testProducts);
    });

    it('parseProductList throws for an invalid body', () => {
      expect(() => parseProductList({ products: 'x' })).toThrowError(/invalide/);
    });

    it('parseProduct returns a product for a valid body', () => {
      expect(parseProduct(testProducts[1])).toEqual(testProducts[1]);
    });

    it('parseProduct throws for an invalid body', () => {
      expect(() => parseProduct({ id: 1 })).toThrowError(/invalide/);
    });
  });
});
