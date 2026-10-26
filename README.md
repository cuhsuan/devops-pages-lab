# DevOps Activity Observatory

**Owner: cuhsuan** · **Course: 115-1 軟體開發與維運 / DevOps**

A living portfolio: GitHub activity becomes Markdown, then a validated GitHub Pages site.

[Live website](https://cuhsuan.github.io/devops-pages-lab/) · [Repository](https://github.com/cuhsuan/devops-pages-lab) · [Workflow runs](https://github.com/cuhsuan/devops-pages-lab/actions/workflows/activity-log.yml)

## Recent activity

This section is maintained by TheDanniCraft/activity-log. It displays up to eight recent supported events. GitHub's event feed may lag behind a new commit.

<!--START_SECTION:activity-->
1. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/6929f333821a2879b76576143b01f9c53ac1d68f)
2. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/993fda2f6c4d38d04218139d75158f004a5dc05f)
3. 🎉 Created a new branch main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/tree/main)
4. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/5fbfafead0888c10c89289c77b39ef8db9564e93)
5. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/0ee3b314f41e90b475f6c93b1eb07f571e031a52)
6. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/3a0584f5a45efc4a8eba97f8e92ec79dc1e88e88)
7. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/fbc0c81879d9226595c105ace28b015c6aa229d7)
8. 📝 Committed to main in [cuhsuan/assignment5-automated-testing](https://github.com/cuhsuan/assignment5-automated-testing/commit/d74e19e0946bfbb129ac4620bdf17b06f12ca45e)
<!--END_SECTION:activity-->

## From activity to a published page

1. **Collect** — a manual run or daily schedule retrieves the owner's activity.
2. **Transform** — the action replaces only the marked README section and commits its update.
3. **Validate** — Python checks the markers, nonempty generated content, homepage include, local links and required files.
4. **Build** — Jekyll expands the relative README include in `index.md` and renders Markdown as HTML.
5. **Deploy** — GitHub Actions publishes the checked artifact to GitHub Pages.

## Engineering choices

| Enhancement | Purpose |
| --- | --- |
| Responsive custom layout | Clear desktop/mobile reading, dark-mode support and accessible navigation |
| Daily refresh at 00:17 UTC | 08:17 in Taiwan; one refresh per day fits a coursework portfolio and avoids minute zero |
| Manual refresh | Demonstrate updates without waiting for tomorrow's schedule |
| Build and deployment in the same workflow | Publish the updated working tree even when a bot commit does not trigger another workflow |
| Verification before publication | Stop on missing markers, empty output or a broken README include |
| HTML validation and screenshots | Check generated output and retain reproducible visual evidence |
| Pinned action revisions | Resolve dependencies to reviewed commit IDs instead of moving tags |

Schedules can be delayed by GitHub and are not an exact-time service. Inactive public repositories can have scheduled workflows disabled after 60 days. Refresh runs skip committing when activity has not changed.

## Reproduce and maintain

See [setup and troubleshooting](https://github.com/cuhsuan/devops-pages-lab/blob/main/docs/setup.md), [architecture and scheduling](https://github.com/cuhsuan/devops-pages-lab/blob/main/docs/architecture.md), and the [evidence checklist](https://github.com/cuhsuan/devops-pages-lab/blob/main/evidence/README.md).

Only public activity is intended for this coursework site. Use a dedicated expiring PAT stored as the repository secret `TOKEN`; do not put credentials in files or screenshots. The workflow requests only the job permissions it needs. The repository remains public so the grader can inspect the source and workflow history.

### Local source validation

```sh
python scripts/validate.py
```

This source check requires only Python 3.11+. The full Jekyll build, generated HTML check and browser screenshots run on GitHub Actions.

## References

- [TheDanniCraft/activity-log documentation](https://github.com/TheDanniCraft/activity-log)
- [GitHub Pages with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [Workflow triggering and GITHUB_TOKEN](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
- [Scheduled workflow behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
