import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import os from 'os';

// API key used to authenticate requests to sensitive Git integration routes.
// If unset, auth is treated as disabled (local dev convenience) and a warning is logged at startup.
const API_KEY = process.env.API_KEY;

// Comma-separated allowlist of git remote hostnames that /api/git/commit is permitted to
// clone/push to. Defaults to github.com if unset.
const ALLOWED_GIT_HOSTS = (process.env.ALLOWED_GIT_HOSTS || 'github.com')
  .split(',')
  .map((h) => h.trim().toLowerCase())
  .filter((h) => h.length > 0);

function isAllowedRepoHost(repoUrl: string): boolean {
  try {
    // Support both URL-style (https://github.com/...) and SCP-style (git@github.com:...) remotes.
    const scpMatch = repoUrl.match(/^[^@]+@([^:/]+)[:/]/);
    const hostname = scpMatch ? scpMatch[1].toLowerCase() : new URL(repoUrl).hostname.toLowerCase();
    return ALLOWED_GIT_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  if (!API_KEY) {
    console.warn(
      'WARNING: API_KEY is not set. /api/git/commit authentication is DISABLED. ' +
        'Set the API_KEY environment variable to require X-API-Key auth in non-local environments.'
    );
  }

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API route for Git integration
  app.post('/api/git/commit', async (req, res) => {
    // Minimal API-key auth: if API_KEY is configured, require a matching X-API-Key header.
    if (API_KEY) {
      const providedKey = req.header('X-API-Key');
      if (!providedKey || providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: missing or invalid X-API-Key header' });
      }
    }

    const { repoUrl, commitMessage, branch, playbookContent } = req.body;

    if (!repoUrl || !commitMessage || !branch || !playbookContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isAllowedRepoHost(repoUrl)) {
      return res.status(400).json({
        error: `Disallowed repository host. Allowed hosts: ${ALLOWED_GIT_HOSTS.join(', ')}`,
      });
    }

    let tempDir = '';
    try {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ansible-playbook-'));
      const baseGit = simpleGit();
      // NOTE: Private repositories are not supported via in-app credentials. Cloning/pushing to
      // private repos requires SSH keys (or a credential helper) to already be configured in the
      // runtime environment running this server — this is expected/documented behavior, not a bug.
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
