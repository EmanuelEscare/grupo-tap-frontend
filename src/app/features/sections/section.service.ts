import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getCollectionData } from '../../core/models/api-response.model';
import { Section } from '../../core/models/section.model';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sections`;

  list(): Observable<Section[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(map((response) => getCollectionData<Section>(response, 'sections')));
  }
}
