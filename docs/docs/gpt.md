---
layout: default
title: GPT Methods
section: building
---

This page is a reference of the available functions when calling `oAds.gpt`

#### `init()`

Will initialise the GPT script functionality by downloading it, and also setting listeners to activate the ad slots

#### `updatePageTargeting(targetingObj)`

Takes an object that overrides the current targeting parameters

#### `clearPageTargetingForKey(key)`

Updates the targeting parameters for the specified key

#### `hasGPTLoaded()`

Returns a boolean telling whether the GPT library is fully usable, will only return true if the script is fully downloaded

#### `loadGPT`

Contrarity to `init()`, loadGPT only downloads the GPT script without setting any listeners, handy if there's a need to reload the script after a failure in the case of SPAs

#### `debug()`

Will log out the GPT config to the console
