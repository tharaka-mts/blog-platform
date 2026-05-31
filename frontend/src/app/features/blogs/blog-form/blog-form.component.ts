import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../shared/models/blog.model';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
      <h1 class="text-xl font-bold text-gray-900 mb-6">{{ isEdit ? 'Edit' : 'New' }} Blog Post</h1>

      @if (error) {
        <div class="bg-red-50 border border-red-200 text-red-600 rounded p-3 mb-4 text-sm">{{ error }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input formControlName="title" type="text" placeholder="Post title"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <p class="text-red-500 text-xs mt-1">Title must be 3–200 characters.</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea formControlName="description" rows="8" placeholder="Write your post content here…"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"></textarea>
          @if (form.get('description')?.invalid && form.get('description')?.touched) {
            <p class="text-red-500 text-xs mt-1">Description must be at least 10 characters.</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
          <input type="file" accept="image/*" (change)="onFile($event)"
            class="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:border file:border-gray-300 file:rounded file:text-sm file:cursor-pointer" />
        </div>

        <div class="flex gap-3 pt-2">
          <button type="submit" [disabled]="form.invalid || loading"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded text-sm disabled:opacity-50 transition">
            {{ loading ? 'Saving…' : (isEdit ? 'Update Post' : 'Publish Post') }}
          </button>
          <a routerLink="/" class="text-gray-500 hover:text-gray-700 text-sm self-center">Cancel</a>
        </div>
      </form>
    </div>
  `,
})
export class BlogFormComponent {
  private fb          = inject(FormBuilder);
  private blogService = inject(BlogService);
  private route       = inject(ActivatedRoute);
  private router      = inject(Router);

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  imageFile: File | null = null;
  isEdit   = false;
  blogId   = 0;
  error    = '';
  loading  = false;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.blogId = Number(id);
      this.blogService.getBlogById(this.blogId).subscribe(res => {
        const b = res.data as Blog;
        this.form.patchValue({ title: b.title, description: b.description });
      });
    }
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] ?? null;
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    const fd = new FormData();
    fd.append('title',       this.form.value.title!);
    fd.append('description', this.form.value.description!);
    if (this.imageFile) fd.append('image', this.imageFile);

    const request$ = this.isEdit
      ? this.blogService.updateBlog(this.blogId, fd)
      : this.blogService.createBlog(fd);

    request$.subscribe({
      next: res => this.router.navigate(['/blogs', res.data!.id]),
      error: err => { this.error = err.error?.message || 'Failed to save post.'; this.loading = false; },
    });
  }
}
