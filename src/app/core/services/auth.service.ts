import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginPayload, LoginResponseData } from '../models/auth.model';
import { Section } from '../models/section.model';
import { User } from '../models/user.model';

const TOKEN_KEY = 'gt_token';
const USER_KEY = 'gt_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<User | null>(this.readStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  login(payload: LoginPayload): Observable<ApiResponse<LoginResponseData>> {
    return this.http
      .post<ApiResponse<LoginResponseData>>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((response) => this.setSession(response.data)));
  }

  logout(): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(tap(() => this.clearSession()));
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  fetchMe(): Observable<ApiResponse<User>> {
    return this.http
      .get<ApiResponse<User>>(`${environment.apiUrl}/me`)
      .pipe(tap((response) => this.setUser(response.data)));
  }

  fetchMySections(): Observable<ApiResponse<Section[]>> {
    return this.http.get<ApiResponse<Section[]>>(`${environment.apiUrl}/me/sections`);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private setSession(data: LoginResponseData): void {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    this.tokenSignal.set(data.access_token);
    if (data.user) {
      this.setUser(data.user);
    }
  }

  private setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
