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

Ad positions, ad sizes and ad server network IDs are examples of configuration options that will be specific to a product/site.

### The configuration object
The o-ads `init()` method takes a json configuration object as its only argument. The configuration object sets various properties on the o-ads instance. 

The example below demonstrates instantiating an o-ads instance, setting the ad network code and ad formats (ad position name + sizes) via the configuration object.

```
myAds = require('./o-ads/main.js');
myAds.init({
  network : '5887',
  formats : {
    mpu : {sizes : [[300,250],[336,280]]},
    leaderboard : {sizes : [[728,90],[970,90]]}
  }
);
```

### Setting configuration via metatags
In addition to the configuration object which is passed to the o-ads constructer, it is possible to set config options via metatags in the page DOM.

[DOCUMENT METATAG CONFIG]

### Config accessor method
The o-ads library exposes all configuration properties via the `config()` accessor method. 
The `config()` function allows for getting and setting of configuration values.
 * Calling `config()` with no parameters returns the entire configuration object.
 * Calling config passing a valid property key will envoke the 'getter' and return the value for that property key.
 * Calling config passing a valid property key and a value will envoke the setter and set the value of the key to the new value.


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
Setting the `cbTrack` property to true for an ad slot will configure o-ads to add a data-attribute to the HTML markup of the ad slot. Specifically the Chartbeat data-attirbute `data-cb-ad-id` is set and the ad position name is set as the value. The data-attribute is added to the `<div>` element that wraps the ad slot. See the example below.

```
<div id="hlfmpu" data-cb-ad-id="hlfmpu">...</div>
```

### Video Advertising

The o-ads library supports video pre-roll ads. See [Google DFP's documentation on video advertising](https://support.google.com/dfp_premium/answer/1711021?hl=en)

#### Basic Setup

[PLACEHOLDER]

#### Companions

The o-ads library integrates with Google DFP's Companion Service for video ads. The Companion Ads service enables the video pre-roll ad to be booked as a Master ad and pull in companion ads into other ad slots on the page.


The companion ads service is enabled via config settings. 
Setting companions to true on a page will enable the Companion Ads service on all slots on the page. 

The example code below demonstrates how the Companion Ads service can be enabled on a particular DFP zone (in this example 'video-hub') within a site. Assuming the instance of the o-ads library has been namespaced as myAds, the following code could be added to the product specific configuration file. 
```
    if (myAds.config('dfp_zone')==="video-hub"){
          myAds.config('companions', true);
    }
```
By default the Companion Ads service is added to all ad slots on a page where the companions property has been set to true. It is possible to exclude the Companion Ads service from being set on particular slots via slot level configuration. Setting the companions config property to false will explicitly exclude the  ad slot from having the Companions service enabled, for example, to exlclude the Companions service from the MPU ad slot we could use the below code in the site specific configuration file.
```
            mpu: {
                sizes: [[300,250],[336,280]],
                companions : false
            }
```

### Ad Refresh

[PLACEHOLDER]

## Ad Units: Creatives, Styling and Layout

The full list of existing ad units available in different FT sites, along with creative specs and other information, is available in the [FT Toolkit](http://fttoolkit.co.uk/d/#nav-specifications/1)

Some examples are:

#### 1. Leaderboard

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A type of online advert that generally runs across the top of the screen.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Sizes (WxH pixels)</b>: 728x90, 970x90, 468x60, 970x66, 970x250

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Creative Format</b>: gif, jpeg, rich media including flash

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Expandable</b>: Yes (expand vertically down the page only)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 728x90 can expand to 728x300<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 970x90 can expand to 970x415 (also called pushdown)

<br/>
#### 2. Half page unit

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Sizes (WxH pixels)</b>: 300x600, 336x850, 336x280, 300x1050, 300x250

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Creative Format</b>: gif, jpeg, rich media including flash

<br/>
#### 3. Mid Page Unit
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An advert that sits in the middle of the page, more likely to be viewed/read.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Sizes (WxH pixels)</b>: 300x250, 336x280

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Creative Format</b>: gif, jpeg, rich media including flash

<br>
IAB's (Interactive Advertising Bureau) ad standards, creative guidelines and best practices can be found [here](http://www.iab.net/guidelines/508676/508767/ad_unit)