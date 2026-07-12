---
name: Git push auth vs GitHub connector
description: The generic GitHub connector/integration is a separate credential from whatever the git-remote push tool uses; reconnecting one does not fix the other.
---

- When `gitPush` fails with `PUSH_REJECTED` repeatedly, and the repo state is otherwise clean (fast-forward possible, no real merge conflict), suspect a stale/broken git credential tied to the origin remote specifically — not the generic GitHub connector used for API access (Octokit-style proxy).
- Reconnecting/adding the GitHub connector via `ProposeIntegration` does **not** fix this — that connector is for GitHub API calls, not git push auth.
- Working fallback: request a GitHub Personal Access Token (fine-grained, repo-scoped, Contents: read/write) as a secret via `requestSecrets`, then push directly with `git push https://x-access-token:${GITHUB_TOKEN}@github.com/<owner>/<repo> <branch>`, piping output through `sed` to redact the token from any echoed error text.
