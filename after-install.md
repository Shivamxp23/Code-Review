# reviewer-lazy for Hermes installed

Enable it if you did not install with `--enable`:

```bash
hermes plugins enable reviewer-lazy
```

Restart Hermes or the gateway after enabling.

In shared gateways, restrict `/reviewer-lazy` to trusted users with Hermes slash-command access controls; runtime mode is process-local.

Commands:

- `/reviewer-lazy [lite|full|ultra|off]`
- `/reviewer-lazy-review [target]`
- `/reviewer-lazy-audit [target]`
- `/reviewer-lazy-debt`
- `/reviewer-lazy-gain`
- `/reviewer-lazy-help`

Bundled skills are available as `reviewer-lazy:reviewer-lazy`, `reviewer-lazy:reviewer-lazy-review`, `reviewer-lazy:reviewer-lazy-audit`, `reviewer-lazy:reviewer-lazy-debt`, `reviewer-lazy:reviewer-lazy-gain`, and `reviewer-lazy:reviewer-lazy-help`.
