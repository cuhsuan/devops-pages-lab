# Architecture and O-level rationale

GitHub events → TheDanniCraft/activity-log → marked README section → bot commit → Jekyll include in index.md → source/HTML checks → Pages artifact → deployment.

The activity action runs only on manual and schedule events. Pushes validate/build/deploy existing content, preventing a PAT-triggered README commit from recursively collecting activity. A workflow-level concurrency group serializes releases without cancelling an in-progress deployment. All deployment jobs use the same workflow's checked-out working tree, which contains the action's README changes.

The PAT is not used as the checkout credential. The third-party action uses it to create the README commit through the GitHub API. The runner then pulls that commit before checking and building. A PAT commit can trigger a second push run; that run only validates and deploys, without collecting again. GitHub documents that commits created by GITHUB_TOKEN do not normally trigger a new push workflow. Continuing deployment in the original run avoids relying on a second push event.

## Enhancements

1. Custom responsive layout with system-font typography, dark mode, skip navigation and reduced-motion support.
2. Daily off-minute schedule with explicit UTC/Taiwan conversion and delay/inactivity caveats.
3. Source contract checks, generated-HTML checks and mobile overflow detection before publishing.
4. Desktop/mobile screenshots saved as downloadable workflow evidence.
5. Job-scoped permissions, pinned action revisions and secret hygiene.
6. Troubleshooting documentation and an evidence checklist for reproducibility.

## Trade-offs

A daily batch is adequate for a learning portfolio and consumes less runner time than refreshing every 30 minutes. A manual trigger supports demonstrations. The action's event feed is eventually consistent and is not an audit log of every Git operation. Screenshots in the build artifact capture the generated artifact; submission also needs a live-URL screenshot after deployment.

## Sources

- https://github.com/TheDanniCraft/activity-log
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
