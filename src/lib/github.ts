import { CodingStatsData, ContributionHistoryData, RepositoryInfoData, GitHubUser, Repository, ContributionEvent, CommitData, ProfileRatingData } from '../types';

const GITHUB_API_URL = 'https://api.github.com';

// Helper function to make authenticated requests if a token is provided
async function githubFetch(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Use the Vite environment variable for the GitHub token
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  return response;
}

const generateMockGitHubData = (username: string) => {
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const user: GitHubUser = {
    login: username,
    avatar_url: `https://avatars.githubusercontent.com/${username}?size=200`,
    name: `${username.charAt(0).toUpperCase() + username.slice(1)} (Simulated)`,
    bio: 'This is a simulated profile generated because the GitHub API rate limit was reached. 🚀✨',
    public_repos: Math.floor(random(1) * 50) + 10,
    followers: Math.floor(random(2) * 1000),
    following: Math.floor(random(3) * 100),
    location: 'Cyber Space',
    blog: `https://${username}.dev`,
    company: '@SimulatedCorp',
    html_url: `https://github.com/${username}`
  };

  const languages = ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'HTML', 'CSS'];
  const repos: Repository[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    name: `${username}-project-${i}`,
    description: `An awesome simulated project number ${i} built with cutting edge tech.`,
    stargazers_count: Math.floor(random(i + 10) * 500),
    forks_count: Math.floor(random(i + 20) * 100),
    language: languages[Math.floor(random(i + 30) * languages.length)],
    html_url: `https://github.com/${username}/project-${i}`,
    pushed_at: new Date(Date.now() - random(i + 40) * 10000000000).toISOString(),
    fork: false,
    default_branch: 'main'
  }));

  const events: ContributionEvent[] = Array.from({ length: 20 }).map((_, i) => {
    const types = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'];
    const type = types[Math.floor(random(i + 50) * types.length)];
    return {
      id: `${i}`,
      type,
      created_at: new Date(Date.now() - random(i + 60) * 1000000000).toISOString(),
      repo: { name: `${username}/${repos[Math.floor(random(i+70) * repos.length)].name}` },
      payload: {
        action: 'opened',
        commits: type === 'PushEvent' ? [{ message: 'Update simulated code' }] : []
      }
    };
  });

  return { user, repos, events };
};

export async function fetchRepoReadme(username: string, repoName: string): Promise<string> {
  // Return a mock README for simulated repos
  if (repoName.includes('-project-')) {
    return `
<div align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Vaporwave Aesthetic" width="100%" style="border-radius: 10px; border: 4px solid #FF6AD5; box-shadow: 8px 8px 0px #94D0FF;" />
  
  <br />
  <br />

  <h1>🌌 ${repoName} 🌌</h1>
  
  <p>
    <b>A highly advanced, fully simulated repository generated in the retro-future.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge&color=FF6AD5" alt="Version" />
    <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&color=94D0FF" alt="Build" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge&color=C774E8" alt="License" />
  </p>
</div>

---

## 🚀 Overview

Welcome to **${repoName}**. This project was procedurally generated because the GitHub API rate limit was reached. It serves as a placeholder to demonstrate the capabilities of the **GitHubScope** application without requiring an API key.

> *"In the simulated world, there are no bugs. Only unexpected features."*

## ✨ Features

- **Infinite Scalability:** Since there is no actual code, this project scales infinitely with zero server costs.
- **Zero Bugs:** We guarantee a 100% bug-free experience.
- **Vaporwave Aesthetic:** Built with the finest retro-futuristic design principles.
- **Quantum Computing Ready:** Fully compatible with simulated quantum environments.

## 📊 Architecture Diagram

Below is a highly technical diagram of how this simulated project operates:

\`\`\`mermaid
graph TD;
    A[User Request] -->|Hits Rate Limit| B(Simulation Engine);
    B --> C{Generate Data};
    C -->|Creates Repos| D[Mock Repositories];
    C -->|Creates Commits| E[Mock Commits];
    C -->|Creates README| F[Mock README];
    D --> G[GitHubScope UI];
    E --> G;
    F --> G;
    G --> H[Happy User];
    
    style A fill:#FF6AD5,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#94D0FF,stroke:#333,stroke-width:2px,color:#000
    style G fill:#C774E8,stroke:#333,stroke-width:2px,color:#fff
    style H fill:#4ade80,stroke:#333,stroke-width:2px,color:#000
\`\`\`

## 💻 Code Example

Here is a snippet of the core logic powering this simulation:

\`\`\`typescript
import { Vaporwave } from '@retro/future';

class SimulatedProject {
  private aesthetic: Vaporwave;

  constructor() {
    this.aesthetic = new Vaporwave({
      colors: ['#FF6AD5', '#C774E8', '#AD8CFF', '#8795E8', '#94D0FF'],
      grid: true,
      sun: 'setting',
    });
  }

  public run(): void {
    console.log('Initializing simulation...');
    this.aesthetic.render();
    console.log('Simulation running flawlessly.');
  }
}

const project = new SimulatedProject();
project.run();
\`\`\`

## 🛠️ Installation

To install this simulated project, simply imagine it running on your local machine. No dependencies required!

\`\`\`bash
# 1. Close your eyes
# 2. Imagine the code
# 3. You're done!
\`\`\`

## 🤝 Contributing

Contributions are welcome! Since this is a simulated project, please submit your simulated pull requests via telepathy.

1. Think about a feature.
2. Imagine writing the code.
3. Send a telepathic PR to the maintainer.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
<div align="center">
  <i>Generated with 💖 by GitHubScope</i>
</div>
`;
  }

  try {
    const response = await githubFetch(`${GITHUB_API_URL}/repos/${username}/${repoName}/readme`, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
    });
    if (!response.ok) {
      if (response.status === 404) return 'NO README FOUND FOR THIS REPOSITORY.';
      throw new Error('Failed to fetch README');
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    return 'FAILED TO LOAD README.';
  }
}

export async function fetchRepoCommits(username: string, repoName: string): Promise<CommitData[]> {
  // Return mock commits for simulated repos
  if (repoName.includes('-project-')) {
    return [
      { sha: 'a1b2c3d', message: 'Initial simulated commit', date: new Date().toISOString(), url: '#', author: username, contributor: username },
      { sha: 'e4f5g6h', message: 'Added vaporwave aesthetic', date: new Date(Date.now() - 86400000).toISOString(), url: '#', author: username, contributor: username },
      { sha: 'i7j8k9l', message: 'Fixed simulated bugs', date: new Date(Date.now() - 172800000).toISOString(), url: '#', author: username, contributor: username },
    ];
  }

  try {
    const response = await githubFetch(`${GITHUB_API_URL}/repos/${username}/${repoName}/commits?per_page=3`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author.date,
      url: c.html_url,
      author: c.commit.author.name,
      contributor: c.author ? c.author.login : null,
    }));
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}

function calculateProfileRating(
  user: GitHubUser,
  repos: RepositoryInfoData[],
  events: ContributionHistoryData[]
): ProfileRatingData {
  const repoCount = repos.length || 1; // Avoid division by zero

  // 1. Biography Rating
  let bioRating = 0;
  if (user.bio && typeof user.bio === 'string') {
    const wordCount = user.bio.split(' ').length;
    bioRating = Math.min(wordCount * 10, 100);
  }

  // 2. User Popularity
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stars || 0), 0);
  const starRate = totalStars / repoCount;
  const userFollowers = user.followers || 0;
  const userPopRate = (userFollowers / repoCount) + starRate;
  const userPopularity = Math.min(parseInt((userPopRate * 15).toFixed(0), 10) || 0, 100);

  // 3. Repository Popularity
  const totalForks = repos.reduce((sum, repo) => sum + (repo.forks || 0), 0);
  const repoPopRate = (totalStars + totalForks * 1.2) / repoCount;
  const repoPopularity = Math.min(parseInt((repoPopRate * 16).toFixed(0), 10) || 0, 100);

  // 4. Repository Description
  const reposWithDesc = repos.filter(r => r.description && typeof r.description === 'string' && r.description.split(' ').length > 4).length;
  const descRate = reposWithDesc / repoCount;
  const repoDescriptionRating = Math.min(parseInt((descRate * 100).toFixed(0), 10) || 0, 100);

  // 5. Providing Web Pages
  // Proxy for now: repos with description
  const webpageRate = (reposWithDesc / repoCount) * 100;
  const webpageRating = Math.min(parseInt((webpageRate * 1.8).toFixed(0), 10) || 0, 100);

  // 6. Backlinks & Information
  const bioExists = user.bio ? 1 : 0;
  const locExists = user.location ? 1 : 0;
  const blogExists = user.blog ? 1 : 0;
  const companyExists = user.company ? 1 : 0;
  const backlinkRating = ((bioExists + locExists + blogExists + companyExists) / 4) * 100;

  const metrics = [
    { name: 'Biography', score: bioRating || 0, description: 'Length and quality of your profile bio.' },
    { name: 'User Popularity', score: userPopularity || 0, description: 'Based on followers and average repository stars.' },
    { name: 'Repository Popularity', score: repoPopularity || 0, description: 'Based on total stars and forks across repositories.' },
    { name: 'Repository Description', score: repoDescriptionRating || 0, description: 'Percentage of repositories with detailed descriptions.' },
    { name: 'Webpages & Docs', score: webpageRating || 0, description: 'Repositories providing external webpages or documentation.' },
    { name: 'Backlinks & Info', score: backlinkRating || 0, description: 'Completeness of profile information (location, blog, company).' }
  ];

  const totalScore = Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length) || 0;

  let tier = 'D';
  let title = 'VAPORWAVE NOVICE';
  let colorClass = 'text-gray-400';

  if (totalScore >= 90) {
    tier = 'S+';
    title = 'CYBERSPACE DEITY';
    colorClass = 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]';
  } else if (totalScore >= 80) {
    tier = 'S';
    title = 'NEON LEGEND';
    colorClass = 'text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]';
  } else if (totalScore >= 70) {
    tier = 'A';
    title = 'SYNTHWAVE HACKER';
    colorClass = 'text-vapor-pink drop-shadow-[0_0_10px_rgba(255,106,213,0.8)]';
  } else if (totalScore >= 50) {
    tier = 'B';
    title = 'RETRO CODER';
    colorClass = 'text-vapor-blue drop-shadow-[0_0_10px_rgba(148,208,255,0.8)]';
  } else if (totalScore >= 30) {
    tier = 'C';
    title = 'DIGITAL EXPLORER';
    colorClass = 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]';
  }

  return { tier, title, score: totalScore, colorClass, metrics };
}

export async function fetchGitHubData(username: string) {
  let user: GitHubUser;
  let repos: Repository[];
  let events: ContributionEvent[];
  let isMock = false;
  let resetTime: number | null = null;

  try {
    // Fetch user profile
    const userResponse = await githubFetch(`${GITHUB_API_URL}/users/${username}`);
    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        throw new Error('User not found');
      } else if (userResponse.status === 403 || userResponse.status === 429) {
        const resetHeader = userResponse.headers.get('X-RateLimit-Reset');
        throw new Error(`RATE_LIMIT:${resetHeader || ''}`);
      }
      throw new Error('Failed to fetch user data');
    }
    user = await userResponse.json();

    // Fetch repositories
    const reposResponse = await githubFetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=updated`);
    if (!reposResponse.ok) {
      if (reposResponse.status === 403 || reposResponse.status === 429) {
        const resetHeader = reposResponse.headers.get('X-RateLimit-Reset');
        throw new Error(`RATE_LIMIT:${resetHeader || ''}`);
      }
      throw new Error('Failed to fetch repositories');
    }
    repos = await reposResponse.json();

    // Fetch events (for contribution history)
    const eventsResponse = await githubFetch(`${GITHUB_API_URL}/users/${username}/events/public?per_page=100`);
    if (!eventsResponse.ok) {
      if (eventsResponse.status === 403 || eventsResponse.status === 429) {
        const resetHeader = eventsResponse.headers.get('X-RateLimit-Reset');
        throw new Error(`RATE_LIMIT:${resetHeader || ''}`);
      }
      throw new Error('Failed to fetch events');
    }
    events = await eventsResponse.json();
  } catch (error: any) {
    if (error.message.startsWith('RATE_LIMIT')) {
      console.warn('Rate limit exceeded. Using mock data.');
      const resetTimestamp = parseInt(error.message.split(':')[1], 10);
      if (!isNaN(resetTimestamp)) {
        resetTime = resetTimestamp;
      }
      const mockData = generateMockGitHubData(username);
      user = mockData.user;
      repos = mockData.repos;
      events = mockData.events;
      isMock = true;
    } else {
      throw error;
    }
  }

  try {
    // Process Coding Stats
    const languageCounts: Record<string, number> = {};
    let totalReposWithLanguage = 0;

    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        totalReposWithLanguage++;
      }
    });

    const codingStats: CodingStatsData[] = Object.entries(languageCounts)
      .map(([language, count]) => ({
        language,
        repoCount: count,
        percentage: (count / totalReposWithLanguage) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage); // Show all languages

    // Process Contribution History
    const contributionHistory: ContributionHistoryData[] = events
      .filter(event => ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(event.type))
      .map(event => {
        let commits = 0;
        let details = '';

        if (event.type === 'PushEvent' && event.payload.commits) {
          commits = event.payload.commits.length;
          details = event.payload.commits[0]?.message || 'Pushed commits';
        } else if (event.type === 'PullRequestEvent') {
          details = `${event.payload.action} pull request`;
          commits = 1;
        } else if (event.type === 'IssuesEvent') {
          details = `${event.payload.action} issue`;
          commits = 1;
        } else if (event.type === 'CreateEvent') {
          details = `Created repository/branch`;
          commits = 1;
        }

        return {
          id: event.id,
          date: event.created_at,
          repository: event.repo.name,
          type: event.type.replace('Event', ''),
          commits,
          details,
        };
      });

    // Process Repository Info
    const repositoryInfo: RepositoryInfoData[] = repos
      .filter(repo => !repo.fork) // Exclude forks for better representation of own work
      .sort((a, b) => b.stargazers_count - a.stargazers_count) // Sort by stars
      .map(repo => ({
        id: repo.id,
        repository_name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        last_active: repo.pushed_at,
        default_branch: repo.default_branch || 'main',
      })); // Show all non-forked repos

    const profileRating = calculateProfileRating(user, repositoryInfo, contributionHistory);

    return {
      user,
      codingStats,
      contributionHistory,
      repositoryInfo,
      profileRating,
      isMock,
      resetTime,
    };
  } catch (error: any) {
    throw error;
  }
}
