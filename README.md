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

### Quick install — choose your harness

| Harness | Install |
|---------|---------|
| **Claude Code** | Clone to skills dir → [see below](#claude-code) |
| **Codex** | Clone to plugins dir → [see below](#codex) |
| **GitHub Copilot** | Clone to plugins dir → [see below](#github-copilot) |
| **pi / Hermes** | `pi install git:github.com/Shivamxp23/Code-Review` → [see below](#pi--hermes) |
| **Gemini CLI** | Copy extension manifest → [see below](#gemini-cli) |
| **Swival** | `swival skills add https://github.com/Shivamxp23/Code-Review` |
| **Cursor / Windsurf / Cline / Kiro / Qodo / OpenCode / OpenClaw / Devin** | [Auto-discovered](#auto-discovered-harnesses) — just clone into your project |
| **Antigravity / CodeWhale / Amp / Jules / Zed** | [Auto-discovered](#auto-discovered-harnesses) — reads `AGENTS.md` from project root |

---

### Claude Code

Clone directly into the skills directory. Claude Code auto-loads it on next session.

**Linux / macOS:**
```bash
git clone https://github.com/Shivamxp23/Code-Review.git ~/.claude/skills/reviewer
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Shivamxp23/Code-Review.git $env:USERPROFILE\.claude\skills\reviewer
```

**Windows (CMD):**
```cmd
git clone https://github.com/Shivamxp23/Code-Review.git %USERPROFILE%\.claude\skills\reviewer
```

---

### Codex

Clone into the Codex plugins directory.

**Linux / macOS:**
```bash
git clone https://github.com/Shivamxp23/Code-Review.git ~/.codex/plugins/reviewer
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Shivamxp23/Code-Review.git $env:USERPROFILE\.codex\plugins\reviewer
```

**Windows (CMD):**
```cmd
git clone https://github.com/Shivamxp23/Code-Review.git %USERPROFILE%\.codex\plugins\reviewer
```

---

### GitHub Copilot

Clone into the Copilot plugins directory.

**Linux / macOS:**
```bash
git clone https://github.com/Shivamxp23/Code-Review.git ~/.copilot/plugins/reviewer
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Shivamxp23/Code-Review.git $env:USERPROFILE\.copilot\plugins\reviewer
```

**Windows (CMD):**
```cmd
git clone https://github.com/Shivamxp23/Code-Review.git %USERPROFILE%\.copilot\plugins\reviewer
```

---

### pi / Hermes

**All platforms:**
```bash
pi install git:github.com/Shivamxp23/Code-Review
```

Or manually clone into the pi extensions directory:

**Linux / macOS:**
```bash
git clone https://github.com/Shivamxp23/Code-Review.git ~/.config/pi/extensions/reviewer
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Shivamxp23/Code-Review.git $env:APPDATA\pi\extensions\reviewer
```

**Windows (CMD):**
```cmd
git clone https://github.com/Shivamxp23/Code-Review.git %APPDATA%\pi\extensions\reviewer
```

---

### Gemini CLI

Copy the extension manifest into Gemini's extensions directory.

**Linux / macOS:**
```bash
git clone https://github.com/Shivamxp23/Code-Review.git /tmp/reviewer
mkdir -p ~/.gemini/extensions/
cp /tmp/reviewer/gemini-extension.json ~/.gemini/extensions/reviewer.json
rm -rf /tmp/reviewer
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Shivamxp23/Code-Review.git $env:TEMP\reviewer
New-Item -ItemType Directory -Force -Path $env:USERPROFILE\.gemini\extensions\
Copy-Item $env:TEMP\reviewer\gemini-extension.json $env:USERPROFILE\.gemini\extensions\reviewer.json
Remove-Item -Recurse -Force $env:TEMP\reviewer
```

**Windows (CMD):**
```cmd
git clone https://github.com/Shivamxp23/Code-Review.git %TEMP%\reviewer
mkdir %USERPROFILE%\.gemini\extensions
copy %TEMP%\reviewer\gemini-extension.json %USERPROFILE%\.gemini\extensions\reviewer.json
rmdir /s /q %TEMP%\reviewer
```

---

### Auto-discovered harnesses

These harnesses need no install command — just clone the repo **into your project directory** and they auto-discover the integration files:

**Linux / macOS:**
```bash
cd your-project
git clone https://github.com/Shivamxp23/Code-Review.git .reviewer
```

**Windows (PowerShell):**
```powershell
cd your-project
git clone https://github.com/Shivamxp23/Code-Review.git .reviewer
```

**Windows (CMD):**
```cmd
cd your-project
git clone https://github.com/Shivamxp23/Code-Review.git .reviewer
```

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
| Antigravity / CodeWhale / Amp / Jules / Zed | `AGENTS.md` (read from project root) |

> **Note:** For auto-discover harnesses, the `.reviewer/` directory must be inside your project root. If your harness supports a global skills/config directory, you can also clone there instead (check your harness docs).

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
| `.claude-plugin/` | Claude Code | clone to `~/.claude/skills/reviewer/` |
| `.codex-plugin/` | Codex | clone to `~/.codex/plugins/reviewer/` |
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
