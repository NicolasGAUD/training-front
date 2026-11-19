import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { dummyJsonListBody } from '../testing/products';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http
      .expectOne((req) => req.url.startsWith('https://dummyjson.com/products?'))
      .flush(dummyJsonListBody());
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the welcome message and the product list', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Bienvenue');
    expect(el.querySelector('app-product-list')).not.toBeNull();
    expect(el.querySelectorAll('app-product-card').length).toBeGreaterThan(0);
  });
});
