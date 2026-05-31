import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

    @if (error) {
      <div class="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{{ error }}</div>
    }
    @if (success) {
      <div class="bg-green-50 border border-green-200 text-green-700 rounded p-3 mb-4 text-sm">
        Registered successfully! Redirecting to login…
      </div>
    }

    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input formControlName="username" type="text" placeholder="johndoe"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        @if (form.get('username')?.invalid && form.get('username')?.touched) {
          <p class="text-red-500 text-xs mt-1">Username must be 3–50 characters.</p>
        }
      </div>

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
        <input formControlName="password" type="password" placeholder="Min 6 characters"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        @if (form.get('password')?.invalid && form.get('password')?.touched) {
          <p class="text-red-500 text-xs mt-1">Password must be at least 6 characters.</p>
        }
      </div>

      <button type="submit" [disabled]="form.invalid || loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition disabled:opacity-50">
        {{ loading ? 'Creating account…' : 'Register' }}
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-4">
      Already have an account? <a routerLink="/login" class="text-indigo-600 hover:underline">Sign In</a>
    </p>
  `,
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  error   = '';
  success = false;
  loading = false;

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    this.auth.register(this.form.value as { username: string; email: string; password: string }).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error   = err.error?.message || 'Registration failed.';
        this.loading = false;
      },
    });
  }
}
