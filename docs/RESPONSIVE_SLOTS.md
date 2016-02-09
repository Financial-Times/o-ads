# Responsive Slots
Slots can be configured to react to the viewport size by either hiding the ad or requesting an ad of a different size. Responsive slots react to the window being resized as long as the HTML is well formed. In various browsers the resize event can fail to fire if a doctype is not included.

## Configuration

```js
oAds.init({
  ...
  responsive : {
    extraLarge : [1400, 0],
    large : [1000, 0],
    medium : [600, 0],
    small : [0, 0]
  }
  ...
});
```

The `responsive` object's keys can be any name. Values are an array containing width and height breakpoints. It is recommended to have a `[ 0, 0 ]` breakpoint for clarity but is not necessary.

With the `responsive` object added, you can now add these breakpoint sizes to the ad slots' `sizes` object like so.

```js
oAds.init({
  ...
  responsive : {
    extraLarge : [1400, 0],
    large : [1000, 0],
    medium : [600, 0],
    small : [0, 0]
  },
  formats : {
    leaderboard : {
      sizes: {
        extraLarge : [[970, 90]],
        large : [[728, 90]],
        medium : [[468, 60]],
        small : false
      }
    },
    mpu : [[300, 250]]
  }
  ...
});
```

With this configuration a different sized `leaderboard` ad will be displayed on each screen size except a `small` one, where the slot will be collapsed instead.

Not all slots need to be configured responsively, for example the `mpu` slot in the above example will be the same size in all screen sizes.