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
}
