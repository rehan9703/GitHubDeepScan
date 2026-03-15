import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Simple in-memory cache to save GitHub API requests
const cache = new Map<string, { data: string, contentType: string, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function startServer() {
  const app = express();
  const PORT = 3000;

  // GitHub API Proxy Route with Caching
  app.use('/api/github', async (req, res) => {
    try {
      const githubUrl = `https://api.github.com${req.url}`;
      
      // Check cache first
      const cachedResponse = cache.get(githubUrl);
      if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_TTL)) {
        console.log(`Serving from cache: ${githubUrl}`);
        res.setHeader('Content-Type', cachedResponse.contentType);
        res.setHeader('X-Cache', 'HIT');
        return res.send(cachedResponse.data);
      }

      console.log(`Fetching from GitHub: ${githubUrl}`);
      const headers: Record<string, string> = {
        'Accept': req.headers.accept || 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Rater-App',
      };

      // Add GitHub token if available
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const response = await fetch(githubUrl, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      });

      const data = await response.text();
      const contentType = response.headers.get('content-type') || 'application/json';
      
      // Forward status code and specific headers
      res.status(response.status);
      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Cache', 'MISS');
      
      // Only cache successful responses
      if (response.ok) {
        cache.set(githubUrl, {
          data,
          contentType,
          timestamp: Date.now()
        });
      }
      
      res.send(data);
    } catch (error) {
      console.error('GitHub Proxy Error:', error);
      res.status(500).json({ error: 'Failed to proxy request to GitHub' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
