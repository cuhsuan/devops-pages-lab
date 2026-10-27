# Release safety

## Selected technique: a gate before deployment

The deploy job requires the build job to succeed. Build validates the README marker contract, checks Jekyll output and runs desktop/mobile browser checks before uploading the Pages artifact. This gives a static coursework website a reproducible publication gate without a separate hosting environment.

The gate is exercised with a deliberate missing README end marker on main. A failed source validation must skip deploy and verify-live, leaving the last successfully deployed site available. Restoring the marker and pushing a repair commit must pass the same checks and publish the repaired version. The report records the actual failed and successful workflow URLs rather than treating the workflow definition as proof.

## Version-aware smoke test

After any activity update, build records the checked-out commit with `git rev-parse HEAD`. It creates `version.txt` before Jekyll runs and writes that SHA into homepage metadata. The SHA is also exported as a job output.

The live verification job checks out that exact commit and requires both the public `version.txt` and the homepage's `build-commit` metadata to match it. HTTP 200 and the correct title alone cannot establish that a new deployment is live. Browser checks run at desktop and mobile widths, with bounded retries for propagation delays. Version-file requests use a unique query to avoid stale cache results.

## Limits

- There is no staging environment, canary rollout or automatic rollback.
- The gate blocks defects covered by its checks; it does not verify every external link, application behavior or security property.
- A post-deployment failure signals a problem after publication and needs investigation and a repair deployment.
- This demonstration temporarily puts invalid content on main. A deployment gate does not provide branch protection or prevent faulty commits from entering main.
- A successful scheduled run can produce no activity commit if the event list is unchanged.

The evidence compares public HTTP status, published SHA and full HTML SHA-256 before and after the deliberate failed run. Identical before/after values demonstrate that this candidate did not replace the live site; they are not evidence of an automatic rollback.

## Verified fault-injection evidence (27 October 2026)

- Baseline: https://github.com/cuhsuan/devops-pages-lab/actions/runs/40490043446
- Deliberate failure: https://github.com/cuhsuan/devops-pages-lab/actions/runs/40490384285
- Failed source commit: 35c13adb16a41a7c7f679c9987ed38cb870a1811
- Failure: missing end marker; build failed, deploy and verify-live were skipped.
- Public status before and after: HTTP 200.
- Preserved version: 32477fb6e137bf87413d3a6ff0fbba7902b49876
- Full HTML SHA-256 before and after: 7ede37b99014e9f6e135db923408ef15136bbbfdb9ae70d0b9fe4dd4557d651d

The repair commit restores the marker and adds this documentation. Its push run is the recovery demonstration; the final report records that exact run and its version comparison.
