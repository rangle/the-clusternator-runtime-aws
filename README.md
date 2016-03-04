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
