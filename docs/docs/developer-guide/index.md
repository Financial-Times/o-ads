---
layout: default
title: Building with Ads
section: building
---

The delivery of FT Adverts is facilitated by a range of libraries, APIs and third party products:

### DFP
[DFP (part of Google Ad Manager)](https://support.google.com/admanager/answer/6022000?hl=en) (DoubleClick for Publishers) is our primary ad server. It is used to traffic and orchestrate which ads get served where and to whom. It is primarily managed by the AdOps team. Within DFP, adverts are referred to as 'creatives' or 'line items' and have respective ids, which are useful for debugging.

### o-ads & GPT

[o-ads](https://github.com/Financial-Times/o-ads) is an Origami component that provides the client-side integration with our ad server, by interfacing with [GPT](https://support.google.com/dfp_premium/answer/181073?hl=en) (Google Publisher Tag), which builds ad requests for you and includes specific details such as ad sizing or targeting. For some cases, this might be all you need to get up and running with ads.

### Ads API & Admantx

The [Ads API](https://github.com/Financial-Times/ads-api) is an attempt to centralise and standardise how we get data for advert targeting. It provides key/values that you can pass to [Admantx](http://www.admantx.com/) (contextual targeting) through o-ads to be able to target an FT User or context (article or concept).

### Krux

[Krux](http://www.krux.com/) is a DMP (Data Management Platform) that is used primarily to categorise and target our users and categorise them by behaviour. It can be included in your product via o-ads.
