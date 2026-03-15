export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location?: string;
  blog?: string;
  company?: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  homepage?: string;
  default_branch?: string;
}

export interface ContributionEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    action?: string;
  };
}

export interface CodingStatsData {
  language: string;
  percentage: number;
  repoCount: number;
}

export interface ContributionHistoryData {
  id: string;
  date: string;
  repository: string;
  type: string;
  commits: number;
  details: string;
}

export interface RepositoryInfoData {
  id: number;
  repository_name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string;
  url: string;
  last_active: string;
  default_branch?: string;
}

export interface CommitData {
  sha: string;
  message: string;
  date: string;
  url: string;
  author: string;
  contributor: string | null;
}

export interface ProfileRatingData {
  tier: string;
  title: string;
  score: number;
  colorClass: string;
  metrics: {
    name: string;
    score: number;
    description: string;
  }[];
}

