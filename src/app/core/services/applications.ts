import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationsResponse, JobApplication } from '../../shared/models/job-applications.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://playground.nileslabs.com/api/v1/custom/applications';

  getAll(page: number = 1, limit: number = 5): Observable<ApplicationsResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<ApplicationsResponse>(this.apiUrl, {
      params,
      withCredentials: true,
    });
  }

  create(application: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, application, {
      withCredentials: true,
    });
  }

  update(id: string | number, application: Partial<JobApplication>): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${id}`, application, {
      withCredentials: true,
    });
  }

  delete(id: string | number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
