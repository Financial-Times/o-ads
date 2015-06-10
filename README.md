# o-ads - Display Advertising <div id="title1"></div>

This module enables display advertising from [Googles DFP Ad server](http://www.google.com/dfp), enables custom behavioural (via [Krux](http://www.krux.com/)), demographics and semantic (via [Admantx](http://admantx.com/)) targeting and audited ad tracking with [Chartbeat](https://chartbeat.com/).

## Browser support <div id="title2"></div>
|  Browsers  | Primary Experience | Core Experience |
|:----------:|:------------------:|:---------------:|
|   Chrome   |        35+         |       35+       |
|   Firefox  |        30+         |       30+       |
|   Safari   |        7+          |       7+        |
|   IE       |        8+          |       8+        |

## Requirements

For basic use a DFP account with google is required, each targeting/tracking supplier will require their own configuration and setup.

Having a sales model is important! See this document for pre-requisite steps required for adding advertising to your product:
   https://docs.google.com/a/ft.com/document/d/1a9Dyi-4VzN_gzhYn6scVLgKICEP1AEPR7A7-shefklU/edit

## Quick start
Include o-ads in the build and and add the following markup to the page:
```html
<div class="o-ads" data-o-ads-gpt-unit-name="/6355419/Travel" data-o-ads-formats="MediumRectangle"></div>
```
o-ads will initialise on `o.DOMContentLoaded` and request a 300x250 (see Formats below) advert targeted from googles test network.
