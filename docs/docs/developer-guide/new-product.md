---
layout: default
title: Setting up o-ads
section: building
---

## 1. Include o-ads on your site

The fastest way to include o-ads is through the [Origami Build Service](http://build.origami.ft.com/v2/) — which we recommend for most use cases. You'll get a fast, up to date version of the library. All you need to include is a script tag and a link tag on your page (see the [Origami quick start instructions](http://registry.origami.ft.com/components/o-ads#section-usage) for more).

If you need to add o-ads as part of your build system, you can install with `npm install o-ads` or `bower install o-ads`.

**IMPORTANT NOTE ABOUT CONSENT**
Since GDPR came into effect in May 2018, o-ads library now requires consent for custom targeting. By default, the o-ads library will check for consent in a cookie with the name `FTConsent`. It will look for 2 types of consent:

- demographic (or programmatic) - it will check for `programmaticadsOnsite:on` inside the cookie.
- behavioural - it will check for `behaviouraladsOnsite:on` inside the cookie.

If these are present, then extra targeting information (see section 4 below) can be added to the ad requests.

To disable the consent check, you can set the `disableConsentCookie` key to `true` when configuring o-ads.

```
oAds.init({
	disableConsentCookie: true
})
```


**Extra step for FT Teams**

Please feed back the following information to the Dev Test and Advertising team:
* Where you integrate it (Site, URL?)
* How you are using it (Build Service or Manual Build)
* Which version you are using (do you use a specific version and is there auto upgrade link, e.g. http://semver.org/, patch only, version only, etc.)

## 2. Set up the ad unit information.
The Ad Unit is DFP's categorisation of sites and products across the FT estate. It is the most basic form of being able to target ads at specific areas.

It generally follows the pattern:

```
{
	network: 5887, //DFP's network code - 5887 is the main code for the FT
	site: 'ft.com', // the name of the product
	zone: 'world/economy' // slash-separated section/subsection, generally describes the area of content
}

```

For FT.com, the 'zone' can be retrieved from the Ads API (see [Targeting]({{site.baseurl}}/docs/developer-guide/new-product#targeting) for more details.)

For new products, you will need to liaise with AdOps to decide on the site and zone hierarchy.

## 3. Initialise o-ads
### 3.1. Declaratively:

If you've included o-ads from the origami registry by inserting a `<script>` and `<link>` tag in your html page, this is how you initialise o-ads. This is the bare minimum `o-ads` configuration

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

Where network and site are settings from Google's DFP service which help it locate which ads to server for your specific site.

This will configure and initialise oAds globally. You can access the oAds library in `window.oAds`.

Note: There are more configuration options which are explained in subsequent sections.

### 3.2. Programmatically

If you've used bower or npm to load in o-ads, you can import and initialise it as follows, in one of your files.

```js
// your/app/ads.js
import oAds from 'o-ads';
oAds.init({
		gpt: {
			network: 5887,
			site: "test.5887.origami"
		}
});
```

Note: As of version 11, you cannot `require('o-ads')` anymore. You must use the import syntax above.

## 4. Slots

Ad slots can be easily defined declaratively as explained in [Display Ads](display). In that case, each ad slot is initialised automatically after the browser has finished loading the content.

However, when defining ad slots with javascript, it is necessary to invoke the `initSlot` method on them, like this:

```js
const slots = Array.from(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
slots.forEach(ads.slots.initSlot.bind(ads.slots));
```

## 5. Targeting

Products should provide as much targeting as possible to allow the full range of adverts to be served. They generally are sent to the ad server in the form of key/value pairs.

We can target ads in the following ways:

* **Geographic**
Geographic targeting is provided by DFP based on the IP address that the ad request was made from. We don't need to do anything to enable this.

* **Demographic**
Demographic data is provided by the [Ads API](https://github.com/Financial-Times/ads-api). The `https://ads-api.ft.com/v1/user` endpoint provides a list of key-values including industry/job positions provided by users when registering, demographic/behavioural models from HUI/Data Warehouse, user IDs etc.

* **Contextual**
The [Ads API](https://github.com/Financial-Times/ads-api) also has endpoints that give targeting information relevant to the context the user is on. This context can be a content UUID, or the UUID of a concept/thing recognised by the content API. It's powered by both metadata from the Content API and a third party called [AdmantX](http://www.admantx.com/).

`https://ads-api.ft.com/v1/content/<uuid>`

`https://ads-api.ft.com/v1/concept/<uuid>`

For non-next pages that don't use content or concept UUIDs, but instead the full URL of the page, the endpoint for contextual targeting information is:

`https://ads-api.ft.com/v1/page/<url>`

The initialisation of o-ads is currently included in n-ui along with specific configuration that handles the first two endpoints. If your product is not Next we recommend the following:

Below is a rough sketch of how you might get all that data, and pass it in to the initialisation of o-ads:

```js
//IE9 and CORS don't play nicely, so you need to proxy the response from your own domain for older browsers.
const apiUrlRoot = ('withCredentials' in new XMLHttpRequest()) ? 'https://ads-api.ft.com/v1' : 'https://mydomain.ft.com/proxy/ads-api/v1';

	oAds.init({
		targetingApi: {
			user: `${apiUrlRoot}/user`,
			page: `${apiUrlRoot}/page/<url>`,
			usePageZone: true //overwrites the gpt zone - this option is false by default
		},
		dfp_targeting: 'some_other_key=value' // TODO: pass an object here
		gpt: {
			network: 5887,
			site: 'ft.com',
			zone: 'unclassified' // default zone, will be overwritten by the response from the API
	})
});

```

If you need to know when oAds has been initialised with all the API calls, this can be done in the following ways:

* `oAds.init()` returns a Promise - so you can do `oAds.init().then(myStuff)`;
* We fire an event `oAds.initialised` on the document
* We set a boolean property on the oAds instance: `oAds.isInitialised`

## 6. Single Page Apps

Single page apps are likely to want to update the targeting throughout the lifecycle of the page (for example, if a user logs out, or a new article is loaded but without loading a new page).

For this use case, a method is provided, which will:

* update the configuration with any new configuration
* Re-make any API calls (if new URLs are passed) and reset any leftover targeting from old API calls (NOTE: this will unset ALL targeting, even if you're not passing a URL for one of them).

`oAds.updateContext(config, isNewPageView)`

e.g.

```js
oAds.init({
	gpt: {
		network:'5887',
		site: 'ft.com',
		zone: 'world'
	},
	targetingApi: {
		user: 'https://ads-api.ft.com/v1/user',
		page: 'https://ads-api.ft.com/v1/content/abc'
	}
});

function onSomeUserActionThatChangesThePage() {
	//change the zone and reget contextual targeting
	oAds.updateContext({
		gpt: {
			zone: 'uk'
		},
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/content/def'
		}
	}, true);
}

function onUserLogout() {
	//update the user targeting details
	oAds.updateContext({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user'
		}
	});
}
```
