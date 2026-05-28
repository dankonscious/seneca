'use strict';

const fs = require('fs');

const body = process.env.ISSUE_BODY || '';

// Normalize to a clean folder path — strip any trailing slash, then re-add it
// so downstream scripts always receive a consistent "dir/" form.
function normalizeFolder(p) {
  return p.trim().replace(/\/+$/, '') + '/';
}

// ── ref_url (repo-relative folder path) ──────────────────────────────────────
const refPathMatch = body.match(/ref_url:\s*(\S+)/);
const refPath = refPathMatch ? normalizeFolder(refPathMatch[1]) : '';

// ── duplicate_url (repo-relative folder path) ─────────────────────────────────
const dupPathMatch = body.match(/duplicate_url:\s*(\S+)/);
const duplicatePath = dupPathMatch ? normalizeFolder(dupPathMatch[1]) : '';

if (!refPath || !duplicatePath) {
  console.error('ERROR: ref_url or duplicate_url not found in issue body.');
  process.exit(1);
}

// ── GT Metrix URLs (resolve <ref_url> / <duplicate_url> placeholders) ─────────
const gtmetrixMatch = body.match(/GT Metrix URLs\s*\n((?:[ \t]*-[ \t]*.+\n?)+)/);
const gtmetrixUrls = [];
if (gtmetrixMatch) {
  for (const line of gtmetrixMatch[1].split('\n')) {
    let url = line.replace(/^[ \t]*-[ \t]*/, '').trim();
    if (url) {
      url = url.replace('<ref_url>', refPath).replace('<duplicate_url>', duplicatePath);
      gtmetrixUrls.push(url);
    }
  }
}

// ── replace_map ───────────────────────────────────────────────────────────────
const replaceMapMatch = body.match(/replace_map:\s*\n((?:[ \t]*-[ \t]*.+\n?)+)/);
const replacePairs = [];
if (replaceMapMatch) {
  for (const line of replaceMapMatch[1].split('\n')) {
    const entry = line.replace(/^[ \t]*-[ \t]*/, '').trim();
    if (entry.includes(' -> ')) {
      const idx = entry.indexOf(' -> ');
      const old = entry.substring(0, idx).trim();
      const newVal = entry.substring(idx + 4).trim();
      if (old) replacePairs.push({ old, new: newVal });
    }
  }
}

// ── Write GitHub Actions outputs ──────────────────────────────────────────────
const outputFile = process.env.GITHUB_OUTPUT || '';
const out = [
  `ref_path=${refPath}`,
  `duplicate_path=${duplicatePath}`,
  'gtmetrix_urls<<GTEOF',
  gtmetrixUrls.join('\n'),
  'GTEOF',
  'replace_map<<RMEOF',
  replacePairs.map(p => `${p.old} -> ${p.new}`).join('\n'),
  'RMEOF',
  '',
].join('\n');

fs.appendFileSync(outputFile, out);

console.log(`ref_path:       ${refPath}`);
console.log(`duplicate_path: ${duplicatePath}`);
console.log(`gtmetrix_urls:  ${JSON.stringify(gtmetrixUrls)}`);
console.log(`replace_map:    ${JSON.stringify(replacePairs)}`);
