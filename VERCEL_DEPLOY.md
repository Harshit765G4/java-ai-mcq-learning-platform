# Deploy Advanced Python Prep to Vercel

This project is a static HTML, CSS, and JavaScript application. It does not need React, a Node build step, environment variables, an API server, or a database for its current features.

## Option A — Deploy with GitHub (recommended)

1. Extract the project ZIP.
2. Open the `advanced-python-quiz` folder itself in VS Code. The `index.html`, `assets/`, and `data/` entries must be directly inside this folder.
3. Create an empty GitHub repository.
4. Open a terminal in this `advanced-python-quiz` folder and run:

   ```bash
   git init
   git add .
   git commit -m "Initial Advanced Python Prep release"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   Replace the remote URL with your repository's actual URL.

5. Sign in to Vercel and choose **Add New → Project**.
6. Import the GitHub repository you just created and continue to Configure Project.
7. Use these settings:

   | Vercel setting | Value |
   |---|---|
   | Framework Preset | Other |
   | Root Directory | `./` (the folder containing `index.html`) |
   | Build Command | Leave empty / no build step |
   | Output Directory | `.` (project root); if Vercel pre-fills a value, verify it serves the root `index.html` |
   | Install Command | Leave empty |

8. Click **Deploy**. When deployment completes, open the generated `*.vercel.app` URL.

Vercel's static-site configuration for projects without a build step uses the `Other` framework preset and serves files from the project root when there is no `public/` directory.

## Option B — Deploy from your computer with Vercel CLI

Prerequisite: Node.js and npm installed.

1. Extract the ZIP and open a terminal inside the `advanced-python-quiz` folder (the folder containing `index.html`).
2. Install and authenticate the Vercel CLI:

   ```bash
   npm install -g vercel
   vercel login
   ```

3. Create a preview deployment:

   ```bash
   vercel
   ```

4. Follow the prompts to select your Vercel account/team and create or link a project. Use `Other` if asked for a framework, and keep the project root as the output location with no build command.
5. Open the preview URL and test the app.
6. When ready to publish to production, run:

   ```bash
   vercel --prod
   ```

## Important project details

- Keep `index.html`, `assets/`, and `data/` together at the deployed project root. The page loads `assets/styles.css`, `assets/app.js`, `data/meta.js`, `data/questions.js`, and `data/references.js` using relative paths.
- The generated JavaScript files are included in this release. Vercel can serve them directly; you do not need to run the Python scripts during deployment.
- When editing questions, edit `data/questions.json`, then run `python scripts/validate_bank.py` and `python scripts/sync_data.py`. Commit and push the changed JSON and generated JS files to GitHub; Vercel will deploy the new version automatically when Git integration is enabled.
- The current app stores practice progress in browser `localStorage`. It is not a shared, server-side account system. Each browser/device has its own progress. The deployed Vercel domain has a different storage origin from `localhost`; export progress before moving and import it after opening the deployed app.
- No API keys or environment variables are required for the current static app.

## Deployment smoke test

After deployment, verify:

1. The home page loads without a 404.
2. All three banks show 300 / 100 / 100 questions (500 total).
3. A question can be answered and checked; score and explanation update.
4. Hint and Reference panels open.
5. Timer and Focus mode work.
6. Export and Import progress work.
7. Refreshing the browser retains progress in the same browser profile.

If the page loads without styling or questions, check that the deployed root contains the `assets/` and `data/` folders and that the Vercel Root Directory points to the folder containing `index.html`.
