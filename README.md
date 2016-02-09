# oAds
## Introduction
This module enables display advertising from [Googles DFP Ad server](http://www.google.com/dfp), enables custom behavioural (via [Krux](http://www.krux.com/)), demographics and semantic (via [Admantx](http://admantx.com/)) targeting and audited ad tracking with [Chartbeat](https://chartbeat.com/).

## Installation
Please refer to [Origami quick start instructions](http://registry.origami.ft.com/components/o-ads#section-usage) If you are enabling this module on one of the FT sites please do refer to the [_Integration guidelines_](docs/INTEGRATION.md)

## Browser support

Browsers | Primary Experience | Core Experience
:------: | :----------------: | :-------------:
Chrome   | 35+                | 35+
Firefox  | 30+                | 30+
Safari   | 7+                 | 7+
IE       | 8+                 | 8+

## Requirements
For basic use a DFP account with google is required, each targeting/tracking supplier will require their own configuration and setup.

Having a sales model is important! See this document for pre-requisite steps required for adding advertising to your product:    [https://docs.google.com/a/ft.com/document/d/1a9Dyi-4VzN_gzhYn6scVLgKICEP1AEPR7A7-shefklU/edit](https://docs.google.com/a/ft.com/document/d/1a9Dyi-4VzN_gzhYn6scVLgKICEP1AEPR7A7-shefklU/edit)

## Documentation
### Quick start
Include o-ads in the build and and add the following markup to the page:

```html
<div class="o-ads" data-o-ads-gpt-unit-name="/6355419/Travel" data-o-ads-formats="MediumRectangle"></div>
```

o-ads will initialise on `o.DOMContentLoaded` and request a 300x250 (see Formats below) advert targeted from googles test network.

### Initialization
The o-ads `init()` method takes a JSON object as it's only argument. The configuration object sets various properties on o-ads.

This example demonstrates instantiating o-ads, setting the network code and ad formats (position name & sizes) via the configuration object.

```js
const oAds = require('o-ads');
oAds.init({
  network : '5887',
  formats : {
    mpu : {
      sizes : [[300,250],[336,280]]
    },
    leaderboard : {
      sizes : [[728,90],[970,90]]
    }
  }
});
```

### Additional Configuration
We currently support these additional features
- Targeting
- Responsive slots
- Video advertising
- Companion ads

As well as these 3rd party suppliers
- Krux
- Chartbeat
- Admantx
- Rubicon

In order to use these features you will need to add to your configuration object.

#### Targeting
Additional targeting can be added at either the individual slot level or by adding  a `dfp_targeting` key to the config object.

Targeting is passed, as a semicolon separated key/value string (e.g `'some=test;targeting=params'`), to either the config object using the key `dfp_targeting` or to an individual slot by adding it as a `data-o-ads-targeting` attribute.

#### Responsive Slots
Slots can be configured to react to the viewport size by either hiding the ad or requesting an ad of a different size. Responsive slots react to the window being resized as long as the HTML is well formed. In various browsers the resize event can fail to fire if a doctype is not included.

##### Configuration

```js
oAds.init({
  ...
  responsive : {
    extraLarge : [1400, 0],
    large : [1000, 0],
    medium : [600, 0],
    small : [0, 0]
  }
  ...
});
```

The `responsive` object's keys can be any name. Values are an array containing width and height breakpoints. It is recommended to have a `[ 0, 0 ]` breakpoint for clarity but is not necessary.

With the `responsive` object added, you can now add these breakpoint sizes to the ad slots' `sizes` object like so.

```js
oAds.init({
  ...
  responsive : {
    extraLarge : [1400, 0],
    large : [1000, 0],
    medium : [600, 0],
    small : [0, 0]
  },
  formats : {
    leaderboard : {
      sizes: {
        extraLarge : [[970, 90]],
        large : [[728, 90]],
        medium : [[468, 60]],
        small : false
      }
    },
    mpu : [[300, 250]]
  }
  ...
});
```

With this configuration a different sized `leaderboard` ad will be displayed on each screen size except a `small` one, where the slot will be collapsed instead.

Not all slots need to be configured responsively, for example the `mpu` slot in the above example will be the same size in all screen sizes.

#### Video
The o-ads library supports video pre-roll ads. See [Google DFP's documentation on video advertising](https://support.google.com/dfp_premium/answer/1711021?hl=en). It is enabled by adding to your configuration object.

```js
oAds.init({
  ...
  'video' : true
  ...
});
```

This setting allows the ability to use `buildURLForVideo()`

--------------------------------------------------------------------------------

##### `oAds#buildURLForVideo(zone, pos, kv)`
Request a url in a format suitable to pass to compatible video players for them to retrieve scheduled ad serving data in the [VAST (Video Ad Serving Template)](http://www.iab.com/guidelines/digital-video-ad-serving-template-vast-3-0/) format.

Parameter      | Description
-------------- | -------------------------------
zone           | DFP_ZONE
pos (optional) | POSITION_NAME (DEFAULT 'video')
kv (optional)  | ADDITIONAL_TARGETING_KEY_VALUES

Returns an object with variables suitable for use in many different players
- `urlStem` & `additionalTargetingParams` for [brightcove](https://www.brightcove.com/en/) use.
- `fullURL` for [VideoJS](http://videojs.com/) use.

Currently players with IMA3 (Google's Interactive Media Ads) plugins are supported. Many video players support this functionality including brightcove (out of the box) and VideoJS (with plugin)

## Configuration guides for [brightcove](https://support.brightcove.com/en/video-cloud/docs/using-dfp-ima-3-ad-source) and [VideoJS](http://googleadsdeveloper.blogspot.co.uk/2014/08/introducing-ima-sdk-plugin-for-videojs.html)
### Companions
The o-ads library integrates with Google DFP's Companion Service for video ads. The Companion Ads service allows the video pre-roll ad to to be booked as a master ad which is able to pull in companion ads into the other ads slots on the page.

The cCompanion Ads service is enabled via config settings by setting the `companions` config property to `true`.

For example

```js
oAds.config('companions', true);
```

--------------------------------------------------------------------------------

The Companion Ads service can be enabled on a particular DFP zone (for example `'video-hub'`) within a site. To do this the following code would be added to the site specific config.

```js
if (oAds.config('dfp_zone') === 'video-hub'){
  oAds.config('companions', true);
}
```

--------------------------------------------------------------------------------

By default the Companion Ads service is added to all ad slots on a page where the companions property has been set to `true`. It is possible to exclude the Companion Ads service from being et on particular slots via slot level configuration. Setting the `companions` property to `false` will explicitly exclude that ad slot from using the Companion Ads service.

For example

```js
oAds.init({
  ...
  formats : {
    mpu : {
      sizes : [[300, 250], [336,280]],
      companions : false
    }
  }
  ...
});
```

### Using 3rd Party Providers
To use these 3rd party providers with the o-ads library you will need to have accounts with them directly. An Ad Operations team should be able to do this.

#### [Krux](http://www.krux.com/)
##### Prerequisites
Before Krux can be enabled, the Ad Operations team should ensure that a Production and QA environment have been been created in the Krux system specific to the site. In most cases each site will have its own Production and QA environment set up in the Krux platform.

##### Configuration
Enabling and configuring Krux is done by passing a `krux` object to the config with the krux id and attributes. For example

```js
oAds.init({
  ...
  krux: {
    id: 'XXXXXXXX',
    attributes: {
      user: {},
      page: {},
      custom: {}
    }
    }
  }
  ...
});
```

The attributes object can take user, page and custom data objects to send to Krux.

#### [Chartbeat](https://chartbeat.com/about/)
#### [Admantx](http://www.admantx.com/)
#### [Rubicon](https://rubiconproject.com/)
## Slots Functions
- `clear`
- `collapse`
- `destroy`
- `initSlot`
- `refresh`
- `uncollapse`

### `oAds.slots#clear(slot)`
Takes an array of slot names or a slot name and clears those slots/slot.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#collapse(slot)`
Takes an array of slot names or a slot name and collapses those slots/slot.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#destroy(slot)`
Takes an array of slot names or a slot name and destroys those slots/slot and remove any reference of them.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#initSlot(container)`
Confirms an ad container exists in the page and creates a Slot object.

Parameter | Description
--------- | ----------------------------------------------------------------------------------------------------------------------
container | html element where Ad Slot is to be created. Can be passed a string of the `data-o-ads-name` attribute on the element.

### `oAds.slots#refresh(slot)`
Takes an array of slot names or a slot name and refreshes those slots/slot.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#uncollapse(slot)`
Takes an array of slot names or a slot name and uncollapses those slots/slot.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names
