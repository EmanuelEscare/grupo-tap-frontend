import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, getCollectionData } from '../../core/models/api-response.model';
import { Profile, ProfilePayload } from '../../core/models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  list(): Observable<Profile[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(map((response) => getCollectionData<Profile>(response, 'profiles')));
  }

  create(payload: ProfilePayload): Observable<Profile> {
    return this.http
      .post<ApiResponse<Profile>>(this.baseUrl, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: ProfilePayload): Observable<Profile> {
    return this.http
      .put<ApiResponse<Profile>>(`${this.baseUrl}/${id}`, payload)
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
}
