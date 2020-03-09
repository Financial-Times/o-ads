# @financial-times/o-ads [![CircleCI](https://circleci.com/gh/Financial-Times/o-ads/tree/master.svg?style=svg&circle-token=ff0caeb981693cbbbab6b70ab0ac99c9314bfc4f)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This package contains the core functionality used by the FT in providing ads across all of its sites. This includes ft.com, howtospendit.com, ftadviser.com and other specialist titles.

***Note**: This package is over 5 years old and will soon be deprecated in favour of more modern tools. Please speak to the advertising team (Slack #advertising-dev) if you are thinking of using this.*

# Install
First thing's first. You need some code. There are two ways:
### 1. Include a script on your site
The simple way. All you need to do is include the following in the `<head>` section of your site.
```
<href="https://www.ft.com/__origami/service/build/v2/bundles/css?modules=o-ads@^16.0.0" />
<script src="https://www.ft.com/__origami/service/build/v2/bundles/js?modules=o-ads@^16.0.0" async />
```

*Note: At the time of writing, latest version of o-ads is v16.0.0. Check latest available version and replace in the script and link tags*

### 2. Include o-ads as part of your build
If you're using a build system, you can include o-ads in your code through npm

```
npm install @financial-times/o-ads --save
```

And in your file
```
import oAds from '@financial-times/o-ads'
```

# Setup & Configuration

## Intialise the library
You'll need to initialise the o-ads library with some confirguration options in order for it to work. There are 2 ways of doing this:

### Declaratively

If you've included o-ads directly on your site using the script provided above, you'll need to initialise it declaratively like so:

```javascript
<script data-o-ads-config type="application/json">
{
  "gpt": {
    "network": 5887,
    "site": "test.5887.origami"
   }
}
</script>
```

 *Note: See below for all config options*

 ### Programatically 

If you've include o-ads in you code through npm, you will need to initialise it like so:

```javascript
// your/app/ads.js
import oAds from '@financial-times/o-ads';
oAds.init({
  gpt: {
    network: 5887,
    site: "test.5887.origami"
  }
  ...other config options
});
```

 *Note: See below for all config options*

## Configuration Options

These are all the valid configuration options

### `gpt`

| `gpt`         | **(required)** | `<Object>` | *GPT settings* |
| `gpt.network` | **(required)** | `<Integer>` |
| `gpt.site` | **(required)** | `<String>` |
| `gpt.zone` | (optional) | `<String>` |
| `disableConsentCookie` | (optional) | `<Boolean>` |


gpt
collapseEmpty
dfp_targeting
disableConsentCookie
formats
lazyLoad
passOAdsVersion
responsive
targetingApi
validateAdsTraffic
