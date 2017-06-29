# oAds [![CircleCI Status](https://circleci.com/gh/Financial-Times/o-ads.svg?style=shield&circle-token=36a37c6ca27a08408c2575c7834f5f6f5c5c9d21)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This is an Origami module that enables display advertising from [Googles DFP Ad server](http://www.google.com/dfp), and provides customised demographic, behavioural (via [Krux](http://www.krux.com/)), and contextual (via [Admantx](http://admantx.com/)) targeting.

### Requirements
For basic use, a DFP account with Google is required.  
Each targeting/tracking supplier will require their own configuration and setup.

### Demos
Demos for all ads currently served across ft.com are available in the [Origami Registry](http://registry.origami.ft.com/components/o-ads).

### [Documentation](https://financial-times.github.io/o-ads)
Includes detailed installation and set-up instructions, along with details about the module.

## Migration Guide

### Upgrading to v7

  - o-ads v7 introduces new major versions of [o-colors](https://registry.origami.ft.com/components/o-colors) and [o-visual-effects](https://registry.origami.ft.com/components/o-visual-effects). If you're using o-colors v3 or earlier or o-visual-effects v1, your build will break. Update to o-colors v4 and o-visual-effects v2 to resolve conflicts.
  - No other breaking changes in this release.

