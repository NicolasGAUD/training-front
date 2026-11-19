import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the welcome message and the product list', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Bienvenue');
    expect(el.querySelector('app-product-list')).not.toBeNull();
  });
});
