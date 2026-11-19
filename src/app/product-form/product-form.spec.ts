import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Auth } from '../auth/auth';
import { routes } from '../app.routes';
import { ProductForm } from './product-form';

const ADD_URL = 'https://dummyjson.com/products/add';

describe('ProductForm', () => {
  let http: HttpTestingController;
  let el: HTMLElement;
  let harness: RouterTestingHarness;

  const setup = async (): Promise<void> => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    TestBed.inject(Auth).login('Alice');
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/new');
    el = harness.routeNativeElement as HTMLElement;
    TestBed.tick();
  };

  const field = <T extends HTMLElement>(id: string): T => el.querySelector<T>(`#${id}`) as T;

  const fill = (id: string, value: string): void => {
    const control = field<HTMLInputElement>(id);
    control.value = value;
    control.dispatchEvent(new Event('input'));
  };

  const fillValid = (): void => {
    fill('product-title', 'Casque audio');
    fill('product-price', '59.90');
    fill('product-stock', '12');
    fill('product-category', 'tablets');
    fill('product-description', 'Un casque.');
  };

  const submit = async (): Promise<void> => {
    el.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await harness.fixture.whenStable();
  };

  // Laisse la promesse d'envoi se résoudre, puis attend le rendu.
  const settle = async (): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve));
    await harness.fixture.whenStable();
  };

  const errorText =(id: string): string | null =>
    el.querySelector(`#${id}-error`)?.textContent?.trim() ?? null;

  afterEach(() => http.verify());

  it('does not download the product list', async () => {
    await setup();
    http.expectNone((r) => r.url.includes('/products?limit'));
  });

  it('has a label, aria-required and a category select for each field', async () => {
    await setup();
    for (const id of ['title', 'price', 'stock', 'category', 'description']) {
      const control = field(`product-${id}`);
      expect(control).not.toBeNull();
      expect(el.querySelector(`label[for="product-${id}"]`)).not.toBeNull();
      if (id !== 'description') {
        expect(control.getAttribute('aria-required')).toBe('true');
      }
    }
    expect(field('product-category').tagName).toBe('SELECT');
  });

  it('shows errors, sends nothing and focuses the first field on an empty submit', async () => {
    await setup();
    await submit();

    expect(errorText('product-title')).toContain('obligatoire');
    expect(errorText('product-price')).toContain('obligatoire');
    expect(errorText('product-stock')).toContain('obligatoire');
    expect(errorText('product-category')).toContain('catégorie');
    expect(field('product-title').getAttribute('aria-invalid')).toBe('true');
    expect(field('product-title').getAttribute('aria-describedby')).toBe('product-title-error');
    expect(document.activeElement).toBe(field('product-title'));
    http.expectNone(ADD_URL);
  });

  it('rejects a price <= 0', async () => {
    await setup();
    fillValid();
    fill('product-price', '0');
    await submit();
    expect(errorText('product-price')).toContain('supérieur à 0');
    http.expectNone(ADD_URL);
    fill('product-price', '-5');
    await submit();
    expect(errorText('product-price')).toContain('supérieur à 0');
    expect(document.activeElement).toBe(field('product-price'));
  });

  it('rejects a price with more than 2 decimals', async () => {
    await setup();
    fillValid();
    fill('product-price', '10.999');
    await submit();
    expect(errorText('product-price')).toContain('2 décimales');
    http.expectNone(ADD_URL);
  });

  it('rejects a non-integer stock', async () => {
    await setup();
    fillValid();
    fill('product-stock', '1.5');
    await submit();
    expect(errorText('product-stock')).toContain('entier');
    expect(document.activeElement).toBe(field('product-stock'));
    http.expectNone(ADD_URL);
  });

  it('rejects a title that is too short and a description that is too long', async () => {
    await setup();
    fillValid();
    fill('product-title', 'ab');
    fill('product-description', 'x'.repeat(501));
    await submit();
    expect(errorText('product-title')).toContain('3 caractères');
    expect(errorText('product-description')).toContain('500');
    http.expectNone(ADD_URL);
  });

  it('POSTs a valid form, confirms and resets', async () => {
    await setup();
    fillValid();
    await submit();

    const req = http.expectOne(ADD_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Casque audio',
      price: 59.9,
      stock: 12,
      category: 'tablets',
      description: 'Un casque.',
    });
    expect(el.querySelector('button[type="submit"]')?.hasAttribute('disabled')).toBe(true);

    req.flush({ id: 195, title: 'Casque audio', price: 59.9, stock: 12, category: 'tablets' });
    await settle();

    expect(el.querySelector('[role="status"]')?.textContent).toContain(
      'Produit "Casque audio" ajouté (id 195) — simulé par DummyJSON',
    );
    expect(field<HTMLInputElement>('product-title').value).toBe('');
    expect(field<HTMLInputElement>('product-price').value).toBe('');
    expect(field<HTMLSelectElement>('product-category').value).toBe('');
    expect(el.querySelector('[role="alert"]')).toBeNull();
    expect(errorText('product-title')).toBeNull();
    expect(el.querySelector('button[type="submit"]')?.hasAttribute('disabled')).toBe(false);
  });

  it('shows an alert and keeps the values on a 500 error', async () => {
    await setup();
    fillValid();
    await submit();
    http.expectOne(ADD_URL).flush('boom', { status: 500, statusText: 'Server Error' });
    await settle();

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('échoué');
    expect(field<HTMLInputElement>('product-title').value).toBe('Casque audio');
    expect(field<HTMLInputElement>('product-price').value).toBe('59.9');
    expect(el.querySelector('[role="status"]')?.textContent).not.toContain('ajouté');
  });
});

describe('route /products/new', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('redirects to /login when logged out', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/new');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fproducts%2Fnew');
  });

  it('shows the form (not the product page) when logged in', async () => {
    TestBed.inject(Auth).login('Alice');
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/products/new', ProductForm);
    expect(component).toBeInstanceOf(ProductForm);
    expect(TestBed.inject(Router).url).toBe('/products/new');
    expect((harness.routeNativeElement as HTMLElement).querySelector('h2')?.textContent).toContain(
      'Ajouter un produit',
    );
  });
});
