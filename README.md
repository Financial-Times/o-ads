# @financial-times/o-ads [![CircleCI](https://circleci.com/gh/Financial-Times/o-ads/tree/master.svg?style=svg&circle-token=ff0caeb981693cbbbab6b70ab0ac99c9314bfc4f)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This package contains the core functionality used by the FT in providing ads across all of its sites. This includes ft.com, howtospendit.com, ftadviser.com and other specialist titles.

This doc is specific to the o-ads library. For more information about the ads ecosystem at the FT, visit the [Ads wiki](https://github.com/financial-times/advertising/wiki)

***Note**: This package is over 5 years old and will soon be deprecated in favour of more modern tools. Please speak to the advertising team (Slack #advertising-dev) if you are thinking of using this.*

## Table of Contents
**[1. Install](#install)**

**[2. Setup & Configuration](#setup-config)**

**[3. Define Ad Slots](#define-ad-slots)**

**[4. Targeting](#targeting)**

**[5. Lazy Loading](#lazy-loading)**

**[6. Invalid Traffic](#invalid-traffic)**

**[7. Styling](#styling)**

**[8. Collapsing](#collapsing)**

**[9. Events](#events)**

**[10. Metrics & Monitoring](#metrics--monitoring)**

**[11. Misc](#misc)**

**[12. Developing](#developing)**

**[13. Migration](https://github.com/financial-times/o-ads/blob/HEAD/MIGRATION.md)**


## Install

Check out [how to include Origami components in your project](https://origami.ft.com/docs/components/#including-origami-components-in-your-project) to get started with `o-ads`.

## Setup & Configuration

### Intialise the library
Step two. You'll need to initialise the o-ads library with some confirguration options in order for it to work. There are 2 ways of doing this:

#### Declaratively

If you've included o-ads directly on your site using the script provided above, you'll need to initialise it declaratively like so:

```javascript
<script data-o-ads-config type="application/json">
{
  "gpt": {
    "network": 5887,
    "site": "test.5887.origami"
   }
}
</script>
```

 *Note: See below for all config options*

 #### Programatically

If you've include o-ads in you code through npm, you will need to initialise it like so:

```javascript
// your/app/ads.js
import oAds from '@financial-times/o-ads';
oAds.init({
  gpt: {
    network: 5887,
    site: "test.5887.origami"
  }
  ...other config options
});
```

 *Note: See below for all config options*

### Configuration Options {#config-options}

These are all the valid configuration options that can be used to set up o-ads:

- `gpt` **(required)** `<Object>` - GPT settings
  - `gpt.network` **(required)** `<Number>`
  - `gpt.site` **(required)** `<String>`
  - `gpt.zone` *(optional)* `<String>`
  - `gpt.rendering` *(optional)* `<String> "sync" | "sra" | "async" (default)` - GPT Rendering Mode Sync, SRA or Async
  - `gpt.enableLazyLoad` *(optional)* `<Object>` - GPT Lazy Load, where configuration parameters allow customization of lazy loading behaviour.

    Default settings are
      ```
        fetchMarginPercent: 500, // minimum distance from the current viewport a slot must be before we fetch the ad as a percentage of viewport size. 0 means "when the slot enters the viewport", 100 means "when the ad is 1 viewport away"
        renderMarginPercent: 200, // minimum distance from the current viewport a slot must be before we render an ad. This allows for prefetching the ad, but waiting to render and download other subresources. The value works just like fetchMarginPercent as a percentage of viewport.
        mobileScaling: 2.0 // a multiplier applied to margins on mobile devices. This allows varying margins on mobile vs. desktop. For example, a mobileScaling of 2.0 will multiply all margins by 2 on mobile devices, increasing the minimum distance a slot can be before fetching and rendering.
      ```
- `canonical` *(deprecated)* `<String>` - Overwrite the GPT *page_url* parameter **DO NOT USE**
- `collapseEmpty` *(optional)* `<String> "before" | "after" | "never"` - How should the slot be collapsed if there is no ad to be shown
  - `"before"` - The ad slot will be collapsed before the ad request until an ad is found.
  - `"after"` - The ad slot will be collapsed if no ad is found after the ad request.
  - `"never"` - The ad slot never collapses, even if no ad is found.
- `disableConsentCookie` *(optional)* `<Boolean>` - o-ads looks for consent in the FTConsent cookie. Set to false to disable this.
- `flags` *(deprecated)* `<Object>` - Flags object. **DO NOT USE**
- `formats` *(optional)* `<Object>` - Define custom  formats for ad slots
- `lazyLoad` *(optional)* `<Object|Boolean>` - Lazy load ads as they scroll into view
  - `lazyload.viewportMargin` **(required)** `<String>` - The `rootMargin` setting of the [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). E.g. `"0% 0% 100% 0%"`
  - `lazyload.threshold` **(required)** `<Array>` - How much of the ad space should be in view before it's loaded. Number between 0 - 1. E.g. `[0.5]`
- `passOAdsVersion` *(optional)* `<Boolean>` - Include the version of o-ads in the ad calls
- `responsive` *(optional)* `<Object>` - Overwrite the default breakpoints. See [breakpoints](#breakpoints)
- `slots` *(deprecated)* `<Object>` - Old way of defining slots. See [Defining an Ad Slots]()
- `targeting` *(optional)* `<Object>` - An object of key => value pairs that will be appended to every ad call on the page
- `displayLabelWithBorders` *(optional)* `<Boolean>` - Display ad slots with borders on the top and bottom

## Define Ad Slots

Step three. Create some ad slots. Once you've included and configured o-ads onto your website, you'll want to create some placeholders for your ads. These are the HTML elements where the ad will render. These can be defined declarately within a HTML page.

### The Simplest Ad

This is the minimum required for an ad slot to be defined. We set some options via html attributes on the slot element. We are naming the ad slot *exampleAdSlot* and tell it to only return ads of the format *MediumRectangle*. This will be processed by o-ads and an ad will be rendered inside the `<div>` if the ad request is successful.

```html
<div
  data-o-ads-name="exampleAdSlot"
  data-o-ads-formats-default="MediumRectangle"
  aria-hidden="true">
</div>
```



*See [Ad Formats](#formats)* and [Breakpoints](#breakpoints)

### Ad slot options {#ad-slot-options}

These are all the options that an ad slot can have, declared as attributes on the html element (see example above)

- **`data-o-ads-name="example"`** - Name of the ad slot
- **`data-o-ads-formats-default="<Format Name>"`** - The default ad format served at any breakpoint. For full list of format see [Ad Formats](#formats)
- **`data-o-ads-formats-small="<Format Name>"`** - The ad format served at the small breakpoint. See [Formats](#formats) and [Breakpoints](#breakpoints)
- **`data-o-ads-formats-medium="<Format Name>"`** - The ad format served at the medium breakpoint. See [Formats](#formats) and [Breakpoints](#breakpoints)
- **`data-o-ads-formats-large="<Format Name>"`** - The ad format served at the large breakpoint. See [Formats](#formats) and [Breakpoints](#breakpoints)
- **`data-o-ads-formats-extra="<Format Name>"`** - The ad format served at the extra large breakpoint. See [Formats](#formats) and [Breakpoints](#breakpoints)
- **`data-o-ads-collapse-empty="before|after|never"`** - Set how the ad slot will collapse if there is no ad. (See *collapseEmpty* [configuration option](#config-options))
- **`data-o-ads-collapse-empty="before|after|never"`** - Set how the ad slot will collapse if there is no ad. (See collapseEmpty [configuration option](#config-options))
- **`data-o-ads-loaded="<Format Name>`** - This is set automatically by o-ads to the format of the ad that was loaded in this ad slot. See [Formats](#formats) and [Changing behaviour based on ads loaded](#ads-loaded)
- **`data-o-ads-targeting="key=value;key2=value2;"`** - Ad targeting info specific to the ad slot. See [Targeting](#targeting)
- **`data-o-ads-out-of-page="true"`** - Serve an ad that pops out of its iframe
  - Out-of-page line items make it easier to serve web creatives that do not fit in a traditional banner space or browser window. They may include pop-ups and floating line items and are sometimes called interstitials.
  - To serve pop-up, pop-under, or floating creatives to your website, you’ll need to traffic the creatives using one of Ad Manager’s built-in creative templates, and you’ll need to make sure your tags are set up properly to allow these creative types to serve. For more info, see [Ad Manager traffic and serve out-of-page creatives](https://support.google.com/admanager/answer/6088046?hl=en&visit_id=637199698557735781-1262725011&rd=1)

### Ad Formats

Formats are predetermiend ad sizes that you can request for your ad. You can specify one format as in the above example, or you can specify multiple formats for different breakpoints. The following example loads a MediumRectangle ad at the small breakpoint, a Leaderboard ad at the medium breakpoint a SuperLeader ad at the large breakpoint and no ad at the extra large breakpoint.

```html
<div
  class="o-ads"
  data-o-ads-name="example"
  data-o-ads-formats-small="MediumRectangle"
  data-o-ads-formats-medium="Leaderboard"
  data-o-ads-formats-large="SuperLeaderboard"
  data-o-ads-formats-extra="false"
  aria-hidden="true">
</div>
```

#### Default breakpoints {#breakpoints}
The default breakpoints provided in o-ads are as follows:
- **small**: 0px (This is the size where it is appropriate to show a MediumRectangle)
- **medium**: 760px (This is the size where it is appropriate to show a Leaderboard)
- **large**: 1000px (This is the size where it is appropriate to show a SuperLeaderboard, and roughly equates to a landscape tablet)
- **extra**: 1025px (This additional breakpoint can fit a SuperLeaderboard/Billboard, and roughly equates to a larger desktop)

***Note**: You can change the breakpoint definitions with the `responsive` config property:*
```javascript
oAds.init({
  ...
  responsive : {
    extra : [1400, 0],
    someOther: [1200, 0],
    large : [1000, 0],
    medium : [600, 0],
    small : [0, 0]
  }
  // where each array is in the format [width, height]
  ...
});
```

#### Default Formats {#formats}

Here are all the available ad formats and their corresponding ad sizes:

| Format Name           | Size      |
|--                     | --        |
| MediumRectangle (MPU) | 300x250 |
| Rectangle             | 180x50    |
| Leaderboard           | 728x90    |
| SuperLeaderboard      | 970x90    |
| Billboard             | 970x250   |
| Responsive            | 2x2       |
| WideSkyscraper        | 160x600   |
| HalfPage              | 300x600   |
| Portrait              | 300x1050  |
| AdhesionBanner        | 320x50    |
| MicroBar              | 88x31     |
| Button2               | 120x60    |

***Note:** You can ad extra formats with the `formats` config option when initialising o-ads:*
```javascript
oAds.init({
  formats: {
    testFormat: {sizes: [[970, 90], [970, 66], [180, 50]]}
  }
});
```

## Targeting

Ads can contain extra information about a user, page, or any other useful info that could be used in Google Ad Manager. There are three ways of adding targeting information to an ad request.

### Page level targeting

You can specify an object of key => value pairs when initialising o-ads. Each key => value pair will be appended to every ad request on the page

```javascript
oAds.init({
  ...
  targeting: {
    key: "value",
    key2: "value2",
    ...
  },
  ...
});
```

### Ad slot level targeting

You can also specify targeting parameters for any particular ad slot, by using the `data-o-ads-targeting` attribute when defining the ad slot:

```html
<div
  class="o-ads"
  data-o-ads-name="example"
  data-o-ads-targeting="pos=top;version=1;test=yes"
  data-o-ads-formats-default="MediumRectangle"
  aria-hidden="true">
</div>
```

## Lazy Loading

o-ads can be configured to lazy-load ads (i.e. only trigger the ad call when the ad is in view, or close to being in view). **It is disabled by default**

Lazy Loading uses Intersection Observer under the hood.

```javascript
oAds.config({
  lazyLoad: true
});

// or

oAds.config({
  lazyLoad: {
    viewportMargin: '0% 0% 100% 0%',
    threshold: [0.5]
  }
});
```

- `viewportMargin` - Sets a new margin within the viewport that determines at what point the advert is in view. We suggest setting this option when you want to request and display the advert just before it comes into view. This works as regular margin definitions. Make sure you always specify the dimensions with either px or %, e.g. 100% 0%, or 100px 0px. Default is 0%.

- `threshold` - An array of values that determine at what point a callback will be triggered. In this case, the threshold is a percentage of the intersection area in relation to the area of the target’s bounding box (where the target is a DOM element relative to a containing element or to the top-level viewport). Intersection Observer. Thresholds can be any value between 0.0 and 1.0, inclusive. Default is 0, meaning that as soon as the first pixel comes into view, the advert will be loaded.

There is one exception to lazy loading, which is Master/Companion. Based on the way that this pair of creatives are related in DFP, the companion is loaded soon after the master, which overrides lazy loading.

## Styling

o-ads provides some classes to add some basic branded styling to the ad slot.

- `.o-ads--reserve-90` This is a placeholder for an area of height 90px (with padding) in the slot. This is used to prevent the page jumping when an ad loads (at least when a Leaderboard/SuperLeaderboard height ad is served).

- `.o-ads--reserve-250` As above - but should only really be used if only a 250px height ad will be used in that slot (as other ads would have empty space around as a result).

- `.o-ads--background` This adds a shaded background in the slot. In principle, this is only really used when an ad is at the top of the page above a header, in order to give some indication that the empty space is intentional.

- `.o-ads--slate-background` This is the same as .o-ads--background except that the background is slate (almost black).

- `.o-ads--placeholder` This displays a backgound image (currently an ellipsis) to give the user a clear indication that something will be loaded in this place.

- `.o-ads--transition` Adds an animation to the container to ease the UX when an ad loads.

- `.o-ads--center` Horizontally centres the ad.

- `.o-ads--label-left` Adds a label above the ad indicating that it is an advertisement. This is required for when the ad sits in between content (e.g. in the middle of an article).

## Collapsing
A creative may not be served under one of the following circumstances:

1. **A bug in the creative** - The ad server served an ad correctly, but some bug in the creative causes it not to display anything. A common example of this would be if the ad’s assets were insecure. This needs to be reported to AdOps as soon as possible - ideally with the creative Id or line item Id

2.  **Collapsed ad** - This is when AdOps explicitly send instructions to an ad slot not to show anything, maybe because an advertiser wants exclusivity on the page, but might not have assets with all the correct sizes. This is done via a particular creative that contains some code implemented throught o-ads-embed telling it to collapse itself. It should then append the class o-ads--empty to the ad slot.

3. No ad This is when the ad server fails to return any ad. This could be caused by an ad call that is missing the correct targeting parameters and ad unit. However, it should be rare, as AdOps usually fall back to either programmatic advertising or House Ads

### Collapsing of empty ad slots
There are three options available for how the ad slot should react to the absence of an ad.

1. **before:** The ad slot will be collapsed before the ad request until an ad is found.

2. **after:** The ad slot will be collapsed if no ad is found after the ad request.

3. **never:** The ad slot never collapses, even if no ad is found.

By default, collapsing of empty ads is disabled (never).

Via config for page level:

```javascript
oAds.config({
	collapseEmpty: "before",
	...
});
```

Via config for a specific slot
```javascript
oAds.config({
	slots: {
		outstream: {
			collapseEmpty: "before"
		}
	},
	...
});
```

```html
<!-- view.html -->
<div class="o-ads" data-o-ads-name="outstream"></div>
```

Via component

```html
<div class="o-ads" data-o-ads-collapse-empty="before"></div>
```

## Events

### `oAds.initialising`
Triggered when the library starts the initialisation process.

### `oAds.initialised`
Triggered when the library has been initialised and the config has been set. (Note: the GPT library may not have been loaded by this point).

### `oAds.serverScriptLoaded`
Triggered when both the GPT library is loaded and oAds.initialised has happened. This marks the completion of the page-level tasks required to enable requests to the ad server.

### `oAds.adServerLoadError`
Triggered if the library fails to load the external JS GPT library, meaning no advertising will work. Can be used if you wish to have a fallback when you know the adverts will not display.

### `oAds.slotReady`
Slot has been inited in the oAds library and is about to be requested from the ad server (deferred if lazy loading is on).

### `oAds.slotRenderStart`
Triggered once the ad has been rendered on the page.

### `oAds.slotExpand`
If and when a creative has been returned, this event announces it has now been initialised in oAds, requested from the ad server and displayed. Triggered after oAds.slotRenderStart.

### `oAds.slotCanRender`
Lazy loaded advert has been requested.

### `oAds.refresh`
A refresh event has been triggered on an advert, prompting a new request to the ad server.

### `oAds.breakpoint`
If the oAds is configured to use responsive adverts with set breakpoints, it will trigger the event on each of the breakpoints that was specified in the config. Note that the breakpoint triggering does not take the scrollbar into consideration. For more information read about DFP - Build responsive ads.

### `oAds.collapse`
Event is emitted when the slot is collapsed. The event detail contains oAds slot instance.

## Metrics & Monitoring
As of version 12, o-ads includes some built-in functionality to help monitor the ads loading flow.

Firstly, o-ads saves a [performance mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) every time it dispatches one of the many [events](#events) that indicate a milestone in the ads loading process. If used from [n-ads](https://github.com/Financial-Times/n-ads), extra performance marks might be added. See the [n-ads docs](https://github.com/Financial-Times/n-ads#monitoring)

### `oAds.utils.setupMetrics()`
o-ads is now exposing a new method, `oAds.utils.setupMetrics()` which enables setting up all ads-related metrics in one step.

```javascript
setupMetrics(eventDefArray, callback, disableSampling):
```

- `eventDefArray` **(required)** `<Array>`- An array of configuration objects, each of which corresponds to one group of o-ads events. Each config object must have these fields:
  - `spoorAction` **(required)** `<String>` - A string indicating the name of the group.
  - `marks` **(required)** `<Array>` - An array of strings indicating the name of the o-ads [events](#events) whose metrics we want to include in the group. Notice that the oAds. preffix must be omitted.
  - `triggers` **(required)** `<Array>` - An array of strings including all the o-ads events that cause the callback to be invoked.
  - `multiple` (optional) `<Boolean>` - Can the callback be called multiple times for the group? *Default:* `false`
  - `sampleSize` (optional) `<Number>` - Number between 0 and 1 indicating the probability the callback is actually called. If it’s omitted, the callback will be called every time one of the triggering events is dispatched.
- `callback` **(required)** `<Function>` - A function that will be invoked for each of those groups, possibly multiple times for each. When invoked, the callback will receive an object with information about the timings associated to the events in the group.
- `disableSampling` (optional) `<Boolean>` - A boolean indicating if the sampling specified in the `eventDefArray` should be ignored. That is, when set to true, no sampling will be applied. Default: `false`


#### `setupMetrics()` Example
It’s easier to understand how to configure o-ads with an example:
```javascript
const metricsDefinitions = [

	{
		spoorAction: 'page-initialised',
		triggers: ['serverScriptLoaded'],
		marks: [
			'initialising',
			'IVTComplete',
			'adsAPIComplete',
			'initialised',
			'serverScriptLoaded',
      'consentBehavioral',
      'consentProgrammatic',
		]
	},
	{
		spoorAction: 'slot-requested',
		triggers: ['slotGoRender'],
		marks: [
			'slotReady',
			'slotCanRender',
			'slotGoRender',
		],
		multiple: true
	},
	{
    sampleSize: 0.1,
		spoorAction: 'slot-rendered',
		triggers: ['slotRenderEnded'],
		marks: [
			'slotRenderStart',
			'slotExpand',
			'slotRenderEnded',
		],
		multiple: true
	}
];

 function callback(eventPayload) {
	nUIFoundations.broadcast('oTracking.event', eventPayload);
}

oAds.utils.setupMetrics(metricsDefinitions, sendMetrics);
}
```
In this example there are four different metrics groups. The first one will invoke the callback whenever the trigger (`oAds.serverScripLoaded`) is dispatched. The callback will receive an object including any available information about several potential time marks (`initialising`, `IVTComplete`, `adsAPIComplete`, `initialised`, `serverScriptLoaded`, …). If there is no information about any of those marks, the callback will still be called without it. Since the `multiple` parameter is missing, its default value of `false` is assumed which means that, once called, the callback will not be called again for the same page view even if, somehow, `oAds.serverScriptLoaded` was dispatched again.

`slot-rendered` and `slot-requested` config is similar to `page-initialised`. However, the `multiple: true` parameter allows the callback to be called as many times as their respective triggering events are dispatched during the same page view. Which, in this case, is the right thing to do since we expect a page to contain, potentially, multiple ad slots.

Finally, the `sampleSize: 0.1` parameter on the `slot-rendered` group randomizes the possibility that the callback is actually called when the `oAds.slotRenderEnded` event is dispatched, giving it only a 10% chance. This can be used to reduce the number of total “monitoring” events that get fired across the user base.

### `oAds.utils.clearPerfMarks()`
Clear entire groups of performance marks created during previous ad loading cycles by some `setupMetrics()` configuration. This is specially useful in websites that behave like single-page applications and don’t automatically clear the browser’s performance entry buffer very often.

```javascript
oAds.utils.clearPerfMarks(eventDefArray, groupsToClear)
```

- `eventDefArray` **(required)** `<Array>` - An array of metrics groups expected to have the same structure as defined in [setupMetrics()](#oadsutilssetupmetrics).
- `groupsToClear` **(required)** `<Array>` - An array of metrics groups whose associated performance marks we want to remove.

#### `clearPerMarks()` Example:
```javascript
const metricsDefinitions = ... // as per the 'setupMetrics' example

// Clear all existing performance marks defined in the 'slot-rendered' and 'slot-rendered' groups
oAds.utils.clearPerfMarks(metricsDefinitions, ['slot-requested', 'slot-rendered']);
```
With the previously defined `metricsDefinitions` array, this code will remove all `slotReady`, `slotCanRender`, `slotGoRender`, `slotRenderStart`, `slotExpand` and `slotRenderEnded` existing marks

## Misc

### Changing behaviour based on which ad loads {#ads-loaded}

All ads get an attribute added called `data-o-ads-loaded`, which contains the format of the ad that loaded. For example, `data-o-ads-loaded="Billboard"`.

A product can use this to change the styles based on which ad has loaded (for example, to increase the height of a reserved slot if a larger ad loads).

## Developing

#### Install & Demos

- To install: `obt install`.
- To run the demos: `obt demo`.
- To run a demo server: `npm run demo-server`

#### Tests

See the [test documentation](https://github.com/Financial-Times/o-ads/blob/HEAD/test/README.md)

#### Releasing

You will need a `GITHUB_TOKEN` environment variable with access to the repository in your .env file
[Get a github token](https://github.com/settings/tokens) with "repo" access and make it accessible as an environment variable.

Run `npm run release (patch|minor|major|x.y.z)` in `main` then follow the interactive steps.

This will bump version numbers in the source and commit them, push to github and create a new release.

The command uses [release-it](https://github.com/webpro/release-it) under the hood as well as genversion to automatically bump version numbers in the source.

## Migration

See the [migration guide](https://github.com/financial-times/o-ads/blob/HEAD/MIGRATION.md)
