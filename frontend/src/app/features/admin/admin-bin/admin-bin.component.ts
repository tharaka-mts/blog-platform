import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { User } from '../../../shared/models/user.model';
import { Blog } from '../../../shared/models/blog.model';

@Component({
  selector: 'app-admin-bin',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Recycle Bin</h1>
        <div class="bg-gray-100 p-1 rounded-lg inline-flex">
          <button (click)="tab = 'users'" [class.bg-white]="tab === 'users'" [class.shadow]="tab === 'users'"
            class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-700 transition">
            Deleted Users
          </button>
          <button (click)="tab = 'blogs'" [class.bg-white]="tab === 'blogs'" [class.shadow]="tab === 'blogs'"
            class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-700 transition">
            Deleted Blogs
          </button>
        </div>
      </div>

      <!-- Users Tab -->
      @if (tab === 'users') {
        <div class="bg-white border text-left border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4">User</th>
                  <th class="px-6 py-4">Role</th>
                  <th class="px-6 py-4">Deleted At</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users; track user.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">
                      <div>{{ user.username || 'User' }}</div>
                      <div class="text-xs text-gray-500 font-normal">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ user.created_at | date:'medium' }}</td>
                    <td class="px-6 py-4 text-right whitespace-nowrap space-x-3">
                      <button (click)="restoreUser(user.id)" class="text-indigo-600 font-medium hover:underline text-sm focus:outline-none">Restore</button>
                      <button (click)="hardDeleteUser(user.id)" class="text-red-600 font-medium hover:underline text-sm focus:outline-none">Delete Permanently</button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No deleted users found in the bin.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Blogs Tab -->
      @if (tab === 'blogs') {
        <div class="bg-white border text-left border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4">Blog Post</th>
                  <th class="px-6 py-4">Author</th>
                  <th class="px-6 py-4">Stats</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (blog of blogs; track blog.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900 max-w-sm">
                      <div class="truncate">{{ blog.title }}</div>
                      <div class="text-xs text-gray-500 font-normal truncate">{{ blog.description }}</div>
                    </td>
                    <td class="px-6 py-4">{{ blog.username || 'Unknown' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs">
                      Likes: <b>{{ blog.like_count || 0 }}</b>
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap space-x-3">
                      <button (click)="restoreBlog(blog.id)" class="text-indigo-600 font-medium hover:underline text-sm focus:outline-none">Restore</button>
                      <button (click)="hardDeleteBlog(blog.id)" class="text-red-600 font-medium hover:underline text-sm focus:outline-none">Delete Permanently</button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No deleted blogs found in the bin.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminBinComponent implements OnInit {
  private adminService = inject(AdminService);
  private confirmService = inject(ConfirmService);
  
  tab: 'users' | 'blogs' = 'users';

  users: User[] = [];
  blogs: Blog[] = [];

  ngOnInit() {
    this.loadUsers();
    this.loadBlogs();
  }

  loadUsers() {
    this.adminService.getDeletedUsers().subscribe(r => this.users = r.data || []);
  }

  loadBlogs() {
    this.adminService.getDeletedBlogs().subscribe(r => this.blogs = r.data || []);
  }

  restoreUser(id: number) {
    this.confirmService.show(
      'Restore User',
      'Are you sure you want to restore this user?',
      'safe',
      'Restore',
      () => this.adminService.restoreUser(id).subscribe(() => this.loadUsers())
    );
  }

  hardDeleteUser(id: number) {
    this.confirmService.show(
      'Permanently Delete',
      'WARNING: This will completely erase this user from the database. This cannot be undone.',
      'danger',
      'Delete Permanently',
      () => this.adminService.hardDeleteUser(id).subscribe(() => this.loadUsers())
    );
  }

  restoreBlog(id: number) {
    this.confirmService.show(
      'Restore Blog',
      'Are you sure you want to restore this blog post?',
      'safe',
      'Restore',
      () => this.adminService.restoreBlog(id).subscribe(() => this.loadBlogs())
    );
  }

  hardDeleteBlog(id: number) {
    this.confirmService.show(
      'Permanently Delete',
      'WARNING: This will completely erase this blog post from the database. This cannot be undone.',
      'danger',
      'Delete Permanently',
      () => this.adminService.hardDeleteBlog(id).subscribe(() => this.loadBlogs())
    );
  }
}
