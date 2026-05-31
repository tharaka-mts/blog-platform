import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/blogs/blog-list/blog-list.component').then(m => m.BlogListComponent),
      },
      {
        path: 'blogs/new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/blogs/blog-form/blog-form.component').then(m => m.BlogFormComponent),
      },
      {
        path: 'blogs/:id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/blogs/blog-form/blog-form.component').then(m => m.BlogFormComponent),
      },
      {
        path: 'blogs/:id',
        loadComponent: () =>
          import('./features/blogs/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
      },
      {
        path: 'my-posts',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/blogs/my-posts/my-posts.component').then(m => m.MyPostsComponent),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/admin/users/users.component').then(m => m.UsersComponent),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
