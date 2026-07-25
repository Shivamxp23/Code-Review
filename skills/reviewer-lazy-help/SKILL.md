---
name: reviewer-lazy-help
description: >
  Quick-reference card for all Reviewer modes, skills, and commands.
  One-shot display, not a persistent mode. Trigger: /reviewer-lazy-help,
  "Reviewer help", "what Reviewer commands", "how do I use Reviewer".
---

# Reviewer Help

Display this reference card when invoked. One-shot, do NOT change mode,
write flag files, or persist anything.

## Levels

| Level | Trigger | What change |
|-------|---------|-------------|
| **Lite** | `/reviewer-lazy lite` | Build what's asked, name the lazier alternative in one line. |
| **Full** | `/reviewer-lazy` | The ladder enforced: YAGNI → stdlib → native → one line → minimum. Default. |
| **Ultra** | `/reviewer-lazy ultra` | YAGNI extremist. Deletion before addition. Challenges requirements before building. |

Level sticks until changed or session end.

## Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **Reviewer** | `/reviewer-lazy` | Lazy mode itself. Simplest solution that works. |
| **Reviewer-review** | `/reviewer-lazy-review` | Over-engineering review: `L42: yagni: factory, one product. Inline.` |
| **Reviewer-audit** | `/reviewer-lazy-audit` | Whole-repo over-engineering audit: ranked list of what to delete. |
| **Reviewer-debt** | `/reviewer-lazy-debt` | Harvest `Reviewer:` shortcut comments into a tracked ledger. |
| **Reviewer-gain** | `/reviewer-lazy-gain` | Measured-impact scoreboard: less code, less cost, more speed. |
| **Reviewer-help** | `/reviewer-lazy-help` | This card. |

Codex uses `@Reviewer`, `@Reviewer-review`, and `@Reviewer-help`; Claude Code
and OpenCode use the slash-command forms above (OpenCode ships all six as
slash commands).

## Deactivate

Say "stop Reviewer" or "normal mode". Resume anytime with `/reviewer-lazy`.
`/reviewer-lazy off` also works.

## Configure Default Mode

Default mode = `full`, auto-active every session. Change it:

**Environment variable** (highest priority):
```bash
export Reviewer_DEFAULT_MODE=ultra
```

**Config file** (`~/.config/reviewer-lazy/config.json`, Windows: `%APPDATA%\Reviewer\config.json`):
```json
{ "defaultMode": "lite" }
```

Set `"off"` to disable auto-activation on session start, activate manually
with `/reviewer-lazy` when wanted.

Resolution: env var > config file > `full`.

## Update

Enable auto-update once: open `/plugin`, go to Marketplaces, pick Reviewer, Enable auto-update. Claude Code then pulls new versions at startup (run `/reload-plugins` when it prompts). Manual refresh: `/plugin marketplace update Reviewer` then `/reload-plugins`.

If `/plugin` is not recognized, your Claude Code is out of date. Update it (`npm install -g @anthropic-ai/claude-code@latest`, or `brew upgrade claude-code`) and restart. Other hosts use their own update flow.

## More

Full docs + examples: https://github.com/DietrichGebert/reviewer-lazy
