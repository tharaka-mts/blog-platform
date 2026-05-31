import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Comment } from '../../shared/models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private api(blogId: number) {
    return `${environment.apiUrl}/blogs/${blogId}/comments`;
  }

  constructor(private http: HttpClient) {}

  getComments(blogId: number): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(this.api(blogId));
  }

  createComment(blogId: number, content: string, parentCommentId?: number): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(this.api(blogId), { content, parentCommentId });
  }

  updateComment(blogId: number, commentId: number, content: string): Observable<ApiResponse<Comment>> {
    return this.http.put<ApiResponse<Comment>>(`${this.api(blogId)}/${commentId}`, { content });
  }

  deleteComment(blogId: number, commentId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api(blogId)}/${commentId}`);
  }
}
