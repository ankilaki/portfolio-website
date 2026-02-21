export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  githubUrls: string[];
  liveUrl?: string;
  tags: string[];
  technologies: string[];
  media: MediaItem[];
  featured: boolean;
  featuredOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface Resume {
  id: string;
  title: string;
  domain: ResumeDomain;
  description: string;
  fileUrl: string;
  fileName: string;
  updatedAt: number;
}

export type ResumeDomain =
  | "Robotics"
  | "AI / Machine Learning"
  | "Embedded / Devices"
  | "Software Engineering"
  | "General";
