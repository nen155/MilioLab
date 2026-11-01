import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./features/posts/post-list.component').then((m) => m.PostListComponent),
      },
      {
        path: 'posts/new',
        loadComponent: () =>
          import('./features/posts/post-edit.component').then((m) => m.PostEditComponent),
      },
      {
        path: 'posts/:id',
        loadComponent: () =>
          import('./features/posts/post-edit.component').then((m) => m.PostEditComponent),
      },
      {
        path: 'pages',
        loadComponent: () =>
          import('./features/pages/page-list.component').then((m) => m.PageListComponent),
      },
      {
        path: 'pages/new',
        loadComponent: () =>
          import('./features/pages/page-edit.component').then((m) => m.PageEditComponent),
      },
      {
        path: 'pages/:id',
        loadComponent: () =>
          import('./features/pages/page-edit.component').then((m) => m.PageEditComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/taxonomies/categories.component').then((m) => m.CategoriesComponent),
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./features/taxonomies/tags.component').then((m) => m.TagsComponent),
      },
      {
        path: 'media',
        loadComponent: () =>
          import('./features/media/media-library.component').then((m) => m.MediaLibraryComponent),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/menu/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/account/account.component').then((m) => m.AccountComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
