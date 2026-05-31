import { Component, HostListener, inject, ElementRef } from '@angular/core';
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
        <a routerLink="/" class="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:opacity-90 transition">
          BlogPlatform
        </a>

        <!-- Nav links (Desktop) -->
        <div class="flex items-center gap-6 text-sm">
          <a routerLink="/" routerLinkActive="text-indigo-600 font-semibold"
             [routerLinkActiveOptions]="{exact:true}"
             class="text-gray-600 hover:text-indigo-600 transition">Explore</a>

          @if (auth.isLoggedIn()) {
            
            <!-- Premium button styling for New Post -->
            <a routerLink="/blogs/new" 
               class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow transition font-medium">
              Write a Post
            </a>

            <!-- Dropdown Container -->
            <div class="relative ml-2">
              <button (click)="toggleDropdown($event)"
                class="flex items-center gap-2 hover:bg-gray-50 rounded-full py-1 pr-3 pl-1 transition focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase overflow-hidden">
                  {{ (auth.currentUser()?.username || 'U')[0] }}
                </div>
                <span class="text-gray-700 font-medium max-w-[100px] truncate text-sm">
                  {{ auth.currentUser()?.username || auth.currentUser()?.email }}
                </span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              @if (isDropdownOpen) {
                <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                  <div class="px-4 py-2 border-b border-gray-100 mb-1">
                    <p class="text-xs text-gray-500">Signed in as</p>
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ auth.currentUser()?.email }}</p>
                    @if (auth.isAdmin()) {
                      <span class="inline-block mt-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                    }
                  </div>
                  
                  <a routerLink="/profile" (click)="closeDropdown()"
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition">
                    Profile Settings
                  </a>
                  <a routerLink="/my-posts" (click)="closeDropdown()"
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition">
                    My Posts
                  </a>
                  @if (auth.isAdmin()) {
                    <a routerLink="/admin/users" (click)="closeDropdown()"
                       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition">
                      Admin Dashboard
                    </a>
                    <a routerLink="/admin/bin" (click)="closeDropdown()"
                       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition">
                      Recycle Bin
                    </a>
                  }
                  <div class="border-t border-gray-100 mt-1 pt-1">
                    <button (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                      Sign out
                    </button>
                  </div>
                </div>
              }
            </div>

          } @else {
            <a routerLink="/login" routerLinkActive="text-indigo-600 font-semibold"
               class="text-gray-600 hover:text-indigo-600 font-medium transition">Login</a>
            <a routerLink="/register"
               class="bg-gray-900 hover:bg-gray-800 shadow-sm text-white px-4 py-1.5 rounded-full font-medium transition">
              Sign up
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  private eRef = inject(ElementRef);

  isDropdownOpen = false;

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.isDropdownOpen = false;
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
