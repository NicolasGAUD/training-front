import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Auth } from './auth';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const route = new ActivatedRouteSnapshot();
  const state = (url: string): RouterStateSnapshot => ({ url, root: route });
  const run = (url: string) =>
    TestBed.runInInjectionContext(() => authGuard(route, state(url)));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('returns true when logged in', () => {
    TestBed.inject(Auth).login('Alice');
    expect(run('/account')).toBe(true);
  });

  it('redirects to /login with returnUrl when logged out', () => {
    const result = run('/account');
    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login?returnUrl=%2Faccount');
  });
});
