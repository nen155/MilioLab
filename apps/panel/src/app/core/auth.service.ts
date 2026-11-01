import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { ApiService } from './api.service';
import { AdminUser } from './models';

const TOKEN_KEY = 'miliolab.token';
const USER_KEY = 'miliolab.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly tokenState = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userState = signal<AdminUser | null>(this.readUser());

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenState() !== null);
  readonly isAdmin = computed(() => this.userState()?.is_admin === true);

  login(email: string, password: string): Observable<AdminUser> {
    return this.api.login(email, password).pipe(
      tap(({ token, user }) => this.persist(token, user)),
      map(({ user }) => user),
    );
  }

  refresh(): Observable<AdminUser> {
    return this.api.me().pipe(tap((user) => this.persist(this.tokenState() ?? '', user)));
  }

  logout(navigate = true): void {
    const token = this.tokenState();

    this.clear();

    if (token) {
      this.api.logout().subscribe({ error: () => undefined });
    }

    if (navigate) {
      this.router.navigate(['/login']);
    }
  }

  private persist(token: string, user: AdminUser): void {
    this.tokenState.set(token);
    this.userState.set(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clear(): void {
    this.tokenState.set(null);
    this.userState.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private readUser(): AdminUser | null {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }
}
