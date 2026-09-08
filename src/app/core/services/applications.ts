import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationsResponse, JobApplication } from '../../shared/models/job-applications.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private readonly apiUrl = 'https://playground.nileslabs.com/api/v1/custom/applications';
  constructor(private readonly http: HttpClient) {}
  getAll() {
    return this.http.get<ApplicationsResponse>(this.apiUrl);
  }
  create(application: JobApplication) {
    return this.http.post<JobApplication>(this.apiUrl, application);
  }
}
