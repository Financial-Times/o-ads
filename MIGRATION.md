# Migration Guide

## Upgrading to v18

### Targeting
BREAKING CHANGE: o-ads is no longer responsible for calling the ads-api to retrieve targeting information for ad requests. All targeting information is now passed when configuring oAds, through the `targeting` property. This contains an object of key => value pairs that will be appended to every ad request on the page. **Note: THE `dfp_targeting` AND `targetingApi` CONFIG OPTIONS ARE NO LONGER BEING USED. INSTEAD, USE `targeting`:

```javascript
import oAds from '@financial-times/o-ads'
oAds.init({
  ...
  targeting: {
    loggedIn: false,
    slv: "anon",
    otherKeys: "and values
  }
})
```

### Validate Ads Traffic
BREAKING CHANGE: o-ads is no longer responsible for validating the ads traffic via the moat script. This is now done in n-ads by calling `displayAds.validateTraffic()`. For other use cases, you must now simply include the following script on your page. This will add the extra `m_data` targeting parameter used to verify if traffic is valid.
```html
<script id='moat' defer src="https://sejs.moatads.com/financialtimesprebidheader859796398452/yi.js"></script>
```

## Upgrading to v16
BREAKING CHANGE: When using oAds.gpt.updatePageTargeting(), with no parameters, it will no longer clear the existing targeting parameters set on the global GPT object. Instead, you need to explicitly call oAds.gpt.clearPageTargeting() before any call to `oAds.gpt.updatePageTargeting()`.

## Upgrading to v15
 * Allows for the removal of key/values from URL parameters.
 * Removes 'q=' parameter from the URL that is passed as the `url` custom-targeting parameter

## Upgrading to v14

This release does not change any o-ads behaviour however it now uses the latest major versions of all Origami sub-dependencies.

The following origami dependencies were updated: o-colors,o-visual-effects, o-viewport, o-grid, ftdomdelegate

Some CSS properties needed to be updated in order to work with the updated down-stream dependancies.

We have also added document.visibilityState to the Origami Required [BrowserFeatures](https://origami.ft.com/spec/v1/manifest/#browserfeatures) list as the polyfill for this feature was removed from the latest version of o-viewport.


## Upgrading to v13

This release removes integration with Krux for behavioural targeting.
The origami component [o-permutive](https://registry.origami.ft.com/components/o-permutive) can be used for behavioural tracking instead.

## Upgrading to v12

This release introduces the following changes:

  1. **`o-ads` is now recording a performance mark for every event that it dispatches.** The performance mark will have the same name as the event that originated it plus, in some cases, a suffix that helps determine the circumstances that triggered the event. This is all being used internally by `o-ads` to provide new metrics functionality.  

1. **`o-ads` exposes a new `setupMetrics` method that simplifies obtaining performance metrics.** `setupMetrics` accepts two parameters:
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

### Event renaming pt. 1
![event renaming 1](https://raw.githubusercontent.com/Financial-Times/o-ads/master/docs/assets/v12_event_renaming_1.png)

### Event renaming pt. 2
![event renaming 2](https://raw.githubusercontent.com/Financial-Times/o-ads/master/docs/assets/v12_event_renaming_2.png)

## Upgrading to v11

As of version 11, o-ads has been updated to use ES modules. Unfortunately, this means it is not backwards compatible with CJS modules and clients cannot `require('o-ads')` anymore.
- Breaking change: if importing o-ads in your build, you must now do it as follows: `import oAds from 'o-ads'`

## Upgrading to v10

- Breaking change: o-ads now defaults to never collapsing empty ads slots following google gpt behavior.
- Breaking change: collapsing config oAds takes 3 possible options for the `collapseEmpty` attribute: `'before'`, `'after`', `'never'` and defaults to `'never'`
- Breaking change: collapsing ads for a specific slot on the markup now uses  `'before'`, `'after`', `'never'` instead of `true` and `false` previously
- Breaking change: Global collapse empty behavior is set in `config.collapseEmpty` instead of `config.gpt.collapseEmpty` previously

## Upgrading to v9
- Breaking change: o-ads now requires consent before loading Krux or adding custom targeting to the ad calls. Consent can be provided in two ways:

1. Provide a cookie with the name `FTConsent` and specify which consent the user has given as part of the value like this: `behaviouraladsOnsite:on,programmaticadsOnsite:on`
2. Initialise o-ads with the `disableConsentCookie` option.

### Upgrading to v8
- Breaking change: If you use the destroy method on a slots instance, this will now properly destroy the given slots rather than just clear them
- New feature: util event 'off' - remove an event listener
