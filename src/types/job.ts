export interface Job {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  shortDescription: string;
  fullDescription: string;
  category: string;
  jobType: string;
  workMode: string;
  location: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  applicationDeadline: string;
  skills: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export type JobSortOption =
  | "newest"
  | "oldest"
  | "salary-low"
  | "salary-high"
  | "deadline";
  
export interface PublicJobFilters {
  search: string;
  category: string;
  location: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  sort: JobSortOption;
  page: number;
}

export interface JobsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PublicJobsResponse {
  success: boolean;
  message: string;
  data: Job[];
  pagination: JobsPagination;
}

export interface JobDetailsData {
  job: Job;
  relatedJobs: Job[];
}

export interface JobDetailsResponse {
  success: boolean;
  message: string;
  data: JobDetailsData;
}