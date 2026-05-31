import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="flex items-center justify-center gap-2 mt-6">
      <button
        (click)="pageChange.emit(currentPage - 1)"
        [disabled]="currentPage <= 1"
        class="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100 transition">
        ← Prev
      </button>

      @for (p of pages; track p) {
        <button
          (click)="pageChange.emit(p)"
          [class.bg-indigo-600]="p === currentPage"
          [class.text-white]="p === currentPage"
          class="px-3 py-1 rounded border text-sm hover:bg-gray-100 transition">
          {{ p }}
        </button>
      }

      <button
        (click)="pageChange.emit(currentPage + 1)"
        [disabled]="currentPage >= totalPages"
        class="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100 transition">
        Next →
      </button>
    </div>
    <p class="text-center text-xs text-gray-400 mt-2">Page {{ currentPage }} of {{ totalPages }}</p>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages  = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
