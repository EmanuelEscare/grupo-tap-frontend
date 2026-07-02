import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, getCollectionData } from '../../core/models/api-response.model';
import { Product, ProductPayload } from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  list(): Observable<Product[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(map((response) => getCollectionData<Product>(response, 'products')));
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.baseUrl, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: ProductPayload): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.baseUrl}/${id}`, payload)
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
