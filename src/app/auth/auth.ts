import { computed, Service, signal } from '@angular/core';

export type User = { name: string };

@Service()
export class Auth {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(name: string): void {
    this._user.set({ name });
  }

  logout(): void {
    this._user.set(null);
  }
}
