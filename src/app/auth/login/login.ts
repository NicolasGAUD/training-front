import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../auth';

type LoginModel = { name: string };

@Component({
  imports: [FormField],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly model = signal<LoginModel>({ name: '' });
  protected readonly loginForm = form(this.model, (path) => {
    required(path.name, { message: 'Le nom est obligatoire' });
  });
  protected readonly submitted = signal(false);

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigateByUrl('/account');
    }
  }

  protected showError(): boolean {
    const field = this.loginForm.name();
    return field.invalid() && (field.touched() || this.submitted());
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (this.loginForm().invalid()) {
      return;
    }
    this.auth.login(this.model().name.trim());
    void this.router.navigateByUrl(this.targetUrl());
  }

  private targetUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl !== null && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return '/account';
  }
}
