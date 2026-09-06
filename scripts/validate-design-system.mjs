import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const appPath = resolve(root, 'src/App.tsx');
const stylesPath = resolve(root, 'src/styles.scss');
const packagePath = resolve(root, 'package.json');
const appSource = readFileSync(appPath, 'utf8');
const stylesSource = readFileSync(stylesPath, 'utf8');
const packageSource = JSON.parse(readFileSync(packagePath, 'utf8'));

const failures = [];
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => failures.push(message);

function requireSource(label, fragments) {
  const missing = fragments.filter((fragment) => !appSource.includes(fragment));
  if (missing.length > 0) {
    fail(`${label}: missing ${missing.join(', ')}`);
    return;
  }
  pass(label);
}

function requireStyles(label, fragments) {
  const missing = fragments.filter((fragment) => !stylesSource.includes(fragment));
  if (missing.length > 0) {
    fail(`${label}: missing ${missing.join(', ')}`);
    return;
  }
  pass(label);
}

const forbiddenPackages = [
  'tailwindcss',
  '@mui/',
  '@chakra-ui/',
  'styled-components',
  'shadcn',
];
const dependencyNames = Object.keys({ ...packageSource.dependencies, ...packageSource.devDependencies });
const forbiddenDependency = dependencyNames.find((name) => forbiddenPackages.some((value) => name === value || name.startsWith(value)));
if (forbiddenDependency) fail(`Only Carbon runtime dependencies are allowed; found ${forbiddenDependency}`);
else pass('No secondary design-system dependencies');

if (appSource.includes("from '@carbon/react'") && appSource.includes("from '@carbon/charts-react'")) pass('Carbon React and Carbon Charts are the runtime UI vocabulary');
else fail('Carbon runtime imports are incomplete');

const rawControls = /<(button|input|select|textarea)\b/.exec(appSource);
if (rawControls) fail(`Custom control duplicates Carbon: <${rawControls[1]}>`);
else pass('No custom HTML controls duplicate Carbon components');

if (/#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i.test(stylesSource)) fail('Arbitrary hex colors found in application CSS');
else pass('No arbitrary hex colors found');

if (/(?:margin|padding|gap|width|height)\s*:\s*\d+px/.test(stylesSource)) fail('Arbitrary pixel layout values found in application CSS');
else pass('Application layout uses Carbon tokens rather than arbitrary pixel spacing');

requireSource('Record-management composition', [
  'Search',
  'Select',
  'DataTable',
  'Tag',
  'OverflowMenu',
  'Modal',
  'InlineNotification',
]);

requireSource('Destructive-action confirmation', ['danger', 'Revoke access', 'onRequestSubmit={handleRevoke}']);
requireSource('Search and role filter target the member dataset', ['visibleMembers', 'searchQuery', 'roleFilter', 'members.filter']);
requireSource('Required data states', ['loadState === \'loading\'', 'loadState === \'error\'', 'members.length === 0', 'visibleMembers.length === 0']);
requireSource('Accessible control naming', ['labelText="Search members"', 'labelText="Role"', 'aria-label={`Actions for ${member.name}`}']);
requireStyles('Record-management surfaces share an aligned content frame', ['.team-controls', '.team-table-frame', 'max-width: 84rem', 'width: 100%', 'table-layout: fixed']);

const commands = [
  ['typecheck', 'tsc', ['-b', '--pretty', 'false']],
  ['lint', 'eslint', ['.']],
  ['build', 'vite', ['build']],
];

for (const [label, binary, args] of commands) {
  const binaryPath = resolve(root, 'node_modules/.bin', binary);
  if (!existsSync(binaryPath)) {
    fail(`${label} command unavailable at ${binaryPath}`);
    continue;
  }
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
