# @financial-times/o-ads [![CircleCI](https://circleci.com/gh/Financial-Times/o-ads/tree/master.svg?style=svg&circle-token=ff0caeb981693cbbbab6b70ab0ac99c9314bfc4f)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This package contains the core functionality used by the FT in providing ads across all of its sites. This includes ft.com, howtospendit.com, ftadviser.com and other specialist titles.

***Note**: This package is over 5 years old and will soon be deprecated in favour of more modern tools. Please speak to the advertising team (Slack #advertising-dev) if you are thinking of using this.*

# Install
First thing's first. You need some code. There are two ways:
### 1. Include a script on your site
The simple way. All you need to do is include the following in the `<head>` section of your site.
```
<href="https://www.ft.com/__origami/service/build/v2/bundles/css?modules=o-ads@^16.0.0" />
<script src="https://www.ft.com/__origami/service/build/v2/bundles/js?modules=o-ads@^16.0.0" async />
```

*Note: At the time of writing, latest version of o-ads is v16.0.0. Check latest available version and replace in the script and link tags*

### 2. Include o-ads as part of your build
If you're using a build system, you can include o-ads in your code through npm

```
npm install @financial-times/o-ads --save
```

And in your file
```
import oAds from '@financial-times/o-ads'
```

# Setup & Configuration

## Intialise the library
You'll need to initialise the o-ads library with some confirguration options in order for it to work. There are 2 ways of doing this:

### Declaratively

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

 ### Programatically 

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

## Configuration Options

These are all the valid configuration options that can be used to set up o-ads:

- `gpt` **(required)** `<Object>` - GPT settings
  - `gpt.network` **(required)** `<Number>`
  - `gpt.site` **(required)** `<String>`
  - `gpt.zone` *(optional)* `<String>`
- `behavioralMeta` *(deprecated)* `<Object>` - Behavioural data set by the ads-api. **DO NOT USE**
- `canonical` *(deprecated)* `<String>` - Overwrite the GPT *page_url* parameter **DO NOT USE**
- `collapseEmpty` *(optional)* `<String> "before" | "after" | "never"` - How should the slot be collapsed if there is no ad to be shown
  - `"before"` - The ad slot will be collapsed before the ad request until an ad is found.
  - `"after"` - The ad slot will be collapsed if no ad is found after the ad request.
  - `"never"` - The ad slot never collapses, even if no ad is found.
- `dfp_targeting` *(optional)* `<String>` - Set targeting parameters for google ad manager
- `disableConsentCookie` *(optional)* `<Boolean>` - o-ads looks for consent in the FTConsent cookie. Set to false to disable this.
- `flags` *(deprecated)* `<Object>` - Flags object. **DO NOT USE**
- `formats` *(optional)* `<Object>` - Define custom  formats for ad slots
- `lazyLoad` *(optional)* `<Object|Boolean>` - Lazy load ads as they scroll into view
  - `lazyload.viewportMargin` **(required)** `<String>` - The `rootMargin` setting of the [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). E.g. `"0% 0% 100% 0%"`
  - `lazyload.threshold` **(required)** `<Array>` - How much of the ad space should be in view before it's loaded. Number between 0 - 1. E.g. `[0.5]`
- `passOAdsVersion` *(optional)* `<Boolean>` - Include the version of o-ads in the ad calls
- `responsive` *(optional)* `<Object>` - Overwrite the default breakpoints
- `refresh` *(deprecated)* `<Boolean>` - **DO NOT USE**
- `slots` *(deprecated)* `<Object>` - Old way of defining slots. See [Defining an Ad Slots]()
- `targetingApi` *(optional)* `<Object>` - API to call for targeting information
  - `targetingApi.user` *(optional)* `<String>` - API endpoint for user related data
  - `targetingApi.page` *(optional)* `<String>` - API endpoint for page related data
  - `targetingApi.usePageZone` *(optional)* `<Boolean>` - Overwrite the `gpt.zone` config setting with a response from the targeting API
- `validateAdsTraffic` *(optional)* `<Boolean>` - Validate the user is not a bot before making ad calls. This uses the [Moat](https://moat.com/) service.


# Define Ad Slots

Once you've included and configured o-ads onto your website, you'll need to create some ad slots. These can be defined declarately within a HTML page.

## The Simplest Ad

This is the minimum required for an ad slot to be defined. This will be processed by o-ads and an ad will be rendered inside the `<div>` if the ad request is successful.

```html
<div 
  data-o-ads-name="example" 
  data-o-ads-formats-default="MediumRectangle" 
  aria-hidden="true">
</div>
```

*See [Ad Formats]()*

## Ad Formats

You can specify one format as in the above example, or you can specify multiple formats for different breakpoints:

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

### Default breakpoints
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

### Default Formats

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

# Ad Targeting

Ads can contain extra information about a user, page, or any other useful info that could be used in Google Ad Manager. There are three ways of adding targeting information to an ad call.

## Ads-api (global)

The [ads-api](https://github.com/financial-times/ads-api) is an api that aggregates information from various sources and returns it in a format that o-ads can use and append to every ad call. This can be configured when initialising o-ads like so:
```javascript
oAds.init({
  ...
  targetingApi: {
    user: "https://ads-api.ft.com/v1/user",
    page: "https://ads-api.ft.com/v1/content/<content-id>"
  },
  ...
});
```

## dfp_targeting (global)

When configuring o-ads, you can specificy a string of targeting parameters seperated by a semicolon. These will be added to every ad call.
```javascript
oAds.init({
  ...
  dfp_targeting: "pos=top;version=1;test=yes"
  ...
});
```
## Ad slot targeting (ad slot specific)

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

# Lazy Loading

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


# Invalid Traffic

The library provide the option to check for invalid traffic before serving an ad. This relies on a third party script from Moat which you must include on your page, preferrably in the <head> section on your page
```javascript
<script async id="moat-ivt" src="https://sejs.moatads.com/financialtimesprebidheader859796398452/yi.js"></script>
```

This script will append the `m_data` parameter to the ad call, with a value of 0 or 1. DFP will then use this parameter to decide whether to serve an ad or not.

To enable this feature make sure you have the script above on your page and enable the following config setting when initialising o-ads:
```javascript
oAds.init({
  ...
  validateAdsTraffic: true,
  ...
});
```

# Changing behaviour based on which ad loads

All ads get an attribute added called data-o-ads-loaded, which contains the format of the ad that loaded. For example, data-o-ads-loaded="Billboard".

A product can use this to change the styles based on which ad has loaded (for example, to increase the height of a reserved slot if a larger ad loads).

# Styling

o-ads provides some classes to add some basic branded styling to the ad slot.

- `.o-ads--reserve-90` This is a placeholder for an area of height 90px (with padding) in the slot. This is used to prevent the page jumping when an ad loads (at least when a Leaderboard/SuperLeaderboard height ad is served).

- `.o-ads--reserve-250` As above - but should only really be used if only a 250px height ad will be used in that slot (as other ads would have empty space around as a result).

- `.o-ads--background` This adds a shaded background in the slot. In principle, this is only really used when an ad is at the top of the page above a header, in order to give some indication that the empty space is intentional.

- `.o-ads--slate-background` This is the same as .o-ads--background except that the background is slate (almost black).

- `.o-ads--placeholder` This displays a backgound image (currently an ellipsis) to give the user a clear indication that something will be loaded in this place.

- `.o-ads--transition` Adds an animation to the container to ease the UX when an ad loads.

- `.o-ads--center` Horizontally centres the ad.

- `.o-ads--label-left` Adds a label above the ad indicating that it is an advertisement. This is required for when the ad sits in between content (e.g. in the middle of an article).