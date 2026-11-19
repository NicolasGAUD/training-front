import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Auth } from '../auth/auth';
import { Account } from './account';

describe('Account', () => {
  let auth: Auth;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'account', component: Account },
          { path: '', children: [] },
        ]),
      ],
    });
    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    auth.login('Alice');
  });

  it('displays the user name', async () => {
    const harness = await RouterTestingHarness.create('/account');
    const el = harness.routeNativeElement as HTMLElement;
    expect(el.querySelector('h2')).not.toBeNull();
    expect(el.textContent).toContain('Bonjour Alice');
  });

  it('logs out and redirects to /', async () => {
    const harness = await RouterTestingHarness.create('/account');
    const el = harness.routeNativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('button')?.click();
    await harness.fixture.whenStable();
    expect(auth.isLoggedIn()).toBe(false);
    expect(router.url).toBe('/');
  });
});
