#!/usr/bin/env node

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = './build';
const DEFAULT_PORT = 3001;

const args = process.argv.slice(2);
const scriptIndex = args.findIndex(
  (x) => x === 'build' || x === 'start' || x === 'test' || x === 'start:plugin'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJSON?.name) {
  console.log(
    '[momentum-plugin] ERROR: "name" field in package.json was not found.\nPlease make sure that package.json exists or define "name" field in package.json.'
  );
  process.exit(1);
}

switch (script) {
  case 'start:plugin':
  case 'start':
  case 'build':
  case 'test': {
    const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];
    const configPath = require.resolve(`../craco.config.js`);
    const command = script === 'start:plugin' ? 'start' : script;
    const processArgs = nodeArgs.concat(command).concat('--config').concat(configPath);

    const env = {
      ...process.env,
      PLUGIN_EMULATOR: script === 'start' ? '1' : '',
      PLUGIN_NAME: packageJSON.name,
      PORT: process.env.PORT ?? packageJSON.port ?? DEFAULT_PORT
    };

    spawnProcess('craco', processArgs, env);
    break;
  }
  default:
    console.log(`Unknown script "${script}".`);
    console.log('Perhaps you need to update @momentum-xyz/sdk?');
    break;
}

switch (script) {
  case 'build':
    generateAndStoreManifest();
    break;
  default:
    break;
}

function spawnProcess(command, args, env) {
  const child = spawn.sync(command, args, {
    stdio: 'inherit',
    env
  });

  if (child.signal) {
    if (child.signal === 'SIGKILL') {
      console.log(
        '[momentum-plugin] ERROR: The build failed because the process exited too early.\nThis probably means the system ran out of memory or someone called `kill -9` on the process.'
      );
    } else if (child.signal === 'SIGTERM') {
      console.log(
        '[momentum-plugin] ERROR: The build failed because the process exited too early.\nSomeone might have called  `kill` or `killall`, or the system could be shutting down.'
      );
    }

    process.exit(1);
  }

  // process.exit(child.status);
}

function generateAndStoreManifest() {
  const {
    name,
    version,
    description,
    author,
    repository,
    homepage,
    license,
    attribute_types = [],
    scopes = []
  } = packageJSON;
  const manifest = {
    name,
    version,
    description,
    author,
    repository,
    homepage,
    license,
    attribute_types,
    scopes
  };
  const filename = path.resolve(BUILD_DIR, 'manifest.json');
  fs.writeFileSync(filename, JSON.stringify(manifest, null, 2));
  console.log('[momentum-plugin] Manifest generated and stored in', filename);

  const versionedDir = `./${name}-${version}`;

  fs.renameSync(BUILD_DIR, versionedDir);
  console.log('[momentum-plugin] Plugin build stored in', BUILD_DIR);

  spawnProcess('tar', ['-czf', `${versionedDir}.tar.gz`, versionedDir], {});
  console.log('[momentum-plugin] Plugin tarball generated: ', `${versionedDir}.tar.gz`);
}
