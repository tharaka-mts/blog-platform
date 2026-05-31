import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Comment } from '../../../shared/models/comment.model';
import { CommentItemComponent } from '../comment-item/comment-item.component';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [FormsModule, CommentItemComponent],
  template: `
    <div class="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      <h2 class="font-semibold text-gray-800 text-lg">Comments ({{ comments.length }})</h2>

      <!-- New top-level comment -->
      @if (auth.isLoggedIn()) {
        <div class="space-y-2">
          <textarea [(ngModel)]="newComment" placeholder="Write a comment…" rows="3"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"></textarea>
          <button (click)="postComment()" [disabled]="!newComment.trim()"
            class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded transition disabled:opacity-50">
            Post Comment
          </button>
        </div>
      } @else {
        <p class="text-sm text-gray-400">
          <a href="/login" class="text-indigo-500 hover:underline">Sign in</a> to comment.
        </p>
      }

      <!-- Reply form (appears below a specific comment) -->
      @if (replyingTo !== null) {
        <div class="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
          <p class="text-xs text-gray-500">Replying to comment…</p>
          <textarea [(ngModel)]="replyContent" rows="2"
            class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"></textarea>
          <div class="flex gap-2">
            <button (click)="postReply()"
              class="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition">Submit Reply</button>
            <button (click)="replyingTo=null" class="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      }

      <!-- Comment list -->
      @if (loading) {
        <div class="text-center text-gray-400 py-4">Loading comments…</div>
      } @else if (comments.length === 0) {
        <p class="text-gray-400 text-sm text-center py-4">No comments yet. Be the first!</p>
      } @else {
        <div class="space-y-4">
          @for (comment of comments; track comment.id) {
            <app-comment-item
              [comment]="comment"
              (replyToggle)="replyingTo=$event; replyContent=''"
              (editComment)="updateComment($event)"
              (deleteComment)="deleteComment($event)" />
          }
        </div>
      }
    </div>
  `,
})
export class CommentSectionComponent implements OnInit {
  @Input() blogId!: number;

  comments:     Comment[] = [];
  newComment  = '';
  replyingTo: number | null = null;
  replyContent = '';
  loading      = true;

  constructor(
    private commentService: CommentService,
    public  auth:           AuthService,
  ) {}

  ngOnInit(): void { this.loadComments(); }

  loadComments(): void {
    this.commentService.getComments(this.blogId).subscribe({
      next: res => { this.comments = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  postComment(): void {
    if (!this.newComment.trim()) return;
    this.commentService.createComment(this.blogId, this.newComment).subscribe({
      next: () => { this.newComment = ''; this.loadComments(); },
    });
  }

  postReply(): void {
    if (!this.replyContent.trim() || this.replyingTo === null) return;
    this.commentService.createComment(this.blogId, this.replyContent, this.replyingTo).subscribe({
      next: () => { this.replyingTo = null; this.replyContent = ''; this.loadComments(); },
    });
  }

  updateComment(event: { id: number; content: string }): void {
    this.commentService.updateComment(this.blogId, event.id, event.content).subscribe({
      next: () => this.loadComments(),
    });
  }

  deleteComment(commentId: number): void {
    if (!confirm('Delete this comment?')) return;
    this.commentService.deleteComment(this.blogId, commentId).subscribe({
      next: () => this.loadComments(),
    });
  }
}
