import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

    @if (error) {
      <div class="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{{ error }}</div>
    }

    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input formControlName="email" type="email" placeholder="you@example.com"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        @if (form.get('email')?.invalid && form.get('email')?.touched) {
          <p class="text-red-500 text-xs mt-1">Valid email required.</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input formControlName="password" type="password" placeholder="••••••••"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        @if (form.get('password')?.invalid && form.get('password')?.touched) {
          <p class="text-red-500 text-xs mt-1">Password required.</p>
        }
      </div>

      <button type="submit" [disabled]="form.invalid || loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition disabled:opacity-50">
        {{ loading ? 'Signing in…' : 'Sign In' }}
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-4">
      Don't have an account? <a routerLink="/register" class="text-indigo-600 hover:underline">Register</a>
    </p>
  `,
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form    = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  error   = '';
  loading = false;

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    this.auth.login(this.form.value as { email: string; password: string }).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error   = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
