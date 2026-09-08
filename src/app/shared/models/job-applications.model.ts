export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';
export interface JobApplication {
  id?: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  vacancyUrl?: string;
  appliedDate: string;
  technologies: string[];
  salary?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApplicationsResponse {
  data: JobApplication[];
  pagination: Pagination;
}
