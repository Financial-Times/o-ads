---
layout: default
title: Setting up a new product
section: building
---

## 1. Include o-ads on your site
Include the latest version of o-ads via `bower` or the [Origami Build Service](http://build.origami.ft.com/v2/) — which we recommend for use on the websites. This way you can get updates automatically and you do not have to build the module manually from source (see the [Origami quick start instructions](http://registry.origami.ft.com/components/o-ads#section-usage) for more).

Alternately, you may use the [Origami Build Tools](http://origami.ft.com/docs/developer-guide/modules/building-modules/) to include the library as a part of your codebase and build it manually. This option involves a certain level of setup.

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
* Declaratively:
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

* Imperatively
```js
const oAds = require('o-ads');
oAds.init({...});
```

## 4. Targeting

Products should provide as much targeting as possible to allow the full range of adverts to be served. They generally are sent to the ad server in the form of key/value pairs.

We can target ads in the following ways:

* **Geographic**
Geographic targeting is provided by DFP based on the IP address that the ad request was made from. We don't need to do anything to enable this.

* **Demographic**
Demographic data is provided by the [Ads API](https://github.com/Financial-Times/ads-api).

`https://ads-api.ft.com/v1/user`

This endpoint provides a list of key-values including industry/job positions provided by users when registering, demographic/behavioural models from HUI/Data Warehouse, user IDs etc.

* **Behavioural**
Behavioural targeting at the FT is provided by a third party called [Krux](http://www.krux.com/). To enable Krux for your product, you need a Krux ID, which can be provided by AdOps.

This can then be initialised by o-ads:

```js
oAds.init({
	krux: {
		id: '1234',
		attributes: {
			page: {
				key: 'value' // these are used by Krux to collect behavioural data about the user and their context. Some of these can be provided by the two ads-api responses, showcased below.
			},
			user: {
				key: 'value'
			}

		}
	}
})

```

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
		krux: {
			id: '1234', //get this from AdOps
		},
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
