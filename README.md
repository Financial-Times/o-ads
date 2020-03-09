# oAds [![CircleCI Status](https://circleci.com/gh/Financial-Times/o-ads.svg?style=shield&circle-token=36a37c6ca27a08408c2575c7834f5f6f5c5c9d21)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This is an Origami module that enables advertising from [Google's DFP Ad Server (part of Ad Manager)](https://support.google.com/admanager/answer/6022000?hl=en), and provides customised demographic and contextual (via [Admantx](http://admantx.com/)) targeting.

## Requirements
For basic use, a DFP (DoubleClick for Publishers) account with Google is required.
Each targeting/tracking supplier will require their own configuration and setup.

## Demos
Demos for all ads currently served across ft.com are available in the [Origami Registry](http://registry.origami.ft.com/components/o-ads).

## [Documentation](https://financial-times.github.io/o-ads)
Includes detailed installation and set-up instructions, along with details about the module.

To build the documentation locally, from the `docs` directory, run:

```bash
bundle install
jekyll build
```

It will generate a `_site` directory where generated site will be compiled
You can then run the jekyll local server by executing `jekyll serve`.
## Developing

### Install & Demos

- To install: `obt install`.
- To run the demos: `obt demo`.
- To run a demo server: `npm run demo-server`

### Tests

See the [test documentation](https://github.com/Financial-Times/o-ads/blob/master/test/README.md)

### Releasing

You will need a `GITHUB_TOKEN` environment variable with access to the repository in your .env file
[Get a github token](https://github.com/settings/tokens) with "repo" access and make it accessible as an environment variable.

Run `npm run release (patch|minor|major|x.y.z)` in `master` then follow the interactive steps.

This will bump version numbers in the source and commit them, push to github and create a new release.

The command uses [release-it](https://github.com/webpro/release-it) under the hood as well as genversion to automatically bump version numbers in the source.

## Migration Guide

[Available here](https://github.com/financial-times/o-ads/blob/master/MIGRATION.md)