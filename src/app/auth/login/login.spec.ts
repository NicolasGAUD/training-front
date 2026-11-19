import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { Auth } from '../auth';
import { Login } from './login';

describe('Login', () => {
  let auth: Auth;
  let router: Router;

  const setup = async (url: string): Promise<RouterTestingHarness> => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return harness;
  };

  const submit = async (harness: RouterTestingHarness, name: string): Promise<void> => {
    const el = harness.routeNativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('input') as HTMLInputElement;
    input.value = name;
    input.dispatchEvent(new Event('input'));
    el.querySelector<HTMLButtonElement>('button')?.click();
    await harness.fixture.whenStable();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: Login },
          { path: 'account', children: [] },
          { path: 'products/:id', children: [] },
          { path: 'other', children: [] },
          { path: '', children: [] },
        ]),
      ],
    });
    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
  });

  it('has a label bound to the input and a submit button', async () => {
    const harness = await setup('/login');
    const el = harness.routeNativeElement as HTMLElement;
    const label = el.querySelector('label');
    expect(label?.textContent).toContain('Nom');
    expect(el.querySelector(`#${label?.htmlFor}`)).not.toBeNull();
    expect(el.querySelector('button')?.textContent).toContain('Se connecter');
  });

  it('shows an error and does not log in when the name is empty', async () => {
    const harness = await setup('/login');
    await submit(harness, '');
    const el = harness.routeNativeElement as HTMLElement;
    const input = el.querySelector('input');
    const error = el.querySelector('[role="alert"]');
    expect(error).not.toBeNull();
    expect(input?.getAttribute('aria-describedby')).toBe(error?.id);
    expect(auth.isLoggedIn()).toBe(false);
    expect(router.url).toBe('/login');
  });

  it('logs in and redirects to /account by default', async () => {
    const harness = await setup('/login');
    await submit(harness, 'Alice');
    expect(auth.user()).toEqual({ name: 'Alice' });
    expect(router.url).toBe('/account');
  });

  it('redirects to an internal returnUrl', async () => {
    const harness = await setup('/login?returnUrl=%2Fother');
    await submit(harness, 'Alice');
    expect(router.url).toBe('/other');
  });

  it('ignores an external returnUrl', async () => {
    const harness = await setup('/login?returnUrl=%2F%2Fevil.com');
    await submit(harness, 'Alice');
    expect(router.url).toBe('/account');
  });

  it('redirects to /account when already logged in', async () => {
    auth.login('Alice');
    await setup('/login');
    expect(router.url).toBe('/account');
  });
});
