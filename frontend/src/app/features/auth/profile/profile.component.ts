import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-8">
      <!-- Username Section -->
      <section class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
        @if (profileSuccess) {
          <div class="bg-green-50 border border-green-200 text-green-700 rounded p-3 mb-4 text-sm">{{ profileSuccess }}</div>
        }
        @if (profileError) {
          <div class="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{{ profileError }}</div>
        }
        <form [formGroup]="profileForm" (ngSubmit)="submitProfile()" class="max-w-md space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input formControlName="username" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            @if (profileForm.get('username')?.invalid && profileForm.get('username')?.touched) {
              <p class="text-red-500 text-xs mt-1">Username must be 3–50 characters.</p>
            }
          </div>
          <button type="submit" [disabled]="profileForm.invalid || loadingProfile"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50 text-sm">
            {{ loadingProfile ? 'Saving…' : 'Save Profile' }}
          </button>
        </form>
      </section>

      <!-- Password Section -->
      <section class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
        @if (pwSuccess) {
          <div class="bg-green-50 border border-green-200 text-green-700 rounded p-3 mb-4 text-sm">{{ pwSuccess }}</div>
        }
        @if (pwError) {
          <div class="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{{ pwError }}</div>
        }
        <form [formGroup]="pwForm" (ngSubmit)="submitPassword()" class="max-w-md space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input formControlName="oldPassword" type="password"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input formControlName="newPassword" type="password"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            @if (pwForm.get('newPassword')?.invalid && pwForm.get('newPassword')?.touched) {
              <p class="text-red-500 text-xs mt-1">Must be at least 6 characters.</p>
            }
          </div>
          <button type="submit" [disabled]="pwForm.invalid || loadingPw"
            class="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50 text-sm">
            {{ loadingPw ? 'Updating…' : 'Update Password' }}
          </button>
        </form>
      </section>
    </div>
  `
})
export class ProfileComponent {
  private fb   = inject(FormBuilder);
  private auth = inject(AuthService);

  profileForm = this.fb.group({
    username: [this.auth.currentUser()?.username || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
  });

  pwForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  loadingProfile = false;
  profileSuccess = '';
  profileError   = '';

  loadingPw = false;
  pwSuccess = '';
  pwError   = '';

  submitProfile(): void {
    if (this.profileForm.invalid) return;
    this.loadingProfile = true;
    this.profileError   = '';
    this.profileSuccess = '';

    this.auth.updateProfile({ username: this.profileForm.value.username! }).subscribe({
      next: (res) => {
        this.profileSuccess = 'Profile saved.';
        this.loadingProfile = false;
      },
      error: (err) => {
        this.profileError   = err.error?.message || 'Error saving profile.';
        this.loadingProfile = false;
      }
    });
  }

  submitPassword(): void {
    if (this.pwForm.invalid) return;
    this.loadingPw = true;
    this.pwError   = '';
    this.pwSuccess = '';

    this.auth.updatePassword({
      oldPassword: this.pwForm.value.oldPassword!,
      newPassword: this.pwForm.value.newPassword!
    }).subscribe({
      next: () => {
        this.pwSuccess = 'Password updated.';
        this.loadingPw = false;
        this.pwForm.reset();
      },
      error: (err) => {
        this.pwError   = err.error?.message || 'Error updating password.';
        this.loadingPw = false;
      }
    });
  }
}
