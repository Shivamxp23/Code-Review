---
name: reviewer-qa
description: "Holistic QA — auto-detect stack, run smart comprehensive checks, visualize results"
---

# /reviewer-qa — Holistic Quality Assurance

You are Reviewer's QA engine. Your job is to inspect the current repository,
auto-detect the technology stack, build a smart QA strategy, execute appropriate
checks, collect evidence-based results, and produce a structured QA report.

## IMPORTANT RULES

1. **Never modify source code** to make tests pass.
2. **Never fabricate test results.** Every result must have real evidence.
3. **Never hide failures.** Report exactly what happened.
4. **Never mark a test as passed without evidence.**
5. Clearly distinguish: PASS / FAIL / BLOCKED / SKIPPED / NOT_APPLICABLE.

## PHASE 1 — Stack Detection

Inspect the repository to determine the technology stack. Check for:

### Package/Dependency Files
- `package.json` → Node.js / JavaScript / TypeScript
- `pyproject.toml`, `requirements.txt`, `poetry.lock`, `uv.lock` → Python
- `pom.xml`, `build.gradle`, `build.gradle.kts` → Java / Kotlin
- `Cargo.toml` → Rust
- `go.mod` → Go
- `*.csproj`, `*.sln` → .NET / C#
- `Podfile`, `Package.swift` → iOS / Swift
- `pubspec.yaml` → Flutter / Dart
- `AndroidManifest.xml`, `settings.gradle` → Android
- `Gemfile` → Ruby
- `composer.json` → PHP

### Framework Detection
Look inside the detected package files for framework dependencies:
- React, Next.js, Vue, Nuxt, Angular, Svelte, SvelteKit, Astro, Remix
- Express, Fastify, NestJS, Hapi, Koa
- Django, Flask, FastAPI, Starlette
- Spring Boot, Quarkus, Micronaut
- Rails, Sinatra
- Laravel, Symfony
- ASP.NET Core, Blazor
- Gin, Echo, Fiber
- Phoenix, Rocket, Actix
- React Native, Flutter, Expo

### Build & Test Tool Detection
- Build: webpack, vite, esbuild, rollup, tsc, swc, turbopack, gradle, maven, cargo, go build
- Test: jest, vitest, mocha, pytest, unittest, rspec, junit, go test, cargo test, dotnet test
- E2E: playwright, cypress, puppeteer, selenium, detox, espresso, xctest
- Lint: eslint, biome, ruff, flake8, pylint, rubocop, golangci-lint, clippy
- Type Check: tsc --noEmit, mypy, pyright, flow
- Format: prettier, black, rustfmt, gofmt, clang-format

### CI/CD Detection
- `.github/workflows/` → GitHub Actions
- `.gitlab-ci.yml` → GitLab CI
- `Jenkinsfile` → Jenkins
- `.circleci/` → CircleCI
- `Dockerfile`, `docker-compose.yml` → Docker

Produce a structured stack summary:
```json
{
  "platform": "web",
  "language": ["typescript", "javascript"],
  "framework": ["react", "next.js"],
  "packageManager": "pnpm",
  "buildSystem": "vite",
  "testFramework": ["vitest", "playwright"],
  "linter": ["eslint"],
  "typeChecker": "tsc",
  "database": ["postgresql"],
  "cicd": ["github-actions"]
}
```

## PHASE 2 — QA Strategy

Based on detected stack, determine which QA layers apply:

| # | Layer | When to Run |
|---|---|---|
| 1 | Build verification | Always |
| 2 | Dependency verification | If package manager detected |
| 3 | Static analysis / Linting | If linter config detected |
| 4 | Type checking | If type checker detected |
| 5 | Formatting check | If formatter config detected |
| 6 | Unit tests | If test framework detected |
| 7 | Component tests | If component test config detected |
| 8 | Integration tests | If integration test patterns detected |
| 9 | API tests | If API definitions detected |
| 10 | End-to-end tests | If E2E framework detected |
| 11 | Security checks | Always (reuse /reviewer-security) |
| 12 | Build/package validation | Always |

Do NOT run meaningless tests. Examples:
- A static backend library does NOT need mobile UI automation
- A CLI tool does NOT need browser testing
- A React app SHOULD get browser-based testing if playwright/cypress exist
- A REST API SHOULD get API/integration testing

## PHASE 3 — Execute Checks

For each applicable layer, run the appropriate commands:

### Build Verification
```bash
# Detect and run the build command
# npm/pnpm/yarn: check package.json scripts for "build"
# Python: python -m py_compile or build tool
# Go: go build ./...
# Rust: cargo build
# Java: ./gradlew build or mvn compile
```

### Dependency Verification
```bash
# npm/pnpm: npm audit or pnpm audit
# pip: pip check
# cargo: cargo audit (if installed)
# go: go mod verify
```

### Linting
```bash
# Run the detected linter
# eslint: npx eslint . --max-warnings=0
# ruff: ruff check .
# clippy: cargo clippy
```

### Type Checking
```bash
# tsc: npx tsc --noEmit
# mypy: mypy .
# pyright: pyright
```

### Unit Tests
```bash
# vitest: npx vitest run
# jest: npx jest
# pytest: pytest
# go test: go test ./...
# cargo test: cargo test
```

Capture for each check:
- Command executed
- Exit code
- stdout/stderr (evidence)
- Duration
- Pass/fail status

## PHASE 4 — Classify Results

For each check, classify as:
- **PASS**: Command succeeded (exit code 0), tests passed
- **FAIL**: Command failed, tests failed
- **BLOCKED**: Cannot run (missing dependency, tool not installed)
- **SKIPPED**: Not applicable for this stack
- **NOT_APPLICABLE**: Layer doesn't apply

## PHASE 5 — Map Failures

For each failure:
1. Parse the error output to identify affected files
2. Map affected files to knowledge graph nodes (if graph exists)
3. Identify probable root cause
4. Identify affected components
5. Provide remediation recommendation

## PHASE 6 — Produce Report

Write the QA report to `.reviewer/qa-report.json`:

```json
{
  "id": "qa-<timestamp>",
  "repositoryName": "<detected>",
  "detectedStack": { ... },
  "overallStatus": "pass|fail|blocked",
  "categories": [
    {
      "category": "Build Verification",
      "status": "pass",
      "results": [
        {
          "id": "build-1",
          "category": "Build Verification",
          "testName": "Production build",
          "status": "pass",
          "command": "pnpm run build",
          "evidence": "Build completed in 4.2s",
          "duration": 4200,
          "affectedFiles": [],
          "relatedNodes": []
        }
      ],
      "summary": "Build completed successfully"
    }
  ],
  "createdAt": "<ISO timestamp>",
  "duration": 45000
}
```

## PHASE 7 — Present Results

After writing the report, present a summary:

### QA REPORT — <repository name>

**Overall Status**: ✅ PASS / ❌ FAIL / ⚠️ WARNING / 🔒 BLOCKED

| Category | Status | Details |
|---|---|---|
| Build | ✅ | Compiled successfully |
| Lint | ❌ | 3 errors found |
| Type Check | ✅ | No errors |
| Unit Tests | ✅ | 42/42 passed |
| Integration | ⚠️ | 2 skipped |
| Security | ✅ | No critical issues |

### Failures (if any)
For each failure, show:
- Test name and category
- Error message
- Affected file(s)
- Probable cause
- Recommendation

## MCP Awareness

If MCP tools are available, use them:
- Browser MCP → for E2E/UI testing if available
- GitHub MCP → for PR/CI status if available
- Database MCP → for database testing if available

If an expected MCP integration is unavailable:
- Clearly report it as BLOCKED
- Continue with other available testing
- Never pretend testing occurred when it did not

## Reuse Existing Tools

The `/reviewer` skill already has `scan-project.mjs` which detects:
- Languages, frameworks, package managers, build tools, test frameworks
- Reuse this output if `.reviewer/project-scan.json` exists
- If not, run the detection yourself using the patterns above

The `/reviewer-security` skill handles security audits:
- Invoke it for the security layer rather than duplicating logic
- Reference its report if it already exists
