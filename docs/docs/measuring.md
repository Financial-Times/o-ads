---
layout: default
title: Measuring
section: Overview
---

## DFP

DFP counts the following metrics:
- Impressions – These are counted _before_ the creative is fully loaded and viewed.
- Clicks – Counted on clicks received
- Discarded Impressions & Clicks – if either metric is considered invalid, DFP will discard it. The criteria for invalid action include web crawlers and spires, sources determined as illegitimate by DFP and double-clicks.

## CREATIVE WRAPPERS & MOAT

The ads served by DFP are all rendered inside an `<iframe>`, which allows the use of _creative wrappers_. These are snippets of code that are wrapped around an advert upon rendering, and can be used to serve third-party tracking pixels, which aid in measuring advert viewability.

This is used by ads, and the third-party responsible is [MOAT](https://moat.com/), a Media Rating Council accredited real-time analytics service.


For greater detail see:   
[DFP Counting impressions and clicks](https://support.google.com/dfp_premium/answer/2521337?hl=en)  
[DFP Ad server reporting metrics](https://support.google.com/dfp_premium/answer/2756935?hl=en)  
[Adding creative wrappers](https://support.google.com/dfp_premium/answer/2797762?hl=en)  
