#!/usr/bin/env node

/**
 * find-hardcoded-texts.mjs
 *
 * Finds hardcoded text strings in JSX/TSX markup (Next.js projects).
 * Skips: comments, import/export statements, variable declarations,
 *        template strings used in logic, className/style/href/src attributes.
 *
 * Usage:
 *   node find-hardcoded-texts.mjs [rootDir] [options]
 *
 * Options:
 *   --output=json        Output as JSON instead of table
 *   --min-length=3       Minimum text length to report (default: 2)
 *   --ignore=dir1,dir2   Comma-separated dirs to ignore (added to defaults)
 *   --no-color           Disable colored output
 *
 * Examples:
 *   node find-hardcoded-texts.mjs ./src
 *   node find-hardcoded-texts.mjs . --output=json > hardcoded.json
 *   node find-hardcoded-texts.mjs ./src --min-length=5 --ignore=__tests__
 */
import fs from "fs";
import path from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const rootDir = args.find((a) => !a.startsWith("--")) || ".";
const outputJson = args.includes("--output=json");
const noColor = args.includes("--no-color");
const minLengthArg = args.find((a) => a.startsWith("--min-length="));
const minLength = minLengthArg ? parseInt(minLengthArg.split("=")[1], 10) : 2;
const ignoreArg = args.find((a) => a.startsWith("--ignore="));
const extraIgnore = ignoreArg ? ignoreArg.split("=")[1].split(",") : [];

const DEFAULT_IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out",
  "coverage",
  ".turbo",
  "storybook-static",
  ...extraIgnore,
]);

// ─── Colors ───────────────────────────────────────────────────────────────────

const c = noColor
  ? { reset: "", bold: "", dim: "", cyan: "", yellow: "", green: "", red: "", magenta: "" }
  : {
      reset: "\x1b[0m",
      bold: "\x1b[1m",
      dim: "\x1b[2m",
      cyan: "\x1b[36m",
      yellow: "\x1b[33m",
      green: "\x1b[32m",
      red: "\x1b[31m",
      magenta: "\x1b[35m",
    };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function walk(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (DEFAULT_IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// Strip block comments /* */ and line comments //
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length)) // block comments
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));       // line comments
}

// ─── Core Parser ──────────────────────────────────────────────────────────────

/**
 * Finds hardcoded text nodes in JSX markup.
 * Strategy:
 *   1. Strip comments.
 *   2. Walk through JSX text nodes (text between > and <).
 *   3. Walk through JSX expression containers { "string" } and { `template` }.
 *   4. Skip prop values (className=, href=, src=, style=, etc.).
 */
function findHardcodedTexts(src, filePath) {
  const results = [];
  const stripped = stripComments(src);
  const lines = src.split("\n"); // keep original for line numbers

  // Helper: get line number from character index
  function lineOf(idx) {
    let line = 0;
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count > idx) return i + 1;
    }
    return lines.length;
  }

  function addResult(text, idx) {
    const trimmed = text.trim();
    // Filter: must be longer than minLength, must contain at least one letter/digit
    if (trimmed.length < minLength) return;
    if (!/[a-zA-Zа-яА-ЯёЁ\u00C0-\u024F\u0400-\u04FF]/.test(trimmed)) return;
    // Skip pure numbers, hex colors, urls, css units
    if (/^[\d\s.,%-]+$/.test(trimmed)) return;
    if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return;
    if (/^(https?:\/\/|\/)[^\s]*$/.test(trimmed)) return;
    if (/^\d+(px|em|rem|vh|vw|%)$/.test(trimmed)) return;
    // Skip things that look like classnames (no spaces, camelCase or dash-separated)
    if (!/\s/.test(trimmed) && /^[a-z][a-zA-Z0-9-_:[\]]+$/.test(trimmed)) return;

    results.push({
      file: filePath,
      line: lineOf(idx),
      text: trimmed,
    });
  }

  // ── 1. JSX Text Nodes: content between > ... < ──────────────────────────────
  // Matches text between closing > of a tag and opening < of the next tag
  // Skips self-closing tags and pure whitespace
  const jsxTextRe = />([^<>{}`]+)</g;
  let m;
  while ((m = jsxTextRe.exec(stripped)) !== null) {
    const text = m[1];
    if (text.trim()) {
      addResult(text, m.index + 1);
    }
  }

  // ── 2. JSX Expression Containers with string literals: {"text"} or {'text'} ─
  const jsxExprStringRe = /\{(?:\s*)(["'])([^"'\\{}\n]+)\1(?:\s*)\}/g;
  while ((m = jsxExprStringRe.exec(stripped)) !== null) {
    // Make sure it's not inside a prop assignment like className={"..."}
    const before = stripped.slice(Math.max(0, m.index - 30), m.index);
    if (/[a-zA-Z0-9_-]+=\s*$/.test(before)) continue; // skip prop values
    addResult(m[2], m.index);
  }

  // ── 3. Template literals in JSX expressions: {`Hello ${name}`} ─────────────
  // Only the literal (non-expression) parts
  const templateRe = /\{`([^`]*)`\}/g;
  while ((m = templateRe.exec(stripped)) !== null) {
    const before = stripped.slice(Math.max(0, m.index - 30), m.index);
    if (/[a-zA-Z0-9_-]+=\s*$/.test(before)) continue;
    // Extract static parts (outside ${...})
    const staticParts = m[1].replace(/\$\{[^}]*\}/g, "").trim();
    if (staticParts) addResult(staticParts, m.index);
  }

  // Deduplicate same line + text combos
  const seen = new Set();
  return results.filter((r) => {
    const key = `${r.line}:${r.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const absRoot = path.resolve(rootDir);

  if (!fs.existsSync(absRoot)) {
    console.error(`${c.red}Error: directory not found: ${absRoot}${c.reset}`);
    process.exit(1);
  }

  const files = walk(absRoot);

  if (!outputJson) {
    console.log(
      `\n${c.bold}${c.cyan}🔍 Scanning ${files.length} TSX/JSX files in ${absRoot}${c.reset}\n`
    );
  }

  const allResults = [];
  let totalTexts = 0;

  for (const file of files) {
    let src;
    try {
      src = fs.readFileSync(file, "utf-8");
    } catch {
      continue;
    }

    const results = findHardcodedTexts(src, file);
    if (results.length === 0) continue;

    totalTexts += results.length;
    allResults.push({ file, results });

    if (!outputJson) {
      const rel = path.relative(absRoot, file);
      console.log(`${c.bold}${c.yellow}📄 ${rel}${c.reset}`);
      for (const r of results) {
        const lineStr = String(r.line).padStart(4, " ");
        console.log(
          `  ${c.dim}line ${lineStr}${c.reset}  ${c.green}"${r.text}"${c.reset}`
        );
      }
      console.log();
    }
  }

  if (outputJson) {
    // Flat JSON array for easy processing
    const flat = allResults.flatMap(({ file, results }) =>
      results.map((r) => ({
        file: path.relative(absRoot, r.file),
        line: r.line,
        text: r.text,
      }))
    );
    console.log(JSON.stringify(flat, null, 2));
    return;
  }

  // Summary
  console.log(
    `${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`
  );
  console.log(
    `${c.bold}Files with hardcoded texts : ${c.magenta}${allResults.length}${c.reset}`
  );
  console.log(
    `${c.bold}Total hardcoded text nodes : ${c.magenta}${totalTexts}${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`
  );

  if (totalTexts === 0) {
    console.log(`${c.green}✅ No hardcoded texts found!${c.reset}\n`);
  }
}

main();