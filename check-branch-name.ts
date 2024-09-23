import { execSync } from 'child_process';

let branchName = '';
const isGithub = Boolean(process.env.CI);

const all = (arr: string[], fn = Boolean) => arr.every(fn);

if (isGithub) {
    branchName = process.env.GITHUB_HEAD_REF;
} else {
    branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
}

console.log(`Detected branch name to validate: ${branchName}`);
