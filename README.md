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

#### How to configure  
Individual Ad Slots can be configured to be trackable by Chartbeat. 

In order to enable an ad slot to be tracked by chartbeat the `cbTrack` property must be set to `true` in the product specific configuration object.

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




