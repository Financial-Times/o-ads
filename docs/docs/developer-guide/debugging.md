---
layout: default
title: Debugging
section: building
---

## Checking ad calls

You can inspect that an ad call is being made by looking at the Network tab (or [Charles](https://www.charlesproxy.com/)). An ad call looks something like this:  
```
https://securepubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=4083593754103292&output=json_html&....
```

Some useful URL parameters in the ad call:

* `cust_params` - custom targeting key/values passed by o-ads
* `scp` - slot specific targeting key/values defined on the slot
* `iu` - ad unit
* `sz` - all the eligible sizes for this slot

Along with the creative HTML, the response also contains some useful metadata:

* `_width_`
* `_height_`
* `_empty_`
* `_use_safe_frame_` - Read about [Safe Frames](https://support.google.com/dfp_premium/answer/6023110)
* `_creative_ids_`
* `_adgroup2_ids_` - this is the ID for the Line Item


## oAds.debug()

If you have the o-ads instance exposed on the window object, you could type something like:
`oAds.debug()` or `Origami['o-ads'].debug()` (if using the Build Service).

This provides a table of details about the config and targeting, as well as information on the creatives that have been loaded (such as `creative id` or `line item id`).

## Google GPT Console

You can append `?googfc` to the URL and this will bring up Google's debugging tool, which provides additional details for each Ad Slot.
