/*
import { execSync } from 'child_process';
import fs from 'fs';

const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running '${command}':`, error);
    process.exit(1);
  }
};

const copyFolder = async (src, dest) => {
  try {
    console.log(`Copying ${src} → ${dest}`);
    await fs.promises.cp(src, dest, { recursive: true });
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error);
    process.exit(1);
  }
};


runCommand('next build');

await copyFolder('public', '.next/standalone/public');
await copyFolder('.next/static', '.next/standalone/.next/static');

console.log('✅ Build process completed successfully!');
*/

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');
const TMP_BUILD = path.join(BASE_DIR, 'tmp_build');
const LIVE_DIR = path.join(BASE_DIR, 'live');
const BACKUP_DIR = path.join(BASE_DIR, 'live_backup');

function run(command, options = {}) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit', ...options });
}

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function moveDir(from, to) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
  }
}

function copyDir(source, destination) {
  run(`cp -R ${source}/. ${destination}`);
}

async function main() {
  try {
    console.log('🚧 Starting build process...');

    // Clean old temp build
    removeDir(TMP_BUILD);
    fs.mkdirSync(TMP_BUILD);

    // Build the Next.js app
    run('npx next build', { cwd: BASE_DIR });

    // Optional: run export if you're using static export
    // run(`npx next export -o ${TMP_BUILD}`, { cwd: BASE_DIR });

    // Copy build output to tmp_build (this depends on deployment style)
    copyDir(path.join(BASE_DIR, '.next'), path.join(TMP_BUILD, '.next'));
    copyDir(path.join(BASE_DIR, 'public'), path.join(TMP_BUILD, 'public'));
    copyDir(path.join(BASE_DIR, 'node_modules'), path.join(TMP_BUILD, 'node_modules')); // optional
    fs.copyFileSync(path.join(BASE_DIR, 'package.json'), path.join(TMP_BUILD, 'package.json'));

    // Swap build folders
    console.log('\n🔄 Swapping build folders...');
    removeDir(BACKUP_DIR);
    moveDir(LIVE_DIR, BACKUP_DIR);
    moveDir(TMP_BUILD, LIVE_DIR);

    // Clean up
    removeDir(BACKUP_DIR);

    console.log('\n✅ Deployment completed.');
  } catch (err) {
    console.error('\n❌ Build failed:', err);
    process.exit(1);
  }
}

main();
