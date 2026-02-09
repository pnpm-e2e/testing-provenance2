#! /usr/bin/env node
const fs = require('fs')
const { spawnSync } = require('exec-inline')
const manifest = require('./package.json')
const [major, minor, oldPatch] = manifest.version.split('.')
const newPatch = Number(oldPatch) + 1
manifest.version = `${major}.${minor}.${newPatch}`
fs.writeFileSync(
  require.resolve('./package.json'),
  JSON.stringify(manifest, undefined, 2) + '\n',
)
spawnSync('git', 'add', '-v', './package.json').exit.onerror()
spawnSync('git', 'commit', '-m', manifest.version).exit.onerror()
spawnSync('git', 'tag', `v${manifest.version}`).exit.onerror()
