import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-5xl mx-auto px-4 py-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
