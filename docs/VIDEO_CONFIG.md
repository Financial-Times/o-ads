#### Video
The o-ads library supports video pre-roll ads. See [Google DFP's documentation on video advertising](https://support.google.com/dfp_premium/answer/1711021?hl=en). It is enabled by adding to your configuration object.

```js
oAds.init({
  ...
  'video' : true
  ...
});
```

This setting allows the ability to use `buildURLForVideo()`

--------------------------------------------------------------------------------

##### `oAds#buildURLForVideo(zone, pos, kv)`
Request a url in a format suitable to pass to compatible video players for them to retrieve scheduled ad serving data in the [VAST (Video Ad Serving Template)](http://www.iab.com/guidelines/digital-video-ad-serving-template-vast-3-0/) format.

Parameter      | Description
-------------- | -------------------------------
zone           | DFP_ZONE
pos (optional) | POSITION_NAME (DEFAULT 'video')
kv (optional)  | ADDITIONAL_TARGETING_KEY_VALUES

Returns an object with variables suitable for use in many different players
- `urlStem` & `additionalTargetingParams` for [brightcove](https://www.brightcove.com/en/) use.
- `fullURL` for [VideoJS](http://videojs.com/) use.

Currently players with IMA3 (Google's Interactive Media Ads) plugins are supported. Many video players support this functionality including brightcove (out of the box) and VideoJS (with plugin)

## Configuration guides for [brightcove](https://support.brightcove.com/en/video-cloud/docs/using-dfp-ima-3-ad-source) and [VideoJS](http://googleadsdeveloper.blogspot.co.uk/2014/08/introducing-ima-sdk-plugin-for-videojs.html)
### Companions
The o-ads library integrates with Google DFP's Companion Service for video ads. The Companion Ads service allows the video pre-roll ad to to be booked as a master ad which is able to pull in companion ads into the other ads slots on the page.

The cCompanion Ads service is enabled via config settings by setting the `companions` config property to `true`.

For example

```js
oAds.config('companions', true);
```

--------------------------------------------------------------------------------

The Companion Ads service can be enabled on a particular DFP zone (for example `'video-hub'`) within a site. To do this the following code would be added to the site specific config.

```js
if (oAds.config('dfp_zone') === 'video-hub'){
  oAds.config('companions', true);
}
```

--------------------------------------------------------------------------------

By default the Companion Ads service is added to all ad slots on a page where the companions property has been set to `true`. It is possible to exclude the Companion Ads service from being et on particular slots via slot level configuration. Setting the `companions` property to `false` will explicitly exclude that ad slot from using the Companion Ads service.

For example

```js
oAds.init({
  ...
  formats : {
    mpu : {
      sizes : [[300, 250], [336,280]],
      companions : false
    }
  }
  ...
});
```
