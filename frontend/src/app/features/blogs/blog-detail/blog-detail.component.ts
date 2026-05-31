import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';
import { Blog } from '../../../shared/models/blog.model';
import { CommentSectionComponent } from '../../comments/comment-section/comment-section.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, CommentSectionComponent],
  template: `
    @if (loading) {
      <div class="text-center py-16 text-gray-400">Loading…</div>
    } @else if (!blog) {
      <div class="text-center py-16 text-gray-400">Blog not found.</div>
    } @else {
      <article class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">

        <!-- Image -->
        @if (blog.image_url) {
          <img [src]="apiBase + blog.image_url" alt="Blog image"
            class="w-full max-h-64 object-cover rounded" />
        }

        <!-- Title & meta -->
        <h1 class="text-2xl font-bold text-gray-900">{{ blog.title }}</h1>
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span>by <strong>{{ blog.username }}</strong></span>
          <span>{{ blog.created_at | date:'longDate' }}</span>
          @if (blog.created_at !== blog.updated_at) {
            <span class="italic">edited</span>
          }
        </div>

        <!-- Description -->
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ blog.description }}</p>

        <!-- Like -->
        <div class="flex items-center gap-3 pt-2 border-t border-gray-100">
          @if (auth.isLoggedIn()) {
            <button (click)="toggleLike()"
              [class.text-red-500]="blog.liked"
              [class.text-gray-400]="!blog.liked"
              class="flex items-center gap-1 hover:scale-110 transition-transform">
              {{ blog.liked ? '❤' : '♡' }} {{ blog.like_count }}
            </button>
          } @else {
            <span class="text-gray-400 text-sm">❤ {{ blog.like_count }}</span>
          }

          <!-- Liked-by list (no arrow fn in template - use component method) -->
          @if (blog.likedUsers && blog.likedUsers.length > 0) {
            <span class="text-xs text-gray-400">Liked by {{ likedByLabel }}</span>
          }

          <!-- Edit / Delete for owner or admin -->
          @if (canEdit) {
            <div class="ml-auto flex gap-2">
              <a [routerLink]="['/blogs', blog.id, 'edit']"
                class="text-sm text-indigo-500 hover:underline">Edit</a>
              <button (click)="deleteBlog()" class="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          }
        </div>
      </article>

      <!-- Comments -->
      <div class="mt-6">
        <app-comment-section [blogId]="blog.id" />
      </div>
    }
  `,
})
export class BlogDetailComponent implements OnInit {
  blog:    Blog | null = null;
  loading = true;
  readonly apiBase = environment.apiUrl.replace('/api', '');

  get canEdit(): boolean {
    const user = this.auth.currentUser();
    return !!user && (user.id === this.blog?.user_id || user.role === 'ADMIN');
  }

  get likedByLabel(): string {
    if (!this.blog?.likedUsers) return '';
    const names = this.blog.likedUsers.slice(0, 3).map(u => u.username).join(', ');
    return this.blog.likedUsers.length > 3 ? `${names} & more` : names;
  }

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private blogService: BlogService,
    public  auth:        AuthService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blogService.getBlogById(id).subscribe({
      next: res => { this.blog = res.data ?? null; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  toggleLike(): void {
    if (!this.blog) return;
    this.blogService.toggleLike(this.blog.id).subscribe(res => {
      if (this.blog && res.data) {
        this.blog.liked      = res.data.liked;
        this.blog.like_count = res.data.likeCount;
      }
    });
  }

  deleteBlog(): void {
    if (!this.blog || !confirm('Delete this blog post?')) return;
    this.blogService.deleteBlog(this.blog.id).subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
