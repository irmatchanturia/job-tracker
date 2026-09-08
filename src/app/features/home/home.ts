import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobApplication } from '../../shared/models/job-applications.model';
import { ApplicationsService } from '../../core/services/applications';
import { finalize } from 'rxjs';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  constructor(private readonly applicationsService: ApplicationsService) {}

  stats = {
    total: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    applied: 0,
  };

  recentApplications: JobApplication[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.applicationsService
      .getAll()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.errorMessage = '';
          this.recentApplications = response.data;
          this.stats.total = response.pagination.total;
          this.stats.interviews = response.data.filter(
            (application) => application.status === 'interview',
          ).length;
          this.stats.offers = response.data.filter(
            (application) => application.status === 'offer',
          ).length;
          this.stats.rejected = response.data.filter(
            (application) => application.status === 'rejected',
          ).length;
          this.stats.applied = response.data.filter(
            (application) => application.status === 'applied',
          ).length;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load applications.';
          console.error(error);
        },
      });
  }
}
