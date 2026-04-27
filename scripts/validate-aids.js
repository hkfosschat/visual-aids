#!/usr/bin/env node
/**
 * Validates that every src/<YYYYMMDD>-<slug>/index.jsx (or index.js) has:
 *   1. A folder name matching the YYYYMMDD-<slug> pattern
 *   2. `export const meta` with required `title` and `description` fields
 *   3. A `export default` (the React component)
 *
 * Uses static text scanning — no bundler needed, fast.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');

const errors = [];
const slugPattern = /^\d{8}-/;

const entries = fs.readdirSync(SRC).filter(name => slugPattern.test(name));

if (entries.length === 0) {
  console.error('ERROR: No aid folders found in src/');
  process.exit(1);
}

for (const slug of entries) {
  const dir = path.join(SRC, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  const jsxPath = path.join(dir, 'index.jsx');
  const jsPath  = path.join(dir, 'index.js');
  const filePath = fs.existsSync(jsxPath) ? jsxPath : fs.existsSync(jsPath) ? jsPath : null;

  if (!filePath) {
    errors.push(`${slug}: missing index.jsx (or index.js)`);
    continue;
  }

  const src = fs.readFileSync(filePath, 'utf8');

  if (!/^export\s+const\s+meta\s*=/m.test(src)) {
    errors.push(`${slug}: missing \`export const meta\``);
  } else {
    if (!/^\s+title\s*:/m.test(src))       errors.push(`${slug}: meta missing 'title'`);
    if (!/^\s+description\s*:/m.test(src)) errors.push(`${slug}: meta missing 'description'`);
  }

  if (!/^export\s+default/m.test(src)) {
    errors.push(`${slug}: missing default export (React component)`);
  }
}

if (errors.length > 0) {
  console.error('Convention validation FAILED:\n' + errors.map(e => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}

console.log(`Convention validation passed (${entries.length} aid(s) checked).`);
