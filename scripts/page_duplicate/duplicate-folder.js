'use strict';

const fs   = require('fs');
const path = require('path');

// Strip trailing slash — Node's fs functions are fine either way, but
// keeping paths clean makes log output and output values predictable.
const refPath       = (process.env.REF_PATH       || '').replace(/\/+$/, '');
const duplicatePath = (process.env.DUPLICATE_PATH || '').replace(/\/+$/, '');

if (!refPath || !duplicatePath) {
  console.error('ERROR: REF_PATH or DUPLICATE_PATH is not set.');
  process.exit(1);
}

if (!fs.existsSync(refPath) || !fs.statSync(refPath).isDirectory()) {
  console.error(`ERROR: Source directory not found: ${refPath}`);
  process.exit(1);
}

// Clean destination before copying so we get an exact mirror, not a merge.
if (fs.existsSync(duplicatePath)) {
  fs.rmSync(duplicatePath, { recursive: true, force: true });
  console.log(`Removed existing destination: ${duplicatePath}`);
}

// Ensure parent directory exists.
const parentDir = path.dirname(duplicatePath);
if (parentDir) fs.mkdirSync(parentDir, { recursive: true });

// Recursive copy — fs.cpSync(src, dest, { recursive: true }) copies the
// contents of src INTO dest, matching cp -r behaviour when dest is absent.
fs.cpSync(refPath, duplicatePath, { recursive: true });

// Confirm what was copied.
function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(path.join(dir, entry.name));
    else n++;
  }
  return n;
}
const fileCount = countFiles(duplicatePath);
console.log(`Copied ${refPath}/ -> ${duplicatePath}/ (${fileCount} files)`);

// Write outputs with trailing slash to mark these as folder paths.
const outputFile = process.env.GITHUB_OUTPUT || '';
fs.appendFileSync(outputFile, `ref_path=${refPath}/\nduplicate_path=${duplicatePath}/\n`);
