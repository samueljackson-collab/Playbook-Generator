import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import os from 'os';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API route for Git integration
  app.post('/api/git/commit', async (req, res) => {
    const { repoUrl, commitMessage, branch, playbookContent } = req.body;
    
    if (!repoUrl || !commitMessage || !branch || !playbookContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let tempDir = '';
    try {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ansible-playbook-'));
      const baseGit = simpleGit();
      await baseGit.clone(repoUrl, tempDir);

      const git = simpleGit(tempDir);

      // Parse the playbook content and write files
      // The playbook content is separated by "--- # filename.yml"
      const files = playbookContent.split(/---\s*#\s*/).filter((f: string) => f.trim() !== '');
      
      for (const fileContent of files) {
        const lines = fileContent.split('\n');
        const filename = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        
        if (filename && content) {
          const filePath = path.join(tempDir, filename);
          // Ensure directory exists
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, content);
        }
      }

      // Checkout the branch (create if not exists)
      try {
        await git.checkout(branch);
      } catch (e) {
        await git.checkoutLocalBranch(branch);
      }

      // Add, commit, and push
      await git.add('./*');
      await git.commit(commitMessage);
      await git.push('origin', branch, ['--set-upstream']);

      res.json({ success: true, message: 'Successfully committed and pushed to repository.' });
    } catch (error) {
      console.error('Git operation failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Git operation failed' });
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
