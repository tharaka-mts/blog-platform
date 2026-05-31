import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { Blog } from '../../../shared/models/blog.model';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900">My Posts</h1>
        <a routerLink="/blogs/new"
          class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded transition">
          + New Post
        </a>
      </div>

      @if (loading) {
        <div class="text-center py-12 text-gray-400">Loading…</div>
      } @else if (blogs.length === 0) {
        <div class="text-center py-12 text-gray-400">
          You haven't published any posts yet.
          <a routerLink="/blogs/new" class="text-indigo-500 underline ml-1">Write one now!</a>
        </div>
      } @else {
        @for (blog of blogs; track blog.id) {
          <div class="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4">
            <div class="flex-1">
              <a [routerLink]="['/blogs', blog.id]"
                class="font-semibold text-gray-900 hover:text-indigo-600 transition">{{ blog.title }}</a>
              <div class="text-xs text-gray-400 mt-1">
                {{ blog.created_at | date:'mediumDate' }} · ❤ {{ blog.like_count }}
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <a [routerLink]="['/blogs', blog.id, 'edit']"
                class="text-sm text-indigo-500 hover:underline">Edit</a>
              <button (click)="deleteBlog(blog)"
                class="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class MyPostsComponent implements OnInit {
  blogs:   Blog[] = [];
  loading = true;

  constructor(
    private blogService: BlogService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.blogService.getMyBlogs().subscribe({
      next: res => { this.blogs = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  deleteBlog(blog: Blog): void {
    this.confirmService.show(
      'Delete Blog',
      `Delete "${blog.title}"?`,
      'danger',
      'Delete',
      () => {
        this.blogService.deleteBlog(blog.id).subscribe(() => {
          this.blogs = this.blogs.filter(b => b.id !== blog.id);
        });
      }
    );
  }
}
