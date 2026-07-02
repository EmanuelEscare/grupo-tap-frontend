import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, getCollectionData } from '../../core/models/api-response.model';
import { User, UserPayload } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  list(): Observable<User[]> {
    return this.http
      .get<unknown>(this.baseUrl)
      .pipe(map((response) => getCollectionData<Partial<User>>(response, 'users').map((user) => this.toUser(user))));
  }

  create(payload: UserPayload): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(this.baseUrl, this.toFormData(payload))
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: UserPayload): Observable<User> {
    const { name, email, phone, profile_ids } = payload;
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/${id}`, { name, email, phone, profile_ids })
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/pdf`, { responseType: 'blob' });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/excel`, { responseType: 'blob' });
  }

  private toUser(user: Partial<User>): User {
    return {
      ...user,
      id: user.id ?? '',
      name: user.name ?? '',
      email: user.email ?? user.user ?? '',
    };
  }

  private toFormData(payload: UserPayload): FormData {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    payload.profile_ids.forEach((id) => formData.append('profile_ids[]', id));
    if (payload.photo) {
      formData.append('photo', payload.photo);
    }
    return formData;
  }
}
