// Publishes a production build of the app to a fork's `gh-pages` branch.
//
// AGENTS.md keeps the canonical repository's GitHub Pages a redirect to
// homnayangi.com, so this script refuses to publish the app there. Forks
// host their own copy at https://<owner>.github.io/<repo>/ and never touch
// homnayangi.com's DNS.
//
//   pnpm deploy:pages                 publish to `origin`
//   pnpm deploy:pages --remote fork   publish to another remote
//   pnpm deploy:pages --dry-run       build and stage the commit, skip the push
//   pnpm deploy:pages --base /x/      override the base path (default: /<repo>/)
import {execFileSync} from 'node:child_process';
import {cpSync,copyFileSync,existsSync,mkdtempSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const BLOCKED = 'homnayangi-com/homnayangi';
const args = process.argv.slice(2);
const flag = name => {const i = args.indexOf(name); return i < 0 ? null : args[i + 1] ?? null};
const remote = flag('--remote') ?? 'origin';
const dryRun = args.includes('--dry-run');

const fail = message => {console.error(`deploy-pages: ${message}`); process.exit(1)};
const git = (cwd, ...rest) => execFileSync('git', rest, {cwd, encoding: 'utf8'}).trim();
const quiet = (cwd, ...rest) => {try {execFileSync('git', rest, {cwd, stdio: 'ignore'}); return true} catch {return false}};

const root = git(process.cwd(), 'rev-parse', '--show-toplevel');
const url = git(root, 'remote', 'get-url', remote);
const parsed = /[/:]([^/:]+)\/([^/]+?)(?:\.git)?$/.exec(url);
if (!parsed) fail(`Cannot read owner/repo from remote "${remote}": ${url}`);
const [, owner, repo] = parsed;
if (`${owner}/${repo}`.toLowerCase() === BLOCKED) fail(`Refusing to publish the app to ${BLOCKED}: its GitHub Pages must stay the redirect to homnayangi.com. Publish from a fork instead.`);

const base = flag('--base') ?? `/${repo}/`;
if (!base.startsWith('/') || !base.endsWith('/')) fail(`--base must start and end with "/" (got "${base}")`);
const commit = git(root, 'rev-parse', '--short', 'HEAD');
console.log(`Building ${owner}/${repo} @ ${commit} with base ${base}`);
execFileSync('pnpm', ['build'], {cwd: root, stdio: 'inherit', shell: process.platform === 'win32', env: {...process.env, PUBLIC_BASE_PATH: base}});

const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) fail('Build produced no dist/index.html');

const work = mkdtempSync(join(tmpdir(), 'tnag-pages-'));
rmSync(work, {recursive: true, force: true});
let keep = false;
try {
 if (quiet(root, 'fetch', remote, 'gh-pages')) git(root, 'worktree', 'add', '--force', '-B', 'gh-pages', work, `${remote}/gh-pages`);
 else git(root, 'worktree', 'add', '--force', '--orphan', '-B', 'gh-pages', work);
 for (const entry of readdirSync(work)) if (entry !== '.git') rmSync(join(work, entry), {recursive: true, force: true});
 cpSync(dist, work, {recursive: true});
 // Pages serves the built app itself; .nojekyll stops Jekyll from filtering
 // assets, and 404.html keeps deep links on the same single-page app.
 // `* -text` publishes every build artifact byte for byte, whatever
 // core.autocrlf is set to on the machine running this.
 writeFileSync(join(work, '.nojekyll'), '');
 writeFileSync(join(work, '.gitattributes'), '* -text\n');
 copyFileSync(join(work, 'index.html'), join(work, '404.html'));
 git(work, 'add', '--all', '--force');
 if (!git(work, 'status', '--porcelain')) console.log('gh-pages already matches this build; nothing to publish.');
 else {
  git(work, 'commit', '-m', `Publish ${commit} to GitHub Pages`);
  if (dryRun) {keep = true; console.log(`Dry run: committed to gh-pages in ${work} but did not push. Remove it with: git worktree remove --force "${work}"`)}
  else {
   git(work, 'push', '--force', remote, 'gh-pages');
   console.log(`Published. Enable Pages for ${owner}/${repo} from branch gh-pages (root), then open https://${owner.toLowerCase()}.github.io${base}`);
  }
 }
} finally {
 if (!keep) {
  quiet(root, 'worktree', 'remove', '--force', work);
  quiet(root, 'worktree', 'prune');
 }
}
