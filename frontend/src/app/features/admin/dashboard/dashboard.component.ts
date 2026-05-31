import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a routerLink="/admin/users"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm hover:border-indigo-300 transition block">
          <div class="text-indigo-600 text-3xl mb-2">👥</div>
          <h2 class="text-lg font-semibold text-gray-800">User Management</h2>
          <p class="text-gray-500 text-sm mt-1">Activate, deactivate, or delete users.</p>
        </a>

        <a routerLink="/"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm hover:border-indigo-300 transition block">
          <div class="text-indigo-600 text-3xl mb-2">📝</div>
          <h2 class="text-lg font-semibold text-gray-800">Blog Posts</h2>
          <p class="text-gray-500 text-sm mt-1">View and moderate all blog posts.</p>
        </a>
      </div>
    </div>
  `,
})
export class DashboardComponent {}
