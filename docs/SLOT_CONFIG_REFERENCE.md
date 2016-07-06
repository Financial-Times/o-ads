# Full slot configuration reference
Each slot can be configured in a number of ways. Following is a full reference of all the possible configuration parameters.
Also each slot can be configured either via JSON configuration object or via the DOM data attributes.

***Note:*** the basic configuration such as DFP site and zone need to be configured via the config object, the rest of parameters can be configured on the slot level.

## Example

### JSON object
```js
{
  key: 'value'
}
```

### DOM data attribute
```html
<div data-o-ads-key="value"></div>
```

## Configuration parameters

### Targeting
Key value pairs for advert targeting, separated by semicolon. No default value.

#### JSON Configuration
```js
{
  ...
  targeting: 'key=value;key2=value2;'
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-targeting="key=value;key2=value2;"></div>
```

---------------------------------------

### Sizes
Configuration for slot advert sizes. You can define multiple, all will be sent to the advertising server to serve one that matches. No default value.

#### JSON Configuration
```js
{
  ...
  sizes: [[970, 90], [970, 66], [180, 50]]
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-sizes="970x90,970x66,180x50"></div>
```

---------------------------------------

### Center
Defines if the advert container should be centered on the page. Default is `false`.

#### JSON Configuration
```js
{
  ...
  center: true
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-center="true"></div>
```

---------------------------------------

### Label
Defines if an "Advertising" label should be shown above the slot container and the position of that label. Default is `false`.

#### JSON Configuration
```js
{
  ...
  label: false
  ...
}
{
  ...
  label: true
  ...
}
{
  ...
  label: 'left'
  ...
}
{
  ...
  label: 'right'
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-label="false"></div>
<div data-o-ads-label="true"></div>
<div data-o-ads-label="left"></div>
<div data-o-ads-label="right"></div>
```

---------------------------------------

### Out of page
Define the parameter if the slot to be requested should be out of page one. Default is `false`.
"Out-of-page line items make it easier to serve web creatives that do not fit in a traditional banner space or browser window. They may include pop-ups and floating line items and are sometimes called interstitials.

To serve pop-up, pop-under, or floating creatives to your website, you’ll need to traffic the creatives using one of DFP’s built-in creative templates, and you’ll need to make sure your tags are set up properly to allow these creative types to serve.", [Google](https://support.google.com/dfp_premium/answer/1154352?hl=en)

#### JSON Configuration
```js
{
  ...
  outOfPage: true
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-out-of-page="true"></div>
```

---------------------------------------

### Lazy load
Defines if the slot should be lazy loaded, e.g. only requested from the advertising server once it comes into view. Default is `false`.
Support following properties:
* **viewportMargin** - Sets the margin of viewport to use when deciding if the advert is in view. Useful if you want to request and display the advert just before it comes into view. Works as regular margin definitions. Make sure you always specify the dimensions with either `px` or `%`, e.g. `100% 0%`, or `100px 0px`. Default is `0%`.
* **threshold** -  Sets threshold at which advert should be requested and displayed. Value can be anything between 0 and 100. Default is `0`, which means as soon as first pixel in in view the advert will get loaded.


#### JSON Configuration
```js
{
  ...
  lazyLoad: {
    viewportMargin: '0% 0% 100% 0%',
    threshold: 50
  }
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-lazy-load="true" data-o-ads-lazy-load="true" data-o-ads-lazy-load-threshold="90" data-o-ads-lazy-load-viewport-margin="10%"></div>
```

---------------------------------------

### Formats
Allows configuration of advertising formats.

The library comes with the following default options:

* MediumRectangle `300x250`
* Rectangle `180x50`
* WideSkyscraper `160x600`
* Leaderboard `728x90`
* SuperLeaderboard `970x90` or `970x66`
* HalfPage `300x600`
* Billboard `970x250`
* Portrait `300x1050`
* AdhesionBanner `320x50`
* MicroBar `88x31`
* Button2 `120x60`
* Responsive `2x2`

***Note:*** Formats can only be configured via JSON configuration. Also once added, they can be used a number of slots alongside the default formats. Also the formats are a global configuration, and you cannot define a format per slot and re-use it on other slots.

Once the advert is loaded, an attribute called `data-o-ads-loaded` will be added to the slot, with the name of the ad format that was actually loaded into the slot.

#### JSON Configuration
```js
{
  ...
  formats: {
    TestFormat: {sizes: [[970, 90], [970, 66], [180, 50]]}
  }
  ...
}
```

#### Example usage
```html
<div data-o-ads-formats="TestFormat"></div>
<!-- you can also define multiple formats for the slot -->
<div data-o-ads-formats="TestFormat,MediumRectangle"></div>
```

---------------------------------------

### Companion
Defines if the companion ads are enabled on the page and if the slot is a companion advert. This has to be configured per slot and just enabling the `gpt.companions` will not work. You have to configure both. Default is `false`.

#### JSON Configuration
```js
{
  gpt: {
    companions: true
  }
  ...
  slots {
    example1: {
      companion: true
    }
  }
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-companion="true"></div>
```

#### Example usage
```html
<div data-o-ads-name="slot1"></div>
```

---------------------------------------

### Collapse empty
Defines if the slot should be collapsed if the advertising server does not serve an advert. Default is `false`.

#### JSON Configuration
```js
{
  ...
  collapseEmpty: true
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-collapse-empty="true"></div>
```



### Responsive Sizes
If you have got a responsive site and wish to server a number of creative sizes depending in the users viewport, this is where you can configure the sizes to be requested from ad server for small, medium and large and extra large screens.

The configuration let's you decide which break points to use for which screen, no default values are provided out of the box.

#### JSON Configuration
***Note:*** this is global library configuration and you can only define the breakpoints in the JSON.

```js
{
  ...
  responsive: {
    small: [0, 0],
    medium: [400, 400],
    large: [600, 600],
    extra: [1200, 600]
  }
  ...
}
```

#### DOM Usage
***Note:*** In makrup you just define which sizes should be requested from the ad server for those slots for screen sizes, not the break points themselves.

```html
<div data-o-ads-sizes-large="300x600,300x1050" data-o-ads-sizes-medium="300x400,300x600" data-o-ads-sizes-small="false"></div>
```



### Responsive Formats
Same as in above example with sizes, but instead of the sizes you can use formats.

#### DOM Usage
```html
<div data-o-ads-formats-large="SuperLeaderboard"  data-o-ads-formats-medium="MediumRectangle"  data-o-ads-formats-small="false"></div>
```

---------------------------------------

### Slots
You can also predefine a number of slots and just use them on the page. Each of the slots can have any combination of the configurations keys define above.

For example let's say there is a page with 2 advert slots, one of the slots will host a leaderboard, another will host the a half page advert, and each of them should have custom targeting parameters.

Here is an example configuration you would use:
```js
{
  "gpt": {
    "network": 5887,
    "site": "test.5887.origami"
  },
  "slots": {
    "leaderboard": {
      "targeting": "pos=leaderboard1;"
    },
    "halfpage": {
      "targeting": "pos=halfpage1;"
    }
  }
}
```

And the markup for both of the slots:
```html
<div data-o-ads-name="leaderboard" data-o-ads-formats="Leaderboard"></div>
<div data-o-ads-name="halfpage" data-o-ads-formats="HalfPage"></div>
```


### Disable swipe configuration
This will only work if you are using [o-ads-embed](https://github.com/Financial-Times/o-ads-embed) in your creative wrapper in DFP.

In certain cases when the site or application are taking over natural scrolling, we might want to disable the default touch move events and handle it *ourself* via o-ads-embed module.

#### JSON Configuration
```js
{
  ...
  disableSwipeDefault: true
  ...
}
```

```js
{
  ...
  slots: {
    slotName: {
        disableSwipeDefault: true
    }
  }
  ...
}
```

#### DOM Configuration
```html
<div data-o-ads-disable-swipe-default="true"></div>
```
