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

Example HTML for defining an "mpu" position:

```html
<div class="o-ads" data-o-ads-position="mpu">
    ...
</div>
```
or

```html
<div id="mpu" class="advertising"></div>
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

Here's an example (some of the values will become clear by reading later documentation).
```HTML
 <meta name="dfp_site" content="test.5887.origami">
 <meta name="dfp_zone" content="home">
 <meta name="dfp_targeting" content="">
 <meta name="krux" content='{"id":"JVB5A2WA","limit":70}' data-contenttype="json">
 ```
 and ad positions as such:
 
 ```HTML
 <div data-ad-position="hlfmpu" data-ad-size="300x600" id="hlfmpu"></div>
 ```

### Config accessor method
The o-ads library exposes all configuration properties via the `config()` accessor method. 
The `config()` function allows for getting and setting of configuration values.
 * Calling `config()` with no parameters returns the entire configuration object.
 * Calling config passing a valid property key will envoke the 'getter' and return the value for that property key.
 * Calling config passing a valid property key and a value will envoke the setter and set the value of the key to the new value.

### Targeting Key Values

Some key values are added to the ad requests out of the box 
* Pre-packaged social referrer metadata (twitter, google, facebook, drudge)
* Registration/Subscription/AYSC metadata (when on ft.com domain for logged in users)

It's possible to add additional targeting key/values by setting the ```dfp_targeting``` config parameter e.g. to add the key values pagetype=article and article id = 67867868687687 you could do the following:

```
 <meta name="dfp_targeting" content="pagetype=article;articleid=67867868687687">
```
or by setting in the init config:
```
myAds.init({
  ...
  dfp_targeting: "pagetype=article;articleid=67867868687687",
  ...
  }
);
```

### Collapsing options

default functionality it to request an ad and if the ad comes back empty the slot (div) will remain closed (display:none) and expand to the size of the ad returned if there is an ad scheduled. However other options are available. These are:

*after* - the ad slot will load open before the ad is requested and if an ad isn't scheduled then the position will collapse.

*before* - same as default

*never* - the ad position will remain open and will not close even if an ad isn't scheduled.

these modes can be chaged by the setting ```collapseEmpty``` in either init or page metadata. e.g. 
```
 <meta name="collapseEmpty" content="after">
```


### Adding additional custom targeting criteria

o-ads.setTargeting()
[PLACEHOLDER]

## Advanced Features

### Responsive slot configuration

#### What it provides

Slots can be configured to react to viewport size by either hiding the ad or requesting an ad of a different size. 
Responsive slots will react to the window being resized as long as the HTML is well formed, in various browsers the resize event can fail to fire if a doctype is not included.

#### How to configure
To enable respsonsive slots you first add your breakpoints to your configuration e.g.
```
  responsive: {
    "extraLarge": [ 1400, 0 ],
    "large": [ 1000, 0 ],
    "medium": [ 600, 0 ],
    "small": [ 0, 0 ]
}
```
Within the breakpoints object keys can be any arbitary name and values are an array containing width and height of the viewport ot be targetted, we are usually only concerned with widths so height is set to 0, it is recomended to have a 0, 0 breakpoint for calrity but it is not needed.

Now within your sizes configuration for each ad format you can supply which sizes should be requested or if a slot should be displayed at each breakpoint e.g.
```
  formats : {
    leaderboard : {
      sizes: {
        small: false,
        medium: [[468, 60]],
        large: [[728, 90]],
        extraLarge: [ [970, 90] ]
      },
      mpu: [[300, 250]]
    }
  }
```

With the above configuration a different sized banner will be displayed for each screen size except small where the slot will be collapsed.
It should also be noted that not all slot need to be configured responsively, above the mpu will be the same size on all screens

### Behavioural Targeting - Krux

#### What it provides

Krux provide an Audience Data Monetization and Management solution. 
The Krux platform includes four modules; Data Sentry, SuperTag, **Audience Data Manager** and **Interchange**. The o-ads library integrates with the Audience Data Manager and the Interchange modules.

The **Audience Data Manager (ADM)** enables a publisher to sell against the value of their audience. The ADM functionality allows a publisher to break down their audience into subsets  (segments) based on a wide range of data-points. Data points that can be used to generate an audience segment can include demographics and user registration details along with user behaviours such as sharing articles or repeatedly visiting a specific section of the site.

An example of a valuable FT.com Audience Segment that can be derived via the ADM could be "Diplomats"; if a user's industry is known to be "Government or NGO" and the user is known to be frequently visiting the site from Brussels and reading articles related to the EU/ European commission or a frequent reader of the Brussels Blog section they may fall into the Diplomats segment.  

The **Interchange Module** allows the ADM functionality to integrate with an Ad Server (in the case of FT.com, this will be Google DFP). By integrating with the ad server, ad operations are able to target advertising to to audience segments created in the ADM.

See the [ADM User Guide](https://drive.google.com/viewerng/viewer?a=v&pid=sites&srcid=ZnQuY29tfGFkdmVydGlzaW5nLWVuYWJsZW1lbnR8Z3g6ZjIyZTBkZmQwZjkxOTc3&u=0) for more detailed information on the ADM functionality.

#### Perquisites

Before Krux can be enabled on site the [Ad Operations](mailto:adopsuk@ft.com) team must coordinate with an account manager at Krux to ensure that a Production and QA environment have been created in the Krux system specific to the site.
In most cases each site will have its own Production and QA environment set up in the Krux platform.

#### How to configure  

Krux provide a JS file referred to as the Krux Control Tag; all Krux Platform modules require this tag in order to initialise. The Krux platform is considered activated on a webpage when the Control Tag is present within the DOM of the page.

Importantly the Control Tag contains a unique identifier, the Config ID, which is specific to a product or site. Krux provide a Production Config ID as well as a dummy ID for testing on any non-production environments.

Including the Krux control tag and configuring it with the correct ID is handled by the o-ads library via the site specific configuration file. In order to enable the Krux platform integration a 'Krux' object must be added to the site configuration object; the Krux configuration object requires an ID attribute which should correspond to the unique Krux ID for the environment (Production or QA) for the site. 

```
krux: {
        id: 'AbcXyzJk'
      }
```
#### Further configuration options

It is possible to limit the number of Krux segments that are passed to the ad request via the 'limit' config property in the Krux config object, the example code below sets the maximum number of segments to 50.

```
krux: {
        id: 'AbcXyzJk',
        limit: 50
      }
```

##### Events
Krux also user interaqctions on the page to be captured via an events system,these are essentially image requests sent to Krux that contain an event ID and a set of attributes about the event, currently only one event is available for configuration, dwell time.

Dwell time is the measure of how much time a user is on the site, currently when the event is configured a tracking call will be made every x number of seconds for a maximum number of seconds. To add this event to your site add the following to your Krux config:

```
<meta name="krux" content=" { id: 'AbcXyzJk', event: dwell_time: {interval: 5, id: 'JCadw18P', total: 600}}" />
```
            
or  

```
    krux: {
        events: {
            dwell_time: {
                interval: 5, // every 5 seconds
                id: 'JCadw18P',
                total: 600 // for 10 minutes
            }
        }
    }
```



#### who to contact to get additional data points in your product
The [Ad Operations](mailto:adopsuk@ft.com) team will work with product developers to build relevant Krux segments.

#### Basic verification checks
It can be useful to carry out the following verification checks after enabling the Krux integration. 

 * Verify that the page makes a GET request for 'pixel.gif' from the 'beacon.krxd.net' domain. - This will demonstrate that the Control Tag has been attached to the page correctly.
 * Inspect the request headers for the pixel request to verify that the control tag is configured correctly:
   * ensure that there is a header parameter named '_kcp_d' and that it contains the value of the sites domain.
   * ensure that there is a header parameter named '_kcp_s' and that it contains the site value as its named in the Krux admin panel.



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
Setting the `cbTrack` property to true for an ad slot will configure o-ads to add a data-attribute to the HTML markup of the ad slot. Specifically the Chartbeat data-attirbute `data-cb-ad-id` is set and the ad position name is set as the value. The data-attribute is added to the `<div>` element that wraps the ad slot. See the example below:

```
<div id="hlfmpu" data-cb-ad-id="hlfmpu">...</div>
```


### Video Advertising

The o-ads library supports video pre-roll ads. See [Google DFP's documentation on video advertising](https://support.google.com/dfp_premium/answer/1711021?hl=en)

#### Basic Setup

[PLACEHOLDER]

#### Companions

The o-ads library integrates with Google DFP's Companion Service for video ads. The Companion Ads service enables the video pre-roll ad to be booked as a master ad which is able to pull in companion ads into other ad slots on the page.


The companion ads service is enabled via config settings. 
Setting the companions config property to true on a page will enable the Companion Ads service on all slots on the page. 

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

IAB's (Interactive Advertising Bureau) ad standards, creative guidelines and best practices can be found [here](http://www.iab.net/guidelines/508676/508767/ad_unit) which is a good guideline to general industry stardards around formats.

Some examples are:

1. Leaderboard (banner)

    A type of online advert that generally runs across the top of the screen.

    **Sizes (WxH pixels)**: 728x90, 970x90, 468x60, 970x66, 970x250

    **Creative Format**: gif, jpeg, rich media including flash

    **Expandable**: Yes (expand vertically down the page only)
    - 728x90 can expand to 728x300  
    - 970x90 can expand to 970x415 (also called pushdown)


2. Half page unit (hlfmpu)

    **Sizes (WxH pixels)**: 300x250, 300x600, 336x850, 336x280, 300x1050

    **Creative Format**: gif, jpeg, rich media including flash

3. Mid Page Unit (mpu)
    An advert that sits in the middle of the page, more likely to be viewed/read.

    **Sizes (WxH pixels)**: 300x250, 336x280

    **Creative Format**: gif, jpeg, rich media including flash

## Email Advertising

Offically Google DFP does not support email advertising so implementation is at your own risk. However it is possible to produce tags for creating static img tags which seem to be effective. **Contact ad ops for these tagss** and they will probably use the following tool to create them http://dfpgpt.appspot.com/
