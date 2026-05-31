import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() returns false when no token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login() stores token and sets currentUser on success', () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com', role: 'USER' as const },
      },
    };

    service.login({ email: 'test@example.com', password: 'password' }).subscribe(res => {
      expect(res.data?.token).toBe('mock-jwt-token');
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.currentUser()?.email).toBe('test@example.com');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('logout() clears token and currentUser', () => {
    localStorage.setItem('blog_token', 'abc');
    localStorage.setItem('blog_user', JSON.stringify({ id: 1, email: 'x@x.com', role: 'USER' }));
    service.currentUser.set({ id: 1, email: 'x@x.com', role: 'USER' });

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('isAdmin() returns true for ADMIN role', () => {
    service.currentUser.set({ id: 1, email: 'admin@example.com', role: 'ADMIN' });
    expect(service.isAdmin()).toBeTrue();
  });

  it('isAdmin() returns false for USER role', () => {
    service.currentUser.set({ id: 2, email: 'user@example.com', role: 'USER' });
    expect(service.isAdmin()).toBeFalse();
  });
});
