import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';
import { Blog } from '../../../shared/models/blog.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Search & Sort toolbar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input [(ngModel)]="keyword" (input)="onSearch()" type="text" placeholder="Search posts…"
          class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <select [(ngModel)]="sort" (change)="loadBlogs()" class="border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <!-- Blog cards -->
      @if (loading) {
        <div class="text-center py-12 text-gray-400">Loading…</div>
      } @else if (blogs.length === 0) {
        <div class="text-center py-12 text-gray-400">No posts found.</div>
      } @else {
        <div class="space-y-4">
          @for (blog of blogs; track blog.id) {
            <article class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
              @if (blog.image_url) {
                <img [src]="apiUrl + blog.image_url" alt="Post image"
                  class="w-full h-40 object-cover rounded mb-3" />
              }
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <a [routerLink]="['/blogs', blog.id]"
                    class="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">
                    {{ blog.title }}
                  </a>
                  <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ blog.description }}</p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>by <strong class="text-gray-600">{{ blog.username }}</strong></span>
                    <span>{{ blog.created_at | date:'mediumDate' }}</span>
                    <span>❤ {{ blog.like_count }}</span>
                  </div>
                </div>
                <a [routerLink]="['/blogs', blog.id]"
                  class="text-indigo-500 hover:text-indigo-700 text-sm shrink-0">Read →</a>
              </div>
            </article>
          }
        </div>
      }

      <!-- Pagination -->
      @if (totalPages > 1) {
        <app-pagination [currentPage]="page" [totalPages]="totalPages" (pageChange)="goToPage($event)" />
      }
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  blogs:      Blog[] = [];
  keyword    = '';
  sort:      'newest' | 'oldest' = 'newest';
  page       = 1;
  pageSize   = 5;
  total      = 0;
  loading    = false;
  readonly apiUrl = environment.apiUrl.replace('/api', '');

  get totalPages() { return Math.ceil(this.total / this.pageSize); }

  constructor(private blogService: BlogService, public auth: AuthService) {}

  ngOnInit(): void { this.loadBlogs(); }

  loadBlogs(): void {
    this.loading = true;
    this.blogService.getBlogs({ page: this.page, pageSize: this.pageSize, keyword: this.keyword, sort: this.sort })
      .subscribe({
        next: res => {
          this.blogs   = res.data ?? [];
          this.total   = res.meta?.total ?? 0;
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadBlogs();
  }

  goToPage(p: number): void {
    this.page = p;
    this.loadBlogs();
  }
}
