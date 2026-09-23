import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApplicationsService } from '../../core/services/applications';
import { ApplicationStatus, JobApplication } from '../../shared/models/job-applications.model';

@Component({
  selector: 'app-applications',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {
  private readonly applicationsService = inject(ApplicationsService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  currentPage = 1;
  pageSize = 5;

  totalApplications = 0;
  totalPages = 1;

  hasNextPage = false;
  hasPrevPage = false;
  applicationToDelete: JobApplication | null = null;

  applications: JobApplication[] = [];

  isLoading = false;
  isSaving = false;

  deletingId: string | number | null = null;
  editingApplicationId: string | number | null = null;

  errorMessage = '';

  searchTerm = '';
  selectedStatus = 'all';

  isEditOpen = false;

  editForm = this.fb.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    status: ['applied' as ApplicationStatus, Validators.required],
    vacancyUrl: [''],
    appliedDate: ['', Validators.required],
    technologies: [''],
    salary: [null as number | null],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadApplications();
  }

  get filteredApplications(): JobApplication[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.applications.filter((application) => {
      const matchesStatus =
        this.selectedStatus === 'all' || application.status === this.selectedStatus;

      const matchesSearch =
        !search ||
        application.company.toLowerCase().includes(search) ||
        application.position.toLowerCase().includes(search) ||
        application.technologies.some((technology) => technology.toLowerCase().includes(search));

      return matchesStatus && matchesSearch;
    });
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.applicationsService
      .getAll(this.currentPage, this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.applications = response.data;

          this.currentPage = response.pagination.page;
          this.totalApplications = response.pagination.total;
          this.totalPages = response.pagination.totalPages;

          this.hasNextPage = response.pagination.hasNextPage;
          this.hasPrevPage = response.pagination.hasPrevPage;
        },

        error: (error) => {
          this.errorMessage = 'Failed to load applications.';
          console.error(error);
        },
      });
  }
  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.currentPage++;
    this.loadApplications();
  }

  previousPage(): void {
    if (!this.hasPrevPage) {
      return;
    }

    this.currentPage--;
    this.loadApplications();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadApplications();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  openEdit(application: JobApplication): void {
    if (application.id == null) {
      return;
    }

    this.editingApplicationId = application.id;

    this.editForm.patchValue({
      company: application.company,
      position: application.position,
      status: application.status,
      vacancyUrl: application.vacancyUrl ?? '',
      appliedDate: application.appliedDate,
      technologies: application.technologies.join(', '),
      salary: application.salary ?? null,
      notes: application.notes ?? '',
    });

    this.isEditOpen = true;
  }

  closeEdit(): void {
    if (this.isSaving) {
      return;
    }

    this.isEditOpen = false;
    this.editingApplicationId = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (this.editForm.invalid || this.editingApplicationId == null) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.getRawValue();

    const updatedApplication: Partial<JobApplication> = {
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

    const id = this.editingApplicationId;

    this.isSaving = true;

    this.applicationsService
      .update(id, updatedApplication)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (updated) => {
          this.applications = this.applications.map((application) =>
            application.id === id ? updated : application,
          );

          this.isEditOpen = false;
          this.editingApplicationId = null;
        },

        error: (error) => {
          console.error(error);
          this.errorMessage = 'Failed to update application.';
        },
      });
  }

  openDelete(application: JobApplication): void {
    this.applicationToDelete = application;
  }

  closeDelete(): void {
    if (this.deletingId !== null) {
      return;
    }

    this.applicationToDelete = null;
  }

  confirmDelete(): void {
    if (!this.applicationToDelete || this.applicationToDelete.id === undefined) {
      return;
    }

    const id = this.applicationToDelete.id;

    this.deletingId = id;
    this.errorMessage = '';

    this.applicationsService
      .delete(id)
      .pipe(
        finalize(() => {
          this.deletingId = null;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          if (this.applications.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }

          this.applicationToDelete = null;
          this.loadApplications();
        },

        error: (error) => {
          this.errorMessage = 'Failed to delete application.';
          console.error(error);
        },
      });
  }
}
