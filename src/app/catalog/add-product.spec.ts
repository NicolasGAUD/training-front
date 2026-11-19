import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NewProduct } from '../models/product';
import { isDummyJsonAddedProduct, parseAddedProduct } from './dummyjson';
import { ProductCatalog } from './product-catalog';

const newProduct: NewProduct = {
  title: 'Casque audio',
  price: 59.9,
  stock: 12,
  category: 'tablets',
  description: 'Un casque.',
};

describe('isDummyJsonAddedProduct / parseAddedProduct', () => {
  const valid = { id: 195, ...newProduct };

  it('accepts a valid added-product response', () => {
    expect(isDummyJsonAddedProduct(valid)).toBe(true);
    expect(parseAddedProduct(valid)).toMatchObject({
      id: 195,
      title: 'Casque audio',
      price: 59.9,
      stock: 12,
      availabilityStatus: 'In Stock',
    });
  });

  it('accepts a response without stock or description', () => {
    const minimal = { id: 1, title: 'A', price: 1, category: 'tops' };
    expect(isDummyJsonAddedProduct(minimal)).toBe(true);
    expect(parseAddedProduct(minimal).stock).toBe(0);
  });

  it('rejects invalid responses', () => {
    expect(isDummyJsonAddedProduct(null)).toBe(false);
    expect(isDummyJsonAddedProduct({ ...valid, id: '195' })).toBe(false);
    expect(isDummyJsonAddedProduct({ ...valid, price: 'x' })).toBe(false);
    expect(isDummyJsonAddedProduct({ ...valid, stock: 'x' })).toBe(false);
    expect(() => parseAddedProduct({ title: 'sans id' })).toThrow();
  });
});

describe('ProductCatalog.addProduct', () => {
  let catalog: ProductCatalog;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    catalog = TestBed.inject(ProductCatalog);
  });

  afterEach(() => http.verify());

  it('POSTs the product as JSON and returns the parsed product', async () => {
    const promise = catalog.addProduct(newProduct);
    const req = http.expectOne('https://dummyjson.com/products/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({ id: 195, ...newProduct });

    const product = await promise;
    expect(product.id).toBe(195);
    expect(product.title).toBe('Casque audio');
  });

  it('rejects when the response is invalid', async () => {
    const promise = catalog.addProduct(newProduct);
    http.expectOne('https://dummyjson.com/products/add').flush({ unexpected: true });
    await expect(promise).rejects.toThrow('invalide');
  });

  it('rejects on an HTTP error', async () => {
    const promise = catalog.addProduct(newProduct);
    http
      .expectOne('https://dummyjson.com/products/add')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await expect(promise).rejects.toBeDefined();
  });
});
