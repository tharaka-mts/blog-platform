import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Blog Platform</h1>
          <p class="text-gray-500 mt-1">Share your thoughts with the world</p>
        </div>
        <div class="bg-white shadow-md rounded-lg p-8">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {}
