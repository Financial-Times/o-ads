# Responsive Slots

Slots can be configured to react to the viewport size by either hiding the ad or requesting an ad of a different size.

The default "breakpoints" for ads (e.g. data-o-ads-formats-medium) differ slightly from the o-grid breakpoints, in that they are decided based on the widths of non-responsive ad formats such as leaderboards (which don't fit nicely into the current o-grid viewports). However, they can be overridden/added to if needed.

The default breakpoints provided in o-ads are as follows:

* small: 0px (This is the size where it is appropriate to show a MediumRectangle)
* medium: 760px (This is the size where it is appropriate to show a Leaderboard)
* large: 1000px (This is the size where it is appropriate to show a SuperLeaderboard,  and roughly equates to a landscape tablet)
* extra: 1025px (This additional breakpoint can fit a SuperLeaderboard/Billboard, and roughly equates to a larger desktop)

You can then define a slot to accept different sized Ads at different breakpoints:

```
<div
  class="o-ads my-advert-class"
  data-o-ads-name="top"
  data-o-ads-center="true"
  data-o-ads-targeting="pos=top;"
  data-o-ads-formats-small="false"
  data-o-ads-formats-medium="Leaderboard,Responsive"
  data-o-ads-formats-large="SuperLeaderboard,Responsive"
  data-o-ads-formats-extra="Billboard,SuperLeaderboard,Responsive"
  aria-hidden="true"></div>
```

## Changing the breakpoints

If, for whatever reason you need to amend the default breakpoints, they can be updated in the oAds init config object.

*Note:* please speak to AdOps or a member of the Advertising team before doing this, since it may affect their campaign targeting.

```js
oAds.init({
  ...
  responsive : {
    extra : [1400, 0],
    someOther: [1200, 0],
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
