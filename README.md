# oAds ![CircleCI Status](https://circleci.com/gh/Financial-Times/o-ads.svg?style=shield&circle-token=36a37c6ca27a08408c2575c7834f5f6f5c5c9d21)
## Introduction
This module enables display advertising from [Googles DFP Ad server](http://www.google.com/dfp), enables custom behavioural (via [Krux](http://www.krux.com/)) and demographics and semantic (via [Admantx](http://admantx.com/)) targeting.

## Installation
Please refer to [Origami quick start instructions](http://registry.origami.ft.com/components/o-ads#section-usage) If you are enabling this module on one of the FT sites please do refer to the [_Integration guidelines_](https://github.com/Financial-Times/o-ads/blob/master/docs/INTEGRATION.md)

## Browser support

Browsers | Primary Experience | Core Experience
:------: | :----------------: | :-------------:
Chrome   | 35+                | 35+
Firefox  | 30+                | 30+
Safari   | 7+                 | 7+
IE       | 8+                 | 8+

## Requirements
For basic use, a DFP account with Google is required, each targeting/tracking supplier will require their own configuration and setup.

## Documentation
### Quick start
Include o-ads JS and SCSS in the build and and add the following markup to the page:

```html
<div class="o-ads" data-o-ads-gpt-unit-name="/6355419/Travel" data-o-ads-formats="MediumRectangle"></div>
```

On initialisation o-ads will request a 300x250 (see Formats below) advert targeted from Google's test network.

## Initialization

### Firing an event

First you will need to have the markup for configuration:
```html
<script data-o-ads-config="" type="application/json">
		{
      "gpt": {
        "network": 5887,
        "site": "test.5887.origami"
      }
		}
</script>
```

### Calling public API

This example demonstrates instantiating o-ads, setting the network code and ad formats (position name & sizes) via the configuration object being passed directly to the `init` method.

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



## API
### `oAds.slots#clear(slot)`
Takes an array of slot names or a slot name and clears those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#collapse(slot)`
Takes an array of slot names or a slot name and collapses those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#destroy(slot)`
Takes an array of slot names or a slot name and destroys those slots/slot and remove any reference of them. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#initSlot(container)`
Confirms an ad container exists in the page and creates a Slot object.

Parameter | Description
--------- | ----------------------------------------------------------------------------------------------------------------------
container | html element where Ad Slot is to be created. Can be passed a string of the `data-o-ads-name` attribute on the element.

### `oAds.slots#refresh(slot)`
Takes an array of slot names or a slot name and refreshes those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#uncollapse(slot)`
Takes an array of slot names or a slot name and uncollapses those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

## Additional Configuration
We currently support these additional features
- [Targeting](https://github.com/Financial-Times/o-ads/blob/master/docs/TARGETING_CONFIG.md)
- [Responsive Slots](https://github.com/Financial-Times/o-ads/blob/master/docs/RESPONSIVE_SLOTS.md)
- [Video and Companion Advertising](https://github.com/Financial-Times/o-ads/blob/master/docs/VIDEO_CONFIG.md)
- [Slot configuration full reference](https://github.com/Financial-Times/o-ads/blob/master/docs/SLOT_CONFIG_REFERENCE.md)

As well as these [3rd party providers](https://github.com/Financial-Times/o-ads/blob/master/docs/DATA_PROVIDERS.md)
- Krux (Behavioural targeting)
- Moat (Viewability tracking)
- Admantx (Contextual targeting)
- Rubicon (Programmatic advertising)
