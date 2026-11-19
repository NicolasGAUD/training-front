import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth';

@Component({
  imports: [],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly name = computed(() => this.auth.user()?.name ?? '');

  onLogout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
