# oAds [![CircleCI Status](https://circleci.com/gh/Financial-Times/o-ads.svg?style=shield&circle-token=36a37c6ca27a08408c2575c7834f5f6f5c5c9d21)](https://circleci.com/gh/Financial-Times/o-ads/tree/master)

This is an Origami module that enables display advertising from [Googles DFP Ad server](http://www.google.com/dfp), and provides customised demographic, behavioural (via [Krux](http://www.krux.com/)), and contextual (via [Admantx](http://admantx.com/)) targeting.

### Requirements
For basic use, a DFP account with Google is required.  
Each targeting/tracking supplier will require their own configuration and setup.

### Demos
Demos for all ads currently served across ft.com are available in the [Origami Registry](http://registry.origami.ft.com/components/o-ads).

### [Documentation](https://financial-times.github.io/o-ads)
Includes detailed installation and set-up instructions, along with details about the module.

## Migration Guide

### Upgrading to v8
- Breaking change: If you use the destroy method on a slots instance, this will now properly destroy the given slots rather than just clear them
- New feature: util event 'off' - remove an event listener

### Upgrading to v9
- Breaking change: o-ads now requires consent before loading Krux or adding custom targeting to the ad calls. Consent can be provided in two ways:

1. Provide a cookie with the name `FTConsent` and specify which consent the user has given as part of the value like this: `behaviouraladsOnsite:on,programmaticadsOnsite:on`
2. Initialise o-ads with the `disableConsentCookie` option.
