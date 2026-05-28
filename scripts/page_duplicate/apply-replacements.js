'use strict';

const fs   = require('fs');
const path = require('path');

const SUPPORTED_EXT = new Set(['.html', '.js', '.css', '.json']);

function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.isFile() && SUPPORTED_EXT.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

const duplicatePath = (process.env.DUPLICATE_PATH || '').replace(/\/+$/, '');
const replaceRaw    = process.env.REPLACE_MAP    || '';
const indexFile     = process.env.INDEX_FILE     || '';

if (!duplicatePath) {
  console.error('ERROR: DUPLICATE_PATH is not set.');
  process.exit(1);
}

if (!indexFile) {
  console.error('ERROR: INDEX_FILE is not set.');
  process.exit(1);
}

if (!replaceRaw.trim()) {
  console.warn('WARNING: replace_map is empty — nothing to replace.');
  process.exit(0);
}

// Parse replace pairs once.
const replacePairs = [];
for (const line of replaceRaw.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed.includes(' -> ')) continue;
  const idx    = trimmed.indexOf(' -> ');
  const old    = trimmed.substring(0, idx).trim();
  const newVal = trimmed.substring(idx + 4).trim();
  if (old) replacePairs.push({ old, new: newVal });
}

const files = [path.join(duplicatePath, indexFile)];
console.log(`Scanning ${files.length} file(s) in ${duplicatePath}/ (${indexFile} only)`);

for (const file of files) {
  let content  = fs.readFileSync(file, 'utf8');
  let modified = false;

  for (const { old, new: newVal } of replacePairs) {
    if (!content.includes(old)) continue;

    let count = 0;
    let pos   = 0;
    while ((pos = content.indexOf(old, pos)) !== -1) { count++; pos += old.length; }

    content  = content.split(old).join(newVal);
    modified = true;
    console.log(`  [${path.relative(duplicatePath, file)}] ${count}x: ${JSON.stringify(old)} -> ${JSON.stringify(newVal)}`);
  }

  if (modified) fs.writeFileSync(file, content, 'utf8');
}

console.log('All replacements applied.');
