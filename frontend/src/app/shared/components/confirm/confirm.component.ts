import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  template: `
    @if (confirm.state(); as conf) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 m-4">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ conf.title }}</h3>
            <p class="text-sm text-gray-500">{{ conf.message }}</p>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3 border-t border-gray-100">
            <button (click)="confirm.close()" 
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition">
              Cancel
            </button>
            <button (click)="confirm.execute()" 
                    [class]="conf.type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
                    class="px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none transition">
              {{ conf.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmComponent {
  confirm = inject(ConfirmService);
}
