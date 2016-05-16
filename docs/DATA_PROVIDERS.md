# Using 3rd Party Providers
To use these 3rd party providers with the o-ads library you will need to have accounts with them directly. An Ad Operations team should be able to do this.

## [Krux](http://www.krux.com/)
### Prerequisites
Before Krux can be enabled, the Ad Operations team should ensure that a Production and QA environment have been been created in the Krux system specific to the site. In most cases each site will have its own Production and QA environment set up in the Krux platform.

### Configuration
Enabling and configuring Krux is done by passing a `krux` object to the config with the krux id and attributes. For example

```js
oAds.init({
  ...
  krux: {
    id: 'XXXXXXXX',
    attributes: {
      user: {},
      page: {},
      custom: {}
    }
    }
  }
  ...
});
```

The attributes object can take user, page and custom data objects to send to Krux.
