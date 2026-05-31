import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Comment } from '../../../shared/models/comment.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="group">
      <div class="flex gap-3">
        <!-- Avatar -->
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
          {{ comment.username[0].toUpperCase() }}
        </div>

        <div class="flex-1">
          <!-- Header -->
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span class="font-semibold text-gray-800">{{ comment.username }}</span>
            <span>{{ comment.created_at | date:'mediumDate' }}</span>
            @if (comment.is_edited) { <span class="italic text-gray-400">(edited)</span> }
          </div>

          <!-- Content or Edit form -->
          @if (editing) {
            <div class="space-y-2">
              <textarea [(ngModel)]="editContent" rows="2"
                class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"></textarea>
              <div class="flex gap-2">
                <button (click)="saveEdit()" class="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition">Save</button>
                <button (click)="editing=false" class="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
              </div>
            </div>
          } @else {
            <p class="text-gray-700 text-sm leading-relaxed">{{ comment.content }}</p>
          }

          <!-- Actions -->
          <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
            @if (auth.isLoggedIn()) {
              <button (click)="replyToggle.emit(comment.id)" class="hover:text-indigo-500 transition">Reply</button>
            }
            @if (canModify) {
              <button (click)="startEdit()" class="hover:text-indigo-500 transition">Edit</button>
              <button (click)="deleteComment.emit(comment.id)" class="hover:text-red-500 transition">Delete</button>
            }
          </div>
        </div>
      </div>

      <!-- Nested replies -->
      @if (comment.replies && comment.replies.length > 0) {
        <div class="ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
          @for (reply of comment.replies; track reply.id) {
            <app-comment-item
              [comment]="reply"
              (replyToggle)="replyToggle.emit($event)"
              (editComment)="editComment.emit($event)"
              (deleteComment)="deleteComment.emit($event)" />
          }
        </div>
      }
    </div>
  `,
})
export class CommentItemComponent {
  @Input()  comment!: Comment;
  @Output() replyToggle  = new EventEmitter<number>();
  @Output() editComment  = new EventEmitter<{ id: number; content: string }>();
  @Output() deleteComment = new EventEmitter<number>();

  editing     = false;
  editContent = '';

  constructor(public auth: AuthService) {}

  get canModify(): boolean {
    const user = this.auth.currentUser();
    return !!user && (user.id === this.comment.user_id || user.role === 'ADMIN');
  }

  startEdit(): void {
    this.editing     = true;
    this.editContent = this.comment.content;
  }

  saveEdit(): void {
    if (!this.editContent.trim()) return;
    this.editComment.emit({ id: this.comment.id, content: this.editContent });
    this.editing = false;
  }
}
