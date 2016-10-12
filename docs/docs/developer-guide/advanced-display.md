---
layout: default
title: Advanced usage
section: building
---

This page will go through some of the more advanced concepts and options available to display advertising.

## Lazy Loading

o-ads can be configured to lazy-load ads (i.e. only trigger the ad call when the ad is in view, or close to being in view). This will allow viewability to improve, as we won't be loading the ad until it is in view - but the tradeoff would be fewer ad impressions.

Lazy Loading uses [Intersection Observer](https://github.com/WICG/IntersectionObserver), so this needs to be [polyfilled](https://cdn.polyfill.io).

By default, lazy loading is disabled.

To enable lazy loading:

```
oAds.config({
	lazyLoad: true
});

oAds.config({
	lazyLoad: {
    viewportMargin: '0% 0% 100% 0%',
    threshold: [0.5]
  }
});

<div class="o-ads" data-o-ads-lazy-load="false"></div>
```

There is one exception to lazy loading, which is Master/Companion. Based on the way that this pair of creatives are related in DFP, the companion is loaded soon after the master, which [overrides lazy loading]({{ site.baseurl }}/docs/developer-guide/advanced-display#mastercompanion).

**Options:**

* `viewportMargin` - Sets a new margin within the viewport that determines at what point the advert is in view. We suggest setting this option when you want to request and display the advert just _before_ it comes into view. This works as regular margin definitions.   
Make sure you always specify the dimensions with either `px` or `%`, e.g. `100% 0%`, or `100px 0px`. Default is `0%`.

* `threshold` - An array of values that determine at what point a callback will be triggered.  
 In this case, the threshold is a percentage of the intersection area in relation to the area of the target's bounding box (where the target is a DOM element relative to a containing element or to the top-level viewport). [Intersection Observer](https://wicg.github.io/IntersectionObserver/#dom-intersectionobserver-intersectionobserver).  
 Thresholds can be any value between 0.0 and 1.0, inclusive. Default is `0`, meaning that as soon as the first pixel comes into view, the advert will be loaded.


## Changing behaviour based on which ad loads

All ads get an attribute added called `data-o-ads-loaded`, which contains the format of the ad that loaded. For example, `data-o-ads-loaded="Billboard"`.

A product can use this to change the styles based on which ad has loaded (for example, to increase the height of a reserved slot if a larger ad loads).

## Master/Companion

The ad server can configure ads to come as a set - which is known as master/companion. This is used when, for example, an advertiser wants exclusivity on the page.

It is usually controlled by the 'master'—the top slot—which has instructions around what other ads to bring down with it.

There is a quirk with Google's implementation of master/companion ads which is that the ad calls must happen (more or less) immediately for the relationship to remain intact. This causes problems when used with Lazy Loading, as we cannot guarantee that a user would scroll to the other ads in time.

To work around this, we amend the lazy load behaviour so that if the first ad that loads is part of a master/companion set, we immediately trigger the next ad calls.

In addition - all ad slots will have an attribute added called `data-o-ads-master-loaded` - which contains the format of the Master ad. An example use of this is on FT.com's article page - where if we get a Responsive master/companion pair, we hide the sidebar ad and show a full width ad within the content.

## Collapsing / No Ads

A creative may not be served under one of the following circumstances:

* _A bug in the creative_  
The ad server served an ad correctly, but some bug in the creative causes it not to display anything. A common example of this would be if the ad's assets were insecure. This needs to be reported to AdOps as soon as possible - ideally with the [creative Id or line item Id]({{ site.baseurl }}/docs/developer-guide/debugging#oadsdebug)

* _Collapsed ad_  
This is when AdOps explicitly send instructions to an ad slot not to show anything. This is done via a particular creative that contains some code implemented throught [o-ads-embed](https://github.com/Financial-Times/o-ads-embed) telling it to collapse itself. It should then append the class `o-ads--empty` to the ad slot.

This is done in instances where an advertiser wants exclusivity on the page, but might not have assets with all the correct sizes.

* _No ad_  
This is when the ad server fails to return any ad. This could be caused by an ad call that is missing the correct targeting parameters and ad unit. However, it _should_ be rare, as AdOps usually fall back to either programmatic advertising or House Ads.

## Out-of-page
 > Out-of-page line items make it easier to serve web creatives that do not fit in a traditional banner space or browser window. They may include pop-ups and floating line items and are sometimes called interstitials.  

 >To serve pop-up, pop-under, or floating creatives to your website, you’ll need to traffic the creatives using one of DFP’s built-in creative templates, and you’ll need to make sure your tags are set up properly to allow these creative types to serve.  
 [DFP traffic and serve out-of-page creatives](https://support.google.com/dfp_premium/answer/1154352?hl=en)

```
<div data-o-ads-out-of-page="true"></div>
```

## Events

#### `oAds.initialised`
Triggered when the library has been initialised and the config has been set. (Note: the GPT library may not have been loaded by this point).

#### `oAds.adServerLoadError`
Triggered if the library fails to load the external JS GPT library, meaning no advertising will work. Can be used if you wish to have a fallback when you know the adverts will not display.

#### `oAds.ready`
Slot has been inited in the oAds library and is about to be requested from the ad server (deferred if lazy loading is on).

#### `oAds.rendered`
Triggered once the ad has been rendered on the page.

#### `oAds.complete`
If and when a creative has been returned, this event announces it has now been initialised in oAds, requested from the ad server and displayed. Triggered after `oAds.rendered`.

#### `oAds.render`
Lazy loaded advert has been requested.

#### `oAds.refresh`
A refresh event has been triggered on an advert, prompting a new request to the ad server.

#### `oAds.breakpoint`
If the oAds is configured to use responsive adverts with set breakpoints, it will trigger the event on each of the breakpoints that was specified in the config. Note that the breakpoint triggering does not take the scrollbar into consideration. For more information read about [DFP - Build responsive ads](https://support.google.com/dfp_premium/answer/3423562?hl=en).

#### `oAds.collapse`
Event is emitted when the slot is collapsed. The event detail contains oAds slot instance.
