import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import os from 'os';

// In-memory rate limiter: 5 Git operations per minute per IP\nconst gitRateLimiter = new Map<string, { count: number; reset: number }>();\n\n// Periodically clean up expired rate limit entries to prevent memory leaks\nsetInterval(() => {\n  const now = Date.now();\n  for (const [ip, entry] of gitRateLimiter.entries()) {\n    if (now > entry.reset) {\n      gitRateLimiter.delete(ip);\n    }\n  }\n}, 60_000).unref();

function checkGitRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = gitRateLimiter.get(ip);
  if (!entry || now > entry.reset) {
    gitRateLimiter.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function isValidGitRepoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const allowedHosts = ['github.com', 'gitlab.com', 'bitbucket.org'];
    return allowedHosts.some(
      h => parsed.hostname === h || parsed.hostname.endsWith('.' + h)
    );
  } catch {
    return false;
  }
}

function sanitizeGitBranch(branch: string): string {
  return branch.replace(/[^a-zA-Z0-9/_.\.\-]/g, '').slice(0, 100);
}

function sanitizeCommitMessage(msg: string): string {
  return msg.replace(/[`$\\;|&<>\n\r]/g, '').trim().slice(0, 500);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API route for Git integration
  app.post('/api/git/commit', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!checkGitRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many Git operations. Please wait before trying again.' });
    }

    const { repoUrl, commitMessage, branch, playbookContent } = req.body;

    if (!repoUrl || !commitMessage || !branch || !playbookContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidGitRepoUrl(repoUrl)) {
      return res.status(400).json({
        error: 'Invalid repository URL. Only https:// URLs from github.com, gitlab.com, or bitbucket.org are allowed.'
      });
    }

    const safeBranch = sanitizeGitBranch(branch);
    if (!safeBranch) {
      return res.status(400).json({ error: 'Invalid branch name' });
    }

    const safeMessage = sanitizeCommitMessage(commitMessage);
    if (!safeMessage) {
      return res.status(400).json({ error: 'Invalid commit message' });
    }

    let tempDir = '';
    try {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ansible-playbook-'));
      const baseGit = simpleGit();
      await baseGit.clone(repoUrl, tempDir);

      const git = simpleGit(tempDir);

      // Parse playbook content separated by "--- # filename.yml"
      const files = playbookContent.split(/---\s*#\s*/).filter((f: string) => f.trim() !== '');

      for (const fileContent of files) {
        const lines = fileContent.split('\n');
        const filename = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();

        if (filename && content) {
          const filePath = path.join(tempDir, filename);
          // Prevent path traversal
          const safePath = path.resolve(filePath);
          if (!safePath.startsWith(path.resolve(tempDir) + path.sep)) {
            return res.status(400).json({ error: 'Invalid filename: path traversal detected' });
          }
          await fs.mkdir(path.dirname(safePath), { recursive: true });
          await fs.writeFile(safePath, content);
        }
      }

      // Checkout the branch (create if not exists)
      try {
        await git.checkout(safeBranch);
      } catch (e) {
        await git.checkoutLocalBranch(safeBranch);
      }

      // Add, commit, and push
      await git.add('./*');
      await git.commit(safeMessage);
      await git.push('origin', safeBranch, ['--set-upstream']);

      res.json({ success: true, message: 'Successfully committed and pushed to repository.' });
    } catch (error) {
      console.error('Git operation failed:', error);
      res.status(500).json({
        error: 'Git operation failed. Verify the repository URL is accessible and credentials are configured.'
      });
    } finally {
      if (tempDir) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (e) {
          console.error('Failed to clean up temp directory:', e);
        }
      }
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
