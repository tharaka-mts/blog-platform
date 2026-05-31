import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.API}/users`);
  }

  activateUser(id: number): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API}/users/${id}/activate`, {});
  }

  deactivateUser(id: number): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API}/users/${id}/deactivate`, {});
  }

  deleteUser(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API}/users/${id}`);
  }

  getDeletedUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.API}/bin/users`);
  }

  restoreUser(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API}/bin/users/${id}/restore`, {});
  }

  hardDeleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/bin/users/${id}/hard`);
  }

  getDeletedBlogs(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API}/bin/blogs`);
  }

  restoreBlog(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API}/bin/blogs/${id}/restore`, {});
  }

  hardDeleteBlog(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/bin/blogs/${id}/hard`);
  }
}
