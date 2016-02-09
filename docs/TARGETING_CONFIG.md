# Targeting
Additional targeting can be added at either the individual slot level or by adding to the config object.

Targeting is passed, as a semicolon separated key/value string (e.g ), to either the config object using the key `dfp_targeting`,

```js
oAds.init({
  ...
  dfp_targeting: 'some=test;targeting=params'
  ...
});
```

or to an individual slot by adding it as a `data-o-ads-targeting` attribute;

```html
<div class="o-ads" data-o-ads-targeting="some=single;slot=specific;targeting=params" data-o-ads-gpt-unit-name="/6355419/Travel" data-o-ads-formats="MediumRectangle" ></div>
```
