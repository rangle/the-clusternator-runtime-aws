The Clusternator Runtime AWS
============================

This software is inteded for use by 
[The Clusternator](http://clusternator.rangle.io "The Clusternator")
_not_ end users or developers.  This software is responsible
for bundling Docker images and POSTing to Clusternator
servers.

## Development

The `aws-sdk` dependency should be the only runtime dependency 
this project uses.  `devDependencies` are okay. The idea is to
keep the runtime `npm install` as light as possible.

Please see The Clusternator's contributor's guide for more
information.

### Scripts

- `npm run build` cleans, tests, builds
- `npm run clean` removes the lib folder
- `npm run cover` runs the test coverage command (prefer `npm test`)
- `npm run lint` runs the linter
- `npm run test` runs the test suite
- `npm run transpile` transpiles js
- `npm run transpile:w` transpile/watch

## Clusternator Pollution

The Clusternator runtime is designed to limit the amount of data The
Clusternator needs to keep in a project.  The first goal is to get
the runtime working with the _current_ version of The Clusternator 

The second goal is to limit project pollution to:

- `clusternator.json` project's public config
- `.private/clusternator-private.json` project's private config
- `clusternator.tar.gz.asc` project's private tarball
- `.private/public-ssh/*` user _public_ ssh keys
- `.private/**/*` user optional private files

Current Clusternator (0.5.3) has _significantly_ more pollution than
outlined above.

