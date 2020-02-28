# oAds [![CircleCI Status](https://circleci.com/gh/Financial-Times/o-ads.svg?style=shield&circle-token=36a37c6ca27a08408c2575c7834f5f6f5c5c9d21)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This is an Origami module that enables advertising from [Google's DFP Ad Server (part of Ad Manager)](https://support.google.com/admanager/answer/6022000?hl=en), and provides customised demographic, behavioural (via [Krux](http://www.krux.com/)), and contextual (via [Admantx](http://admantx.com/)) targeting.

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

### Upgrading to v14

This release does not change any o-ads behaviour however it now uses the latest major versions of all Origami sub-dependencies.

The following origami dependencies were updated: o-colors,o-visual-effects, o-viewport, o-grid, ftdomdelegate

Some CSS properties needed to be updated in order to work with the updated down-stream dependancies.

We have also added document.visibilityState to the Origami Required [BrowserFeatures](https://origami.ft.com/spec/v1/manifest/#browserfeatures) list as the polyfill for this feature was removed from the latest version of o-viewport.


### Upgrading to v13

This release removes integration with Krux for behavioural targeting.
The origami component [o-permutive](https://registry.origami.ft.com/components/o-permutive) can be used for behavioural tracking instead.

### Upgrading to v12

This release introduces the following changes:

  1. **`o-ads` is now recording a performance mark for every event that it dispatches.** The performance mark will have the same name as the event that originated it plus, in some cases, a suffix that helps determine the circumstances that triggered the event. This is all being used internally by `o-ads` to provide new metrics functionality.  

2. **`o-ads` exposes a new `setupMetrics` method that simplifies obtaining performance metrics.** `setupMetrics` accepts two parameters:
 - An array of objects containing the configuration of the different metrics that need to be tracked.
 - A callback function to be called whenever any of the trigger events of any of those configuration objects is dispatched.

3. **Several custom events fired by o-ads have been renamed for different reasons.** This is the list of events whose name has changed:

Old event name | New event name
:--:|:--:
startInitialisation | initialising
moatIVTcomplete | IVTComplete
apiRequestsComplete |  adsAPIComplete
adServerLoadSuccess |  serverScriptLoaded
ready | slotReady
render |slotCanRender 
gptDisplay |slotGoRender
rendered | slotRenderStart
complete | slotExpand
adIframeLoaded | slotRenderEnded

A guide can to the new names can also be found in this two diagrams:

#### Event renaming pt. 1
![event renaming 1](https://raw.githubusercontent.com/Financial-Times/o-ads/master/docs/assets/v12_event_renaming_1.png)

#### Event renaming pt. 2
![event renaming 2](https://raw.githubusercontent.com/Financial-Times/o-ads/master/docs/assets/v12_event_renaming_2.png)

### Upgrading to v11

As of version 11, o-ads has been updated to use ES modules. Unfortunately, this means it is not backwards compatible with CJS modules and clients cannot `require('o-ads')` anymore.
- Breaking change: if importing o-ads in your build, you must now do it as follows: `import oAds from 'o-ads'`

### Upgrading to v10

- Breaking change: o-ads now defaults to never collapsing empty ads slots following google gpt behavior.
- Breaking change: collapsing config oAds takes 3 possible options for the `collapseEmpty` attribute: `'before'`, `'after`', `'never'` and defaults to `'never'`
- Breaking change: collapsing ads for a specific slot on the markup now uses  `'before'`, `'after`', `'never'` instead of `true` and `false` previously
- Breaking change: Global collapse empty behavior is set in `config.collapseEmpty` instead of `config.gpt.collapseEmpty` previously

### Upgrading to v9
- Breaking change: o-ads now requires consent before loading Krux or adding custom targeting to the ad calls. Consent can be provided in two ways:

1. Provide a cookie with the name `FTConsent` and specify which consent the user has given as part of the value like this: `behaviouraladsOnsite:on,programmaticadsOnsite:on`
2. Initialise o-ads with the `disableConsentCookie` option.

### Upgrading to v8
- Breaking change: If you use the destroy method on a slots instance, this will now properly destroy the given slots rather than just clear them
- New feature: util event 'off' - remove an event listener
