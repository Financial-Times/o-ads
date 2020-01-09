---
layout: default
title: Setting up the Ad Unit
section: building
---

## 1. How is the Ad Unit retrieved by oAds and nAds?

### 1.1. oAds

If `config.usePageZone` is set to _true_, oAds will retrieve the DFP ad unit from the Ads API response.
In the Ads API response, the DFP ad unit is specified as a 2-elements array datapoint called `dfp.adUnit`. These 2 `dfp.adUnit` values are concatenate and used as `gpt.zone`, as follows.

```
	gpt.zone = responseObj.dfp.adUnit.join('/');
```

When `config.usePageZone` is set to _false_, then oAds will ignore the DFP ad unit returned by the Ads API. In this case the ad unit site/zone can be specified either _declaratively_ or _programmatically_ using one of the following methods.

#### 1.1.1. Declaratively

Set the slot’s attribute `data-o-ads-gpt-unit-name`.

#### 1.1.2. Programmatically

Set option `gpt.unitName`.
e.g.,
```
    {
        gpt: {
            unitName: "5887/ft.com/money",
        },
    }
```

Or, set options `gpt.site` and `gpt.zone`.
e.g.,
```
    {
        gpt: {
            network: “5887”,
            site: “ft.com”,
            zone: "money",
        },
    }
```

#### 1.1.3. References
- [Ads API data provider](https://github.com/Financial-Times/o-ads/blob/35a33741118a80efabcaec9505c2dead064528ea/src/js/data-providers/api.js#L50)
- [gpt.setUnitName()](https://github.com/Financial-Times/o-ads/blob/master/src/js/ad-servers/gpt.js#L363)

### 1.2. nAds

nAds is only used for Financial Times apps, so it always uses the page zone provided by the Ads API. The network datapoint is already populated accordingly.

#### 1.2.1. Programmatically

Set `options.dpf_site` and `options.dfp_zone`.
e.g.,
```
    {
        options: {
            site: "ft.com",
            zone: "money",
        },
    }
```

#### 1.2.2. References
- [nAds Usage Guide](https://github.com/Financial-Times/n-ads#usage)

## 2. How is the Ad Unit calculated by the Ads API?

An AdUnit is a couplet of values `[site, zone]` and it is derived from data coming from 2 sources: _DFP mappings_ and _Facet Tags_.

### 2.1. DFP Mappings
Ads API retrieves DFP mappings from the Bertha server https://bertha.ig.ft.com/view/publish/gss/1faPId85Ni1oouPtNHOa73RDjLS6QItWFuxhqmyZSCX0/dfp
The Bertha server returns a list of records. Every record is identified by a concept ID and contains a name, site, zone as follows.

e.g., a record from DFP mapping
```
{
    "id": "37b1e62e-93ff-4991-aa83-c1ec974d4802", // concept ID
    "name": "Capital Markets",
    "site": "markets",
    "zone": "capital.markets"
    }
```


### 2.2. Facet Tags
Ads API also retrieves Facet Tags from the Facets API https://tag-facets-api.ft.com/annotations?tagged=<UUID>&range=137d
The Facets API returns a list of records like this.

E.g., a record from the Facet API response
	{
		"count": 484,
		"id": "0667615f-499e-4fa6-8130-f3430450228d",
		"url": "https://www.ft.com/stream/0667615f-499e-4fa6-8130-f3430450228d",
		"prefLabel": "US trade",
		"directType": "http://www.ft.com/ontology/Topic"
	},


### 2.3. How the Ad Unit is calculated
An AdUnit is a couplet of values `[site, zone]` and it is calculated as follows.

1. Search the `DFP mappings` – retrieved from Bertha server - by Concept ID. If found, get the site and zone.

2. Get the IDs of the `Facets Tags` – previously retrieved from the Facets API - whose `derivedType` - i.e., the last word from the `directType` URL - is different from _Genre_. Look for each of these values into the DFP mappings list. Stop when one is found with both site and zone.