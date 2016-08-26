---
layout: default
title: Building with Ads
section: building
---

The delivery of FT Adverts is facilitated by a range of libraries, APIs and third party products:

### DFP
DFP (DoubleClick for Publishers) is our primary ad server. It is used to traffic and orchestrate which ads get served where and to whom. It is primarily managed by the AdOps team.

### o-ads

o-ads is an Origami component that provides the client-side integration with our ad server, by interfacing with GPT (Google Publisher Tag). For some cases, this might be all you need to get up and running with ads.

### Ads API

The Ads API is an attempt to centralise and standardise how we get data for targeting adverts. It provides key/values that you can pass to o-ads to be able to target an FT User or context (article or concept).

### Krux

Krux is a DMP (Data Management Platform) that is used primarily to behaviourally categorise and target our users. It can be included in your product via o-ads.
