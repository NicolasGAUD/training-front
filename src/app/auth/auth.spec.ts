import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';

describe('Auth', () => {
  let auth: Auth;

  beforeEach(() => {
    auth = TestBed.inject(Auth);
  });

  it('starts logged out', () => {
    expect(auth.user()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('logs in with a name', () => {
    auth.login('Alice');
    expect(auth.user()).toEqual({ name: 'Alice' });
    expect(auth.isLoggedIn()).toBe(true);
  });

  it('logs out', () => {
    auth.login('Alice');
    auth.logout();
    expect(auth.user()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });
});
