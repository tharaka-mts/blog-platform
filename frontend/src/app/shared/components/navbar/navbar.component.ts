import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <!-- Logo -->
        <a routerLink="/" class="text-xl font-bold text-indigo-600">BlogPlatform</a>

        <!-- Nav links -->
        <div class="flex items-center gap-4 text-sm">
          <a routerLink="/" routerLinkActive="text-indigo-600 font-semibold"
             [routerLinkActiveOptions]="{exact:true}"
             class="text-gray-600 hover:text-indigo-600 transition">Home</a>

          @if (auth.isLoggedIn()) {
            <a routerLink="/my-posts" routerLinkActive="text-indigo-600 font-semibold"
               class="text-gray-600 hover:text-indigo-600 transition">My Posts</a>
            <a routerLink="/blogs/new" routerLinkActive="text-indigo-600 font-semibold"
               class="text-gray-600 hover:text-indigo-600 transition">New Post</a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin/users" routerLinkActive="text-indigo-600 font-semibold"
                 class="text-gray-600 hover:text-indigo-600 transition">Admin</a>
            }
            <span class="text-gray-400">|</span>
            <span class="text-gray-700 font-medium">{{ auth.currentUser()?.email }}</span>
            <button (click)="auth.logout()"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition">
              Logout
            </button>
          } @else {
            <a routerLink="/login" routerLinkActive="text-indigo-600 font-semibold"
               class="text-gray-600 hover:text-indigo-600 transition">Login</a>
            <a routerLink="/register"
               class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition">
              Register
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
}
