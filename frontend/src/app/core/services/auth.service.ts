import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { AuthUser } from '../../shared/models/user.model';

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'blog_token';
  private readonly USER_KEY  = 'blog_user';

  currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string }): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${this.API}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API}/login`, data).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem(this.TOKEN_KEY, res.data.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  updateProfile(data: { username: string }): Observable<ApiResponse<{ token: string; user: AuthUser }>> {
    return this.http.put<ApiResponse<{ token: string; user: AuthUser }>>(`${this.API}/profile`, data).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem(this.TOKEN_KEY, res.data.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  updatePassword(data: { oldPassword: string; newPassword: string }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API}/password`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
