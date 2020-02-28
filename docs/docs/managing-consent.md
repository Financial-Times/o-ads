---
layout: default
title: Managing Consent
section: Managing Consent
---

# Managing User Consent Options within the FT.com Advertising Stack

## Overview
On FT.com Users are able to opt-in/out of different types of advertising.
Note that currently there is no option to allow users to opt-out of *all* advertising on FT.com. 

There are currently two options available to FT.com users to tailor the types of advertising they will see on FT.com; these are:
  * Demographically Targeted Ads (toggle on/off)
  * Behaviorally Targeted Ads (toggle on/off)

This documentation will detail: 
  * What is meant by the terms "ad targeting", "demographicaly targeted ads", "behaviourally targeted ads"
  * How are these types of ad targeting achieved within the FT.com tech-stack
  * How does a user toggle these types of advertising options on/off
  * What happens within the ft.com tech-stack when these options are toggled on/off


## General definitions of key terms
### Ad Targeting
The term "targeted advertising" is used within the advertising industry to refer to any advertising which is directed to a specific audience. 
An example of targeted advertising would be adverts that are only shown to users in a specific geo-location. 

### Demographic targeting
This term refers to adverts targeted to specific User demographic groups; for example, adverts that are only shown to users who are in a specific age-range or users who are of a specific gender. 


### Behavioral targeting
"A form of online marketing that uses advertising technology to target web users based on their previous behaviour. Advertising creative and content can be tailored to be of more relevance to a particular user by capturing their previous decision making behaviour, for example, filling out preferences or visiting certain areas of a site frequently."


### How is ad targeting achieved in the FT.com ad-stack

Google's Ad-Manager platform is used as the ad-server for all advertising displayed on FT.com. 
When a user visits FT.com, client-side JS code runs in the user's browser, this code makes "ad-requests" (client-side network requests) to the ad-server to request ad-creative code to fill the advertising slots on the page.

Within these network requests there is a specific URL parameter that is used to pass key/value paramaters associated with targeting. The key of the targeting parameter in the ad-request is `cust_params`.

An example ad-request is detailed below, the `cust_params` URL parameter used for targeting is highlighted in **bold**:

 https://securepubads.g.doubleclick.net/gampad/ads?gdfp_req=1&pvsid=3469075762646365&correlator=4162174011836388&output=ldjh&impl=fif&adsid=ChEIgKjT8gUQ2eXQ4s_U_bbNARJBAH4U4lyaGccWqfqy6DeMYkjFEFzduB-0pfrdtows6jdBUOjR0Db09_UpuGtGxXsZDk3lqqwOaoID3UZ9P4VGzSM&jar=2020-2-25-18&eid=21065598%2C21062889%2C21062899%2C21065393%2C21065443%2C21065304&vrg=2020022001&guci=1.2.0.0.2.2.0.0&sc=1&sfv=1-0-37&ecs=20200225&iu_parts=5887%2Cft.com%2Chome%2CUK&enc_prev_ius=%2F0%2F1%2F2%2F3&prev_iu_szs=970x250%7C970x90%7C970x66%7C728x90%7C2x2&prev_scp=pos%3Dtop&eri=4
&**cust_params=gender%3DMale%26loggedIn%3Dtrue**&cookie=ID%3D7a6165d8aaa5aa4f%3AT%3D1564996817%3AS%3DALNI_Man8I_cWUqfEVXn_YbhprIJ16Y1iQ&bc=31&abxe=1&lmt=1582654691&dt=1582654691687&dlt=1582654687080&idt=4558&frm=20&biw=1300&bih=742&oid=3&adxs=165&adys=0&adks=866848042&ucis=1&sps=url,,https%253A%252F%252Fwww.ft.com%252F&ifi=1&u_his=2&u_h=1080&u_w=1920&u_ah=1057&u_aw=1920&u_cd=24&u_nplug=3&u_nmime=4&u_sd=2&flash=0&url=https%3A%2F%2Fwww.ft.com%2F&dssz=67&icsg=4503599626324608&std=0&vis=1&dmc=8&scr_x=0&scr_y=0&psz=1300x250&msz=1300x250&ga_vid=1613608053.1565015116&ga_sid=1582654692&ga_hid=1763655547&ga_fc=true&fws=4&ohw=1300


In the example ad-request above the `cust_params` URL parameter contains two URL encoded key/values: `cust_params=gender%3DMale%26loggedIn%3Dtrue`.

URL decoded: `cust_params=gender=male&loggedIn=true`

So in the above network request, we have a URL parameter with the key `cust_params`; the value of this parameter is itself a set of URL encoded key/values.

`gender=male`, `loggedIn=true`.

The ad-server will read in these key/values from the ad-request and only ads that have been set to target these key/values will be returned in the response from the ad-request.

The Ad-operations team use the AdManager ad-server UI to set-up different sets of adverts which are targeted to different key/values.
 
#### How are targeting key/values set in ad-requests?

##### o-ads is used to set targeting key/values:
On FT.com we use a client-side library `o-ads` to abstract away the complexity of making different types of ad-requests on different pages.
The `o-ads` library contains a module specifically used to handle key/value targeting for ad-requests: [o-ads targeting module](https://github.com/Financial-Times/o-ads/blob/master/src/js/targeting.js)

The targeting module implements simple public methods for setting/getting targeting key/values that go into ad-requests. Note that on FT.com all `o-ads` public functions are exposed on the `window.oAds` object, therefore we are able to run the following command `oAds.targeting.get()` in the dev-tools console and this will output the set of targeting key/values that has been set for ads on the page.

#### Where is targeting data derived from

On FT.com there are various types of data that get passed as key/values in ad-targeting; these include:
 * Contextual meta-data about the page; e.g. Page-type (article page / front-page / stream-page)
 * User demographic data; e.g. user's job-title
 * Data-points relating to how the user has used FT.com; e.g. if the user has scrolled to the bottom of a particular article.

In general there are two sources used to derive targeting key/value data on FT.com

1. [Ads-api](https://github.com/Financial-Times/next-ads-api) - used for contextual page meta-data and user demographic data
2. [Permutive](https://github.com/Financial-Times/n-permutive) - used for user behavior based data

##### Ads-api derived targeting:
See the ads-api repo for full documentation
This API is an attempt to centralise the data used for targeting adverts for the FT, and allow for a consistent, extensible and performant solution that can work across multiple products.
The API returns a list of key/values which can be passed to the ad server (via o-ads or amp pages)
For the purposes of Managing Consent, a key area of concern within the ads-api is the `user-endpoint`: https://ads-api.ft.com/v1/user
The User end-point does the following:
 * Authenticates the session via the logged-in user's cookie (or returns a default response for non-logged-in users)
 * Makes a request to the Consent-Proxy, [see code](https://github.com/Financial-Times/next-ads-api/blob/2466fa58a1b487734fd60d56d9a6b2e0f1179a54/server/lib/User.js#L1)
 * Retrieves the user's consent options for 'demographicadsOnsite' (see FT Consent Cookie section below for more details)
 * If the we have consent from the user for demographic ads, the ads api makes a request to the membership to retrieve sign-up data (job title, etc) and "derived gender", "derived job position" from the HUI api.
 * This data is returned as json on the user-end-point
 * o-ads (which initiates the fetch request to the user-endpoint) will marshal the end-point data into targeting key/values that are sent in the ad-requests on the page.
The ads-api is a 

The advertising stack has been integrated with the `next-control-center` and `next-consent-proxy` 

### H3
#### H4
##### H5
###### H6

