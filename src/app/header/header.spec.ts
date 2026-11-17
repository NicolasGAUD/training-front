import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('count', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the cart count', async () => {
    fixture.componentRef.setInput('count', 3);
    await fixture.whenStable();
    const counter = (fixture.nativeElement as HTMLElement).querySelector('p[aria-live="polite"]');
    expect(counter?.textContent).toContain('Panier : 3 article(s)');
  });

  it('emits clear when the button is clicked', () => {
    let emitted = 0;
    component.clear.subscribe(() => emitted++);
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')?.click();
    expect(emitted).toBe(1);
  });
});
