<h1 align="center">Reviewer</h1>

<p align="center">
  <strong>A unified code review, codebase understanding, and security audit skill for AI coding assistants.</strong>
  <br />
  <em>Works with Claude Code, Codex, Cursor, Copilot, Gemini CLI, Windsurf, Kiro, Cline, Qodo, OpenCode, OpenClaw, and more.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#commands">Commands</a> •
  <a href="#harness-support">Harness Support</a>
</p>

---

## Overview

**Reviewer** is a merged skill that combines three powerful tools into one:

| Component | Origin | Purpose |
|-----------|--------|---------|
| `reviewer-*` | Understand Anything | Deep codebase analysis, knowledge graphs, interactive exploration |
| `reviewer-lazy-*` | Ponytail | Fast, opinionated code reviews with a "lazy senior dev" persona |
| `reviewer-security` | Claude Code Security Audit | OWASP-aligned security auditing with HTML reports |

## Features

### Codebase Understanding (`/reviewer`)
- **Interactive Knowledge Graphs** — Map any codebase into a navigable knowledge graph
- **Domain Modeling** (`/reviewer-domain`) — Extract bounded contexts, aggregates, and domain events
- **Codebase Chat** (`/reviewer-chat`) — Ask questions about any repository
- **Diff Analysis** (`/reviewer-diff`) — Deep PR/diff review with architectural context
- **Dashboard** (`/reviewer-dashboard`) — Visual health dashboard for your codebase
- **Onboarding** (`/reviewer-onboard`) — Generate onboarding guides for new developers
- **Explain** (`/reviewer-explain`) — Explain any code concept in context
- **Figma Bridge** (`/reviewer-figma`) — Connect design tokens to implementation
- **Knowledge Base** (`/reviewer-knowledge`) — Persistent knowledge management

### Code Review (`/reviewer-lazy`)
- **Quick Review** (`/reviewer-lazy-review`) — Fast, opinionated code reviews
- **Security Audit** (`/reviewer-lazy-audit`) — Security-focused review pass
- **Tech Debt** (`/reviewer-lazy-debt`) — Identify and catalog technical debt
- **Gain Analysis** (`/reviewer-lazy-gain`) — Find opportunities for improvement
- **Help** (`/reviewer-lazy-help`) — Usage guide and best practices

### Security Audit (`/reviewer-security`)
- **OWASP Top 10** — Full OWASP-aligned security analysis
- **HTML Reports** — Rich, shareable security audit reports
- **CWE Mapping** — Map findings to CWE identifiers

## Installation

### Claude Code
```bash
git clone https://github.com/Shivamxp23/Code-Review.git ~/.claude/skills/reviewer
```

Claude Code auto-discovers skills in `~/.claude/skills/`. Restart Claude Code to activate.

### Codex
```bash
codex plugin marketplace add Shivamxp23/Code-Review
codex plugin add reviewer@reviewer
```

### GitHub Copilot
```bash
copilot plugin marketplace add Shivamxp23/Code-Review
copilot plugin install reviewer@reviewer
```

### pi / Hermes
```bash
pi install git:github.com/Shivamxp23/Code-Review
```

### Gemini CLI
```bash
git clone https://github.com/Shivamxp23/Code-Review.git
mkdir -p ~/.gemini/extensions/
cp gemini-extension.json ~/.gemini/extensions/reviewer.json
```

### Swival
```bash
swival skills add https://github.com/Shivamxp23/Code-Review
```

### Manual (any harness)
```bash
git clone https://github.com/Shivamxp23/Code-Review.git reviewer
cd reviewer
```

### Zero-install auto-discovery

These harnesses auto-discover integration files when the repo is in your project — just clone and go:

| Harness | Auto-discovered file |
|----------|---------------------|
| Cursor | `.cursor/rules/reviewer.mdc` |
| Windsurf | `.windsurf/rules/reviewer.md` |
| Cline | `.clinerules/reviewer.md` |
| Kiro | `.kiro/steering/reviewer.md` |
| Qodo | `.qoder/rules/reviewer.md` + `.qoder-plugin/plugin.json` |
| OpenCode | `.opencode/plugins/reviewer.mjs` |
| OpenClaw | `.openclaw/skills/reviewer/SKILL.md` |
| Devin | `.devin-plugin/plugin.json` |
| Antigravity / CodeWhale / Amp / Jules / Zed | `AGENTS.md` |

## Commands

| Command | Description |
|---------|-------------|
| `/reviewer` | Core codebase analysis and understanding |
| `/reviewer-chat` | Interactive codebase Q&A |
| `/reviewer-dashboard` | Visual codebase health dashboard |
| `/reviewer-diff` | Deep diff/PR analysis |
| `/reviewer-domain` | Domain-driven design extraction |
| `/reviewer-explain` | Contextual code explanations |
| `/reviewer-figma` | Design-to-code bridge |
| `/reviewer-knowledge` | Knowledge base management |
| `/reviewer-onboard` | Developer onboarding guides |
| `/reviewer-lazy` | Quick opinionated code review |
| `/reviewer-lazy-review` | Detailed code review pass |
| `/reviewer-lazy-audit` | Security-focused review |
| `/reviewer-lazy-debt` | Technical debt catalog |
| `/reviewer-lazy-gain` | Improvement opportunities |
| `/reviewer-lazy-help` | Usage guide |
| `/reviewer-security` | Full OWASP security audit |

## Harness Support

This skill includes auto-discovery integration files for **18 harnesses**:

| Directory | Harness | Install |
|-----------|---------|---------|
| `.claude-plugin/` | Claude Code | `claude plugins install github:Shivamxp23/Code-Review` |
| `.codex-plugin/` | Codex | `codex plugin add reviewer@reviewer` |
| `.cursor/rules/` | Cursor | auto-discovered |
| `.windsurf/rules/` | Windsurf | auto-discovered |
| `.clinerules/` | Cline | auto-discovered |
| `.kiro/steering/` | Kiro | auto-discovered |
| `.qoder-plugin/` | Qodo | auto-discovered |
| `.qoder/rules/` | Qodo | auto-discovered |
| `.opencode/` | OpenCode | auto-discovered |
| `.openclaw/` | OpenClaw | auto-discovered |
| `.devin-plugin/` | Devin | auto-discovered |
| `.agents/rules/` | Agents.md | auto-discovered |
| `gemini-extension.json` | Gemini CLI | copy to `~/.gemini/extensions/` |
| `plugin.yaml` | Hermes | `pi install git:github.com/Shivamxp23/Code-Review` |
| `pi-extension/` | pi | `pi install git:github.com/Shivamxp23/Code-Review` |
| `AGENTS.md` | Antigravity / CodeWhale / Amp / Jules / Zed | auto-discovered |
| `commands/` | TOML Commands | auto-discovered |
| `skills/` | Generic / Swival | `swival skills add https://github.com/Shivamxp23/Code-Review` |

## License

See [LICENSE](./LICENSE) for details.
