# Setup and troubleshooting

## One-time GitHub settings

1. Keep `cuhsuan/devops-pages-lab` public for grader access.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Create a dedicated, expiring classic PAT for this assignment. For public-only activity, use only the public repository access needed by the action; do not select `repo` merely to include private history. The token belongs to `cuhsuan`. Keep the value out of screenshots and chat.
4. Settings → Secrets and variables → Actions → New repository secret: name **TOKEN**, value your PAT.
5. Actions → **Activity → Pages** → Run workflow → main.
6. Wait for update, build and deploy to pass. Open the environment URL and confirm activity appears.

The activity action uses `TOKEN` for account activity access and for creating the README commit through the GitHub API, so public_repo access is required for this public repository. Checkout does not persist credentials. After the API update, the runner pulls the new commit before validation and building. The workflow fails clearly if TOKEN is missing. Never paste a token into source code, a report or an issue.

## Evidence to submit

Record the public homepage URL, repository URL, a specific successful workflow run URL and the bot's README update commit URL. Download `site-evidence` from that run for desktop and mobile screenshots. Write the final 6-10 page report using those real results.

## Maintenance

- Scheduled execution: `17 0 * * *`, meaning daily at 00:17 UTC / 08:17 Asia/Taipei. GitHub may delay execution, and scheduled workflows in inactive public repos can be disabled after 60 days.
- Rotate TOKEN before expiry. Replacing the secret does not require a code change.
- A no-change activity run may deploy successfully without a new commit. Use the first actual README update as submission evidence.
- After a failed run, open its failed step. Fix the cause and manually rerun; the last successful Pages deployment remains the published version.
- Activity feed updates can be delayed. The action only displays supported event types.
- Third-party action revisions are pinned; periodically review upstream changes before updating.

## Common failures

| Symptom | Check |
| --- | --- |
| Missing TOKEN | Add a repository Actions secret named exactly TOKEN |
| Activity API 401 | Token expiry, owner, and allowed API access |
| README API write 403 | PAT public_repo permission, repository access, branch protection |
| Pages deployment 404/403 | Pages source = GitHub Actions; Pages/environment permissions |
| Homepage lacks the latest events | Check latest successful run and event-feed delay; a no-change run is valid |
| Source README appears as raw text | Confirm index.md front matter, Liquid include and Jekyll build step |

## Local check

`python scripts/validate.py` checks source without secrets. The workflow additionally performs a Jekyll build, validates generated HTML, captures browser screenshots and checks horizontal overflow at mobile width.
