---
layout: default
title: Display Ads
section: building
---

Display advertising consists of the traditional "banner" or square advertising slots seen on a page.

These come in a variety of sizes, some of which are standard [IAB](https://iabuk.net)(Internet Advertising Bureau) formats, and some which are bespoke to the FT.

An ad slot can be added to your page by including a `div` with some attributes. o-ads will then request an advert for that slot, which will be displayed within an iframe container. Below are two examples.is a simple example that will display a horizontal billboard/leaderboard sized ad at certain breakpoints:

**Simplest ad:**

```html
<div
  class="o-ads"
  data-o-ads-formats="Leaderboard,Responsive"
  aria-hidden="true">
```


## Name
The `data-o-ads-name` attribute is optional and `o-ads` will automatically create a unique one and inject it into each element for which it is missing.

That said, in case of having several ad slots on the page, it is recommended to use it and give it a descriptive value as it makes easier to identify slots when debugging, and it is also part of `oAds.debug().Creatives`'s output.


## Formats

o-ads comes with these formats out of the box:  

Format Name | Size  
---|---  
MediumRectangle (MPU) | `300x250`
Rectangle | `180x50`
Leaderboard | `728x90`
SuperLeaderboard | `970x90` or `970x66`
Billboard | `970x250`
Responsive | `2x2`
WideSkyscraper | `160x600`
HalfPage | `300x600`
Portrait | `300x1050`
AdhesionBanner | `320x50`
MicroBar | `88x31`
Button2 | `120x60`

If you require a different "sized" ad for bespoke purposes, this can be defined when initialising o-ads:

```
oAds.init({
	formats: {
    TestFormat: {sizes: [[970, 90], [970, 66], [180, 50]]}
  }
});
```

## Breakpoints

Slots can be configured to react to the viewport size by either hiding the ad or requesting an ad of a different size.

```html
<div
  class="o-ads"
  data-o-ads-name="mpu"
  data-o-ads-formats-default="false"
  data-o-ads-formats-small="MediumRectangle"
  data-o-ads-formats-medium="Leaderboard,Responsive"
  data-o-ads-formats-large="SuperLeaderboard,Leaderboard,Responsive"
  data-o-ads-formats-extra="Billboard,SuperLeaderboard,Leaderboard,Responsive"
  aria-hidden="true">
```

### Omitting breakpoints

If any of the breakpoints are not specified, not ad will be loaded for that breakpoint. You can also pass _false_ to that breakpoint. For example, the following example, will only load ads for large and extra large breakpoints. The small breakpoint is set to _false_ and the medium breakpoint is ommited:

```html
<div
  class="o-ads"
  data-o-ads-name="mpu"
  data-o-ads-formats-default="false"
  data-o-ads-formats-small="false"
  data-o-ads-formats-large="SuperLeaderboard,Leaderboard,Responsive"
  data-o-ads-formats-extra="Billboard,SuperLeaderboard,Leaderboard,Responsive"
  aria-hidden="true">
```

The default "breakpoints" for ads (e.g. data-o-ads-formats-medium) differ slightly from the o-grid breakpoints, in that they are decided based on the widths of non-responsive ad formats such as leaderboards (which don't fit nicely into the current o-grid viewports). However, they can be overridden/added to if needed.

The default breakpoints provided in o-ads are as follows:

* `small: 0px` (This is the size where it is appropriate to show a MediumRectangle)
* `medium: 760px` (This is the size where it is appropriate to show a Leaderboard)
* `large: 1000px` (This is the size where it is appropriate to show a SuperLeaderboard,  and roughly equates to a landscape tablet)
* `extra: 1025px` (This additional breakpoint can fit a SuperLeaderboard/Billboard, and roughly equates to a larger desktop)

If, for whatever reason, you need to amend the default breakpoints, they can be updated in the oAds init config object.  
*Note:* please speak to AdOps or a member of the Advertising team before doing this, since it may affect their campaign targeting.

```js
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

The `responsive` object's keys can be any name. Values are an array containing width and height breakpoints. It is recommended to have a `[ 0, 0 ]` breakpoint for clarity but is not necessary.

### "Responsive" format

The `Responsive (2x2)` format is specifically used for creatives that respond to the width of the browser (and so can be used at any breakpoint). As such, if a responsive creative is served, o-ads will not request another ad when the breakpoint changes.

## Targeting

Custom targeting involves sending key/value pairs in the Ad Request to DFP - these custom targeting parameters are used by Ad Ops to traffic specific ads to specific keys/values.
There are two levels of targeting that can be applied, these are Page Level and Slot Level.

### Page level
Page level targeting will be appended to all ad calls on the page.
Typically we will use the "dfp_targeting" element in the o-ads configuration object to pass page level targeting. The dfp_targeting element should take the form of a semi-colon delimited string. For example if we want to send a user-id and a page type as custom targeting parameters for all ads on a page:

`dfp_targeting : "user-id=123;page-type=article"`

### Slot level targeting
You can provide specific targeting key/values for a slot, this is done via adding a data-o-ads-targeting attribute to the slot's mark-up:

`data-o-ads-targeting="key=value;key2=value2;"`

The most common use case for this is what is known as the `pos` key. This is used by AdOps to identify the position of the ad on the page. The most common values used at the FT are `pos=top` and `pos=mid` for the first and second ad on the page, respectively. However, when adding a new ad slot, this value should be confirmed with AdOps.

## Styling with Classes

o-ads provides some classes to add some basic branded styling to the ad slot.

* `.o-ads--reserve-90`
This is a placeholder for an area of height 90px (with padding) in the slot. This is used to prevent the page jumping when an ad loads (at least when a Leaderboard/SuperLeaderboard height ad is served).

* `.o-ads--reserve-250`
As above - but should only really be used if _only_ a 250px height ad will be used in that slot (as other ads would have empty space around as a result).

* `.o-ads--background`
This adds a shaded background in the slot. In principle, this is only really used when an ad is at the top of the page above a header, in order to give some indication that the empty space is intentional.

* `.o-ads--slate-background`
This is the same as `.o-ads--background` except that the background is slate (almost black).

* `.o-ads--placeholder`
This displays a backgound image (currently an ellipsis) to give the user a clear indication that something will be loaded in this place.

* `.o-ads--transition`
Adds an animation to the container to ease the UX when an ad loads.

* `.o-ads--center`
Horizontally centres the ad.

* `.o-ads--label-left`
Adds a label above the ad indicating that it is an advertisement. This is required for when the ad sits in between content (e.g. in the middle of an article).
