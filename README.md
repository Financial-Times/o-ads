# o-ads - Display Advertising

This module adds display advertising functionality to your product. Using this module will enable you to easily take advantage of
 standard demographic targeting functionality, behavioural tracking features, useful custom targeting attributes, it is also
 aligned to the standard FT Advertising Technology stack so co-ordination with Ad Operations should be a breeze.

  Having a sales model is important! See this document for pre-requisite steps required for adding advertising to your product:
   https://docs.google.com/a/ft.com/document/d/1a9Dyi-4VzN_gzhYn6scVLgKICEP1AEPR7A7-shefklU/edit

## Browser support
|  Browsers  | Primary Experience | Core Experience |
|:----------:|:------------------:|:---------------:|
|   Chrome   |        35+         |       35+       |
|   Firefox  |        30+         |       30+       |
|   Safari   |        7+          |       7+        |
|   IE       |        8+          |       8+        |

Known issues:

* Excessively big ads may cause user dissatisfaction! We are a classy site, please don't go overboard.

## Markup

Add ad slots to your page using the following div structure:

Example HTML:

```html
<div class="o-ads" data-o-ads-position="mpu">
    ...
</div>
```

## Product Specific Configuration
The o-ads library is customisable in order to accomodate product specific configuration options.

Ad positions, ad sizes and ad server network ids are examples of configuration options that will be specific to a product/site.

The o-ads `init()` method takes a json configuration object as its only argument. The configuration object sets various properties on the o-ads instance. 

The example below demonstrates instantiating an o-ads instance setting the ad network code and ad formats (ad position name + sizes) via the configuration object.

```
myAds = require('./../bower_components/o-ads/main.js');
myAds.init({
  network : '5887',
  formats : {
    mpu : {sizes : [[300,250],[336,280]]},
    leaderboard : {sizes : [[728,90],[970,90]]}
  }
);
```

 1. cookie level config
 2. default config (set within the library code)
 3. meta config (set via meta-tags within the markup of the page)
 4. global config (set via the FT.env object

The libraryvia a json configuration object.

Each product or site will most likely have ad slot sizes/positions which are specific to the product.

## Configuring Basic Targeting Criteria

Add configuration to enable targeting.

[PLACEHOLDER]

### Out of the box targeting

* Pre-packaged social referrer metadata (twitter, google, facebook, drudge)
* Registration/Subscription/AYSC metadata

### Adding additional custom targeting criteria

o-ads.setTargeting()
[PLACEHOLDER]

## Advanced Features

### Responsive slot configuration

#### What it provides

[PLACEHOLDER]

#### How to configure

[PLACEHOLDER]

### Behavioural Targeting - Krux

#### What it provides

[PLACEHOLDER]

#### How to configure

[PLACEHOLDER]

#### who to contact to get additional data points in your product

[PLACEHOLDER]

### Chartbeat - Ad Visibility

#### What it provides

The o-ads library integrates with the Chartbeat web analytics system to enable ad "viewability" tracking.

See [Chartbeat's explanation of their ad sales solution](http://chartbeat.com/publishing/for-adsales/display/) for an overview of what is provided.

A key feature of the Chartbeat ad viewability solution is the "time in view" metric; this is a measures of the length of time for which an ad impression was viewable.

#### Prerequisites
The Chartbeat library must be included on the website - See the [Chartbeat implementation documentation](http://chartbeat.com/docs/). 

#### How to configure  
The o-ads library integrates with Chartbeat at the individual ad slot level. 

Ad positions can be configured to be trackable by Chartbeat. In order to enable an ad slot to be tracked by chartbeat the `cbTrack` property must be set to `true` in the product specific configuration object.

#### Example code
```javascript
 mpu: {
   sizes: [[300,250], [336,280]],
   cbTrack: true
  },
  hlfmpu: {
   sizes: [[300,600], [336,850], [300,250], [336,280]],
   cbTrack: true
  }
```


### Video Advertising

#### Basic Setup

[PLACEHOLDER]

#### Companions

[PLACEHOLDER]

### Ad Refresh

[PLACEHOLDER]
