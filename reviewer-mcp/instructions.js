// Pure instruction selection for the Ponytail MCP server. No MCP/SDK imports,
// so this stays unit-testable on its own. Reuses the same builder the Claude
// hooks and Pi extension use, so every host emits identical rules.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { getPonytailInstructions } = require("../hooks/ponytail-instructions.js");
const { getDefaultMode, normalizeMode } = require("../hooks/ponytail-config.js");

// The three intensities the server offers. "off" has no instructions to serve.
export const MODES = ["lite", "full", "ultra"];

// Resolve a requested mode to a runtime intensity. Unknown, empty, or "off"
// falls back to the configured default, then to "full".
// ponytail: keep the surface to these three; "off"/"review" aren't served here.
export function resolveMode(requested) {
  const asked = normalizeMode(requested);
  if (asked && asked !== "off") return asked;

  const fallback = normalizeMode(getDefaultMode());
  return fallback && fallback !== "off" ? fallback : "full";
}

export function buildInstructions(requested) {
  return getPonytailInstructions(resolveMode(requested));
}

export function getSkillInstructions(skillName) {
  const { join, dirname } = require("node:path");
  const { readFileSync } = require("node:fs");
  const { fileURLToPath } = require("node:url");
  
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const skillPath = join(currentDir, "..", "skills", skillName, "SKILL.md");
  try {
    return readFileSync(skillPath, "utf8");
  } catch (e) {
    return `Skill instructions for ${skillName} not found at ${skillPath}`;
  }
}
