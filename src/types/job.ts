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
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
