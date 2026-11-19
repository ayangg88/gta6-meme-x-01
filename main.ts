import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const filename = 'POST.json';

function run() {
  const contents = readFileSync(join(botDir, filename));
  let post: unknown;
  try {
    post = JSON.parse(contents.toString('utf8'));
  } catch {
    throw new Error('invalid JSON');
  }
  if (post === null || typeof post !== 'object' || !('url' in post) || typeof post.url !== 'string') {
    throw new Error('expected a JSON object with a string url');
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, filename), contents);
  console.log(`Copied ${filename}`);
}

try {
  run();
} catch (error) {
  console.error(`Could not copy ${filename}: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
