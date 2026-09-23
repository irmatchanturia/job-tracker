import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ApplicationsService } from '../../core/services/applications';
import { ApplicationStatus, JobApplication } from '../../shared/models/job-applications.model';

@Component({
  selector: 'app-add-application',
  imports: [ReactiveFormsModule],
  templateUrl: './add-application.html',
  styleUrl: './add-application.css',
})
export class AddApplication {
  private readonly fb = inject(FormBuilder);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  applicationForm = this.fb.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    status: ['applied' as ApplicationStatus, Validators.required],
    vacancyUrl: [''],
    appliedDate: ['', Validators.required],
    technologies: [''],
    salary: [null as number | null],
    notes: [''],
  });

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    const formValue = this.applicationForm.getRawValue();

    const application: JobApplication = {
      company: formValue.company ?? '',
      position: formValue.position ?? '',
      status: formValue.status ?? 'applied',
      appliedDate: formValue.appliedDate ?? '',

      technologies: (formValue.technologies ?? '')
        .split(',')
        .map((technology) => technology.trim())
        .filter((technology) => technology.length > 0),

      vacancyUrl: formValue.vacancyUrl || undefined,
      salary: formValue.salary ?? undefined,
      notes: formValue.notes || undefined,
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.applicationsService
      .create(application)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/applications']);
        },

        error: (error) => {
          this.errorMessage = 'Failed to create application.';
          console.error(error);
        },
      });
  }
  onCancel(): void {
    this.router.navigate(['/applications']);
  }
}
