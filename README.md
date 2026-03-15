# 🌌 GitHubScope

A retro-futuristic, vaporwave-themed GitHub profile analyzer built with React, Tailwind CSS, and Framer Motion. This application fetches data from the GitHub API and presents it in a highly stylized, interactive dashboard.

## ✨ Features

- **Profile Rating**: Calculates a unique "Vaporwave Tier" (e.g., CYBERSPACE DEITY, SYNTHWAVE HACKER) based on your GitHub activity, followers, and repository metrics.
- **Coding Stats**: Visualizes your most-used programming languages using a custom-styled pie chart.
- **Contribution History**: Displays a timeline of your recent GitHub events (pushes, pull requests, issues).
- **Repository Info**: Showcases your repositories with details like stars, forks, and languages. Includes a "Read More" toggle for long descriptions and an expandable view to see recent commits and README contents.
- **Responsive Design**: Fully optimized for both desktop and mobile viewing.
- **Error Boundaries**: Gracefully handles API failures or rendering errors with custom vaporwave-themed error screens.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS (with custom vaporwave theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Markdown**: React Markdown (with GFM support)

## 🚀 Getting Started (Local Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your GitHub Personal Access Token to avoid API rate limits:
   ```env
   VITE_GITHUB_TOKEN=your_github_personal_access_token_here
   ```
   *Note: Generate a classic token with `public_repo` and `read:user` scopes from your GitHub Developer Settings.*

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌍 Deployment Guides

This project is configured as a pure Single Page Application (SPA) and is ready to be deployed on any major static hosting platform.

### ▲ Vercel
Vercel is the easiest way to deploy this app. A `vercel.json` file is already included to handle SPA routing.
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Vercel will automatically detect Vite and configure the build settings (`npm run build`, output directory: `dist`).
4. **Important**: Go to the "Environment Variables" section in your Vercel project settings and add `VITE_GITHUB_TOKEN` with your GitHub PAT.
5. Click **Deploy**.

### 💠 Netlify
A `netlify.toml` file is included to handle build commands and SPA routing redirects.
1. Push your code to a GitHub repository.
2. Go to [Netlify](https://www.netlify.com/) and import your repository.
3. The build settings will be automatically picked up from `netlify.toml`.
4. **Important**: Go to "Site settings" > "Environment variables" and add `VITE_GITHUB_TOKEN`.
5. Click **Deploy Site**.

### 🚂 Railway
1. Push your code to GitHub.
2. Go to [Railway](https://railway.app/) and create a new project from your GitHub repo.
3. Railway will detect the Node.js environment.
4. Go to the "Variables" tab and add `VITE_GITHUB_TOKEN`.
5. Railway will run `npm run build` and `npm start` (which uses the included Express server to serve the static files).

### ☁️ Render
1. Push your code to GitHub.
2. Go to [Render](https://render.com/) and create a new "Web Service".
3. Connect your repository.
4. Set the Build Command to `npm install && npm run build`.
5. Set the Start Command to `npm start`.
6. Add `VITE_GITHUB_TOKEN` in the "Environment" tab.
7. Click **Create Web Service**.

## 🔒 API Rate Limits & `VITE_GITHUB_TOKEN`

By default, the GitHub API limits unauthenticated requests to 60 per hour. If you exceed this limit, the app will automatically fall back to "Simulation Mode" and generate mock data.

To unlock **5,000 requests per hour**, you must provide a GitHub Personal Access Token via the `VITE_GITHUB_TOKEN` environment variable. 
- Since this token is exposed to the client (Vite prefix), **DO NOT** use a token with write access or access to private repositories. 
- Create a fine-grained token with **Read-only** access to public data, or a classic token with no scopes selected (which grants read-only access to public information).

## 📄 License

MIT License
