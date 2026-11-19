import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, Injector, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductCatalog } from './product-catalog';
import { dummyJsonListBody, testProducts } from '../testing/products';

describe('ProductCatalog', () => {
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

  const isListRequest = (r: { url: string }): boolean =>
    r.url.startsWith('https://dummyjson.com/products?');

  it('does not request the list when the service is only injected', () => {
    TestBed.tick();
    http.expectNone(isListRequest);
    expect(catalog.products.isLoading()).toBe(false);
    expect(catalog.products.value()).toBeUndefined();
  });

  it('requests the list once, even if loadProducts() is called twice', () => {
    catalog.loadProducts();
    TestBed.tick();
    catalog.loadProducts();
    TestBed.tick();
    http.expectOne(isListRequest);
  });

  it('loads the product list from DummyJSON', async () => {
    catalog.loadProducts();
    TestBed.tick();
    const req = http.expectOne((r) => r.url.startsWith('https://dummyjson.com/products?'));
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toContain('limit=30');
    expect(req.request.url).toContain('select=');
    expect(catalog.products.isLoading()).toBe(true);

    req.flush(dummyJsonListBody());
    await TestBed.inject(ApplicationRef).whenStable();

    expect(catalog.products.value()).toEqual(testProducts);
  });

  it('exposes an error when the list response is invalid', async () => {
    catalog.loadProducts();
    TestBed.tick();
    http
      .expectOne((r) => r.url.startsWith('https://dummyjson.com/products?'))
      .flush({ products: 'nope' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(catalog.products.error()).toBeDefined();
  });

  it('loads one product by id', async () => {
    const id = signal<string | undefined>('15');
    const resource = runInInjectionContext(TestBed.inject(Injector), () =>
      catalog.productById(() => id()),
    );
    TestBed.tick();
    http.expectNone(isListRequest);
    http.expectOne('https://dummyjson.com/products/15').flush(testProducts[1]);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(resource.value()).toEqual(testProducts[1]);
  });

  it('does not request anything while the id is undefined', async () => {
    const resource = runInInjectionContext(TestBed.inject(Injector), () =>
      catalog.productById(() => undefined),
    );
    TestBed.tick();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(resource.value()).toBeUndefined();
    http.expectNone(isListRequest);
    http.expectNone((r) => /\/products\/[^?]/.test(r.url));
  });

  it('reports a 404 as an HttpErrorResponse', async () => {
    const resource = runInInjectionContext(TestBed.inject(Injector), () =>
      catalog.productById(() => '9999'),
    );
    TestBed.tick();
    http
      .expectOne('https://dummyjson.com/products/9999')
      .flush({ message: 'nf' }, { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    const error = resource.error();
    expect(error instanceof HttpErrorResponse && error.status === 404).toBe(true);
  });
});
