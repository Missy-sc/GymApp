import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const isWindows = process.platform === 'win32'
const commands = {
  firebase: isWindows ? 'npx.cmd' : 'npx',
  git: isWindows ? 'git.exe' : 'git',
  npm: isWindows ? 'npm.cmd' : 'npm',
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { shell: isWindows, stdio: 'inherit', ...options })
  if (result.status !== 0) {
    throw result.error ?? new Error(`${command} ${args.join(' ')} failed with exit code ${result.status ?? 'unknown'}`)
  }
}

function output(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: isWindows })
  if (result.status !== 0) {
    throw result.error ?? new Error(result.stderr.trim() || `${command} ${args.join(' ')} failed`)
  }
  return result.stdout.trim()
}

if (output(commands.git, ['branch', '--show-current']) !== 'main') {
  throw new Error('Deployments must run from the main branch.')
}

run(commands.git, ['diff', '--quiet'])
run(commands.git, ['diff', '--cached', '--quiet'])

let versionCommitted = false
try {
  run(commands.npm, ['version', 'patch', '--no-git-tag-version'])
  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

  run(commands.npm, ['test'])
  run(commands.npm, ['run', 'build'])
  run(commands.git, ['add', '--', 'package.json', 'package-lock.json'])
  run(commands.git, ['commit', '-m', `chore(release): v${version}`])
  versionCommitted = true
  run(commands.git, ['push', 'origin', 'main'])
  run(commands.firebase, ['firebase-tools', 'deploy', '--only', 'hosting', '--project', 'gym-app-263d8'])
} catch (error) {
  if (!versionCommitted) {
    spawnSync(commands.git, ['restore', '--staged', '--worktree', '--', 'package.json', 'package-lock.json'])
  }
  throw error
}
