# o-ads

Display advertising

## Browser support
|  Browsers  | Primary Experience | Core Experience |
|:----------:|:------------------:|:---------------:|
|   Chrome   |        35+         |       35+       |
|   Firefox  |        30+         |       30+       |
|   Safari   |        7+          |       7+        |
|   IE       |        8+          |       8+        |

Known issues:

* Excessively big ads may cause user dissatisfaction

## Markup

Before adding adveritsing to your product you will need to contact Ad Operations and have a sales strategy agreed. See checklist here (add link).

Add ad slots to your page using the following div structure:

```html
<div class="o-ads" data-o-ads-position="mpu">
    ...
</div>
```

Add configuration to enable targeting