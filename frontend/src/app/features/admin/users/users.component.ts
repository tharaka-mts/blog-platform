import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="space-y-4">
      <h1 class="text-xl font-bold text-gray-900">User Management</h1>

      @if (message) {
        <div class="bg-green-50 border border-green-200 text-green-700 rounded p-3 text-sm">{{ message }}</div>
      }
      @if (error) {
        <div class="bg-red-50 border border-red-200 text-red-600 rounded p-3 text-sm">{{ error }}</div>
      }

      @if (loading) {
        <div class="text-center py-12 text-gray-400">Loading users…</div>
      } @else {
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 text-gray-600 font-medium">User</th>
                <th class="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th class="text-left px-4 py-3 text-gray-600 font-medium">Joined</th>
                <th class="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (user of users; track user.id) {
                <tr class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">{{ user.username }}</div>
                    <div class="text-gray-400 text-xs">{{ user.email }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span [class.bg-purple-100]="user.role === 'ADMIN'"
                          [class.text-purple-700]="user.role === 'ADMIN'"
                          [class.bg-gray-100]="user.role !== 'ADMIN'"
                          [class.text-gray-600]="user.role !== 'ADMIN'"
                          class="px-2 py-0.5 rounded text-xs font-medium">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span [class.bg-green-100]="user.is_active"
                          [class.text-green-700]="user.is_active"
                          [class.bg-red-100]="!user.is_active"
                          [class.text-red-600]="!user.is_active"
                          class="px-2 py-0.5 rounded text-xs font-medium">
                      {{ user.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-400 text-xs">{{ user.created_at | date:'mediumDate' }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      @if (user.is_active) {
                        <button (click)="deactivate(user)"
                          class="text-xs text-yellow-600 hover:text-yellow-800 transition">Deactivate</button>
                      } @else {
                        <button (click)="activate(user)"
                          class="text-xs text-green-600 hover:text-green-800 transition">Activate</button>
                      }
                      <button (click)="deleteUser(user)"
                        class="text-xs text-red-500 hover:text-red-700 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class UsersComponent implements OnInit {
  users:   User[] = [];
  loading = true;
  message = '';
  error   = '';

  constructor(
    private adminService: AdminService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: res => { this.users = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  activate(user: User): void {
    this.adminService.activateUser(user.id).subscribe({
      next: res => { Object.assign(user, res.data); this.flash('User activated.'); },
      error: err => this.setError(err),
    });
  }

  deactivate(user: User): void {
    this.adminService.deactivateUser(user.id).subscribe({
      next: res => { Object.assign(user, res.data); this.flash('User deactivated.'); },
      error: err => this.setError(err),
    });
  }

  deleteUser(user: User): void {
    this.confirmService.show(
      'Delete User',
      `Delete user "${user.username}"? This cannot be undone.`,
      'danger',
      'Delete',
      () => {
        this.adminService.deleteUser(user.id).subscribe({
          next: () => { this.users = this.users.filter(u => u.id !== user.id); this.flash('User deleted.'); },
          error: err => this.setError(err),
        });
      }
    );
  }

  private flash(msg: string): void {
    this.message = msg;
    setTimeout(() => (this.message = ''), 3000);
  }

  private setError(err: any): void {
    this.error = err.error?.message || 'Action failed.';
    setTimeout(() => (this.error = ''), 4000);
  }
}
