import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';

const root = process.cwd();
const manifestPath = resolve(root, 'design-system/active-system.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const packagePath = resolve(root, 'package.json');
const packageSource = JSON.parse(readFileSync(packagePath, 'utf8'));

const appDir = resolve(root, 'src/app');
const componentsDir = resolve(root, 'src/components');
const playgroundPath = resolve(componentsDir, 'cargoplot-inbox.tsx');
const globalsCssPath = resolve(appDir, 'globals.css');

const playgroundSource = readFileSync(playgroundPath, 'utf8');
const globalsCssSource = readFileSync(globalsCssPath, 'utf8');

const failures = [];
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => failures.push(message);

function walk(dir, extensions) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'ui') continue; // adapter-owned primitives, not app code
      results.push(...walk(full, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const appSourceFiles = [...walk(appDir, ['.tsx', '.ts']), ...walk(componentsDir, ['.tsx', '.ts'])];

function requireSource(label, fragments, source = playgroundSource) {
  const missing = fragments.filter((fragment) => !source.includes(fragment));
  if (missing.length > 0) {
    fail(`${label}: missing ${missing.join(', ')}`);
    return;
  }
  pass(label);
}

// 1. Dependency policy, driven by the active adapter's manifest.
const dependencyNames = Object.keys({ ...packageSource.dependencies, ...packageSource.devDependencies });
const forbiddenDependency = (manifest.forbiddenDependencies ?? []).find((name) =>
  dependencyNames.some((dep) => dep === name || dep.startsWith(`${name}/`)),
);
if (forbiddenDependency) fail(`Found a dependency forbidden by the active adapter (${manifest.name}): ${forbiddenDependency}`);
else pass(`No dependencies forbidden by the active adapter (${manifest.name})`);

const missingRequired = (manifest.requiredDependencies ?? []).filter((name) => !dependencyNames.includes(name));
if (missingRequired.length > 0) fail(`Missing dependencies required by the active adapter: ${missingRequired.join(', ')}`);
else pass('Active adapter\'s required dependencies are installed');

// 2. Evidence the active adapter is actually wired into the app, not just installed.
const importPrefix = manifest.componentImportPrefix ?? '';
const usesAdapterComponents = importPrefix && appSourceFiles.some((file) => readFileSync(file, 'utf8').includes(importPrefix));
if (usesAdapterComponents) pass(`App code imports components from the active adapter (${importPrefix})`);
else fail(`No app file imports from the active adapter's component prefix (${importPrefix})`);

// 3. No raw HTML controls duplicating adapter primitives, outside the adapter's own source dir.
// JSX intrinsic elements are always lowercase (that's how React tells them apart from components),
// so this intentionally does not match the adapter's own capitalized <Button>/<Input>/<Select>/<Textarea>.
const rawControlPattern = /<(button|input|select|textarea)\b/;
const rawControlFile = appSourceFiles.find((file) => rawControlPattern.test(readFileSync(file, 'utf8')));
if (rawControlFile) fail(`Custom control duplicates an active-adapter component in ${rawControlFile}`);
else pass('No custom HTML controls duplicate active-adapter components');

// 4. No arbitrary hex colors or bracket-value Tailwind classes on foundational surfaces.
const hexPattern = /#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
if (hexPattern.test(globalsCssSource)) fail('Arbitrary hex colors found in globals.css');
else pass('No arbitrary hex colors found in globals.css');

const arbitraryBracketPattern = /\b(?:bg|text|border)-\[#[0-9a-f]{3,8}\]/i;
const arbitraryColorFile = appSourceFiles.find((file) => arbitraryBracketPattern.test(readFileSync(file, 'utf8')));
if (arbitraryColorFile) fail(`Arbitrary bracket-value color class found in ${arbitraryColorFile}`);
else pass('No arbitrary bracket-value color classes found in app code');

// 5. Pattern/state/accessibility checks against the Playground reference implementation.
requireSource('Search, filter, and detail composition', [
  "from '@/components/ui/input'",
  "from '@/components/ui/select'",
  "from '@/components/ui/tabs'",
  "from '@/components/ui/badge'",
  "from '@/components/ui/dropdown-menu'",
  "from '@/components/ui/dialog'",
  "from '@/components/ui/alert-dialog'",
  "from '@/components/ui/command'",
  "from '@/components/ui/accordion'",
]);

requireSource('Destructive-action confirmation', ['AlertDialog', 'Delete conversation', 'onClick={deleteConversation}']);
requireSource('Search and filters target the conversation dataset', ['displayed', 'query', 'filter', 'items.filter']);
requireSource('Required data states', ['switching', 'No messages match', 'checkedIds.size > 0']);
requireSource('Accessible control naming', [
  'aria-label={`Select conversation with ${conversation.name}`}',
  'aria-label={`Delete conversation with ${selected.name}`}',
  'aria-label="Notifications"',
]);

// 6. Commands declared by the active adapter's manifest.
const commands = [
  ['typecheck', manifest.typecheckCommand],
  ['lint', manifest.lintCommand],
  ['build', manifest.buildCommand],
];

for (const [label, command] of commands) {
  if (!command) {
    fail(`${label} command not declared in design-system/active-system.json`);
    continue;
  }
  const [binary, ...args] = command.split(' ');
  const binaryPath = existsSync(resolve(root, 'node_modules/.bin', binary)) ? resolve(root, 'node_modules/.bin', binary) : binary;
  try {
    execFileSync(binaryPath, args, { cwd: root, stdio: 'ignore' });
    pass(`${label} passes`);
  } catch {
    fail(`${label} failed`);
  }
}

if (failures.length > 0) {
  console.error('\nDesign-system validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('\nDesign-system validation passed.');
}
