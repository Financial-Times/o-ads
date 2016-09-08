---
layout: default
title: Setting up a new product
section: building
---

### 1. Include o-ads on your site
Include the latest version of o-ads via bower or the Build Service (see the [Origami quick start instructions](http://registry.origami.ft.com/components/o-ads#section-usage) for more).

### 2. Set up the ad unit information.
The Ad Unit is DFP's categorisation of sites and products across the FT estate. It is the most basic form of being able to target ads at specific areas.

It generally follows the pattern:
```
{
	network: 5887, //DFP's network code - 5887 is the main code for the FT
	site: 'ft.com', // the name of the product
	zone: 'world/economy' // slash-separated section/subsection, generally describes the area of content
}

```

For FT.com, the 'zone' can be retrieved from the Ads API (see [Targeting]({{site.baseurl}}/docs/developer-guide/targeting) for more details.)

For new products, you will need to liase with AdOps to decide on the site and zone hierachy.

### 3. Initialise o-ads
* Declaratively:
```
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
```
const oAds = require('o-ads');
oAds.init({...});
```

### 4. Targeting

Products should provide as much targeting as possible to allow the full range of adverts to be served. They generally are sent to the ad server in the form of key/value pairs.

We can target ads in the following ways:

* **Geographical**
Geographic targeting is provided by DFP based on the IP address that the ad request was made from. We don't need to do anything to enable this.

* **Demographic**
Demographic data is provided by the [Ads API](https://github.com/Financial-Times/ads-api).

`https://ads-api.ft.com/v1/user`

This endpoint provides a list of keys values including industry/job positions provided by users when registering, demographic/behavioural models from HUI/Data Warehouse, user IDs etc.

* **Behavioural**
Behavioural targeting at the FT is provided by a third party called [Krux](http://www.krux.com/). To enable Krux for your product, you need a Krux ID, which can be provided by AdOps.

This can then be initialised by o-ads:

```
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
The [Ads API](https://github.com/Financial-Times/ads-api) also has endpoints that give targeting information relevant to the context the user is on. This context can be a content UUID, or the UUID of a concept/thing recognised by the content API. It is powered by both metadata from the Content API and a third party called AdmantX.

`https://ads-api.ft.com/v1/content/<uuid>`

`https://ads-api.ft.com/v1/concept/<uuid>`


Below is a rough sketch of how you might get all that data, and pass it in to the initialisation of o-ads:

```
const apiUrlRoot = 'https://ads-api.ft.com/v1';

function getContextualTargetingPromise (appName) {

		const uuid = '5d608f40-6a16-11e6-ae5b-a7cc5dd5a28c';
		const referrer = document.referrer;
		url = `${apiUrlRoot}/content/${uuid}`;
		if(referrer) {
			url += `?referrer=${encodeURIComponent(referrer.split(/[?#]/)[0])}`;
		}

		return (uuid && url) ? fetch(url)
		.then(res => res.json())
		.catch(() => ({})) : Promise.resolve({});
};

function getUserTargetingPromise () {
	const apiUrlRoot = 'https://ads-api.ft.com/v1/';
	return fetch(`${apiUrlRoot}/user`, {
		credentials: 'include'
	})
	.then(res => res.json())
	.catch(() => ({}));
};

Promise.all([ getContextualTargetingPromise(), getUserTargetingPromise()])
.then((data) => {
	const contextualData = data[0];
	const userData = data[1];
	//Grab data from response and pass it into oAds.init()
	oAds.init({
		gpt: {
			...
		},
		dfp_targeting: '' //This would be all the data from contextualData and userData as a key/value string. TODO: make this much easier,
		krux: {
			id: '1234', //get this from AdOps
			attributes: {} //
		}
	})
});

```


