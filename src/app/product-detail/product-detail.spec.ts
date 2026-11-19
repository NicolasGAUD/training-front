import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetail } from './product-detail';
import { dummyJsonListBody, testProducts } from '../testing/products';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let http: HttpTestingController;

  const el = (): HTMLElement => fixture.nativeElement;
  const detailRequest = () => http.expectOne('https://dummyjson.com/products/1');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    fixture.detectChanges();
    // ProductCatalog charge aussi la liste à son instanciation : on la sert ici.
    http
      .expectOne((req) => req.url.startsWith('https://dummyjson.com/products?'))
      .flush(dummyJsonListBody());
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
    detailRequest();
  });

  it('shows a loading status while the request is pending', () => {
    detailRequest();
    expect(el().querySelector('[role="status"]')?.textContent).toContain('Chargement');
  });

  it('renders the product once loaded', async () => {
    detailRequest().flush(testProducts[0]);
    await fixture.whenStable();
    expect(el().querySelector('h2')?.textContent).toContain(testProducts[0].title);
    expect(el().textContent).toContain(testProducts[0].description);
    expect(el().querySelector('img')?.getAttribute('alt')).toBe(testProducts[0].title);
  });

  it('shows "Produit introuvable" on a 404', async () => {
    detailRequest().flush({ message: 'not found' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    expect(el().querySelector('h2')?.textContent).toContain('Produit introuvable');
    expect(el().querySelector('[role="alert"]')).toBeNull();
  });

  it('shows an alert on a server error', async () => {
    detailRequest().flush('erreur', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(el().querySelector('[role="alert"]')).not.toBeNull();
  });

  it('shows an alert on an invalid response', async () => {
    detailRequest().flush({ id: 'x' });
    await fixture.whenStable();
    expect(el().querySelector('[role="alert"]')).not.toBeNull();
  });
});
