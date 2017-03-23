# ember-api-feature-flags ![Download count all time](https://img.shields.io/npm/dt/ember-api-feature-flags.svg) [![CircleCI](https://circleci.com/gh/poteto/ember-api-feature-flags.svg?style=shield)](https://circleci.com/gh/poteto/ember-api-feature-flags) [![npm version](https://badge.fury.io/js/ember-api-feature-flags.svg)](https://badge.fury.io/js/ember-api-feature-flags) [![Ember Observer Score](http://emberobserver.com/badges/ember-api-feature-flags.svg)](http://emberobserver.com/addons/ember-api-feature-flags)

API based, read-only feature flags for Ember. To install:

```
ember install ember-api-feature-flags
```

## How it works

`ember-api-feature-flags` installs an initializer into your app. This initializer will fire when your app boots, fetching your feature flag data from a specified URL.

Once fetched, inject the `featureFlags` service, then easily check if a given feature is enabled/disabled in both Handlebars:

```hbs
{{#if featureFlags.myFeature.isEnabled}}
  <p>Do it</p>
{{/if}}

{{#if featureFlags.anotherFeature.isDisabled}}
  <p>Do something else</p>
{{/if}}
```

...and JavaScript:

```js
import Ember from 'ember';

const {
  Component,
  inject: { service },
  get
} = Ember;

export default Component.extend({
  featureFlags: service(),

  actions: {
    save() {
      let isDisabled = get(this, 'featureFlags.myFeature.isDisabled');

      if (isDisabled) {
        return;
      }

      // stuff
    }
  }
});
```

## API fetch failure

When the fetch fails, the service enters "error" mode. In this mode, feature flag lookups via HBS or JS will still function as normal. However, they will always return the default value set in the config (which defaults to `false`). You can set this to `true` if you want all features to be enabled in event of fetch failure.

## Configuration

To configure, add to your `config/environment.js`:

```js
/* eslint-env node */
module.exports = function(environment) {
  var ENV = {
    'ember-api-feature-flags': {
      featureUrl: 'https://www.example.com/api/v1/features',
      featureKey: 'feature_key',
      enabledKey: 'value',
      shouldMemoize: true,
      defaultValue: false
    }
  }
  return ENV;
```

`featureUrl` **must** be defined, or `ember-api-feature-flags` will not be able to fetch feature flag data from your API.

### `featureUrl* {String}`

Required. The URL where your API returns feature flag data. You can change this per environment in `config/environment.js`:

```js
if (environment === 'canary') {
  ENV['ember-api-feature-flags'].featureUrl = 'https://www.example.com/api/v1/features';
}
```

### `featureKey {String} = 'feature_key'`

This key is the key on your feature flag data object yielding the feature's name. In other words, this key's value determines what you will use to access your feature flag (e.g. `this.get('featureFlags.newProfilePage.isEnabled')`):

```js
// example feature flag data object
{
  "id": 26,
  "feature_key": "new_profile_page", // <-
  "key": "boolean",
  "value": "true",
  "created_at": "2017-03-22T03:30:10.270Z",
  "updated_at": "2017-03-22T03:30:10.270Z"
}
```

The value on this key will be normalized by the [`normalizeKey`](#normalizeKey) method.

### `enabledKey {Boolean} = 'value'`

This determines which key to pick off of the feature flag data object. This value is then used by the `FeatureFlag` object (a wrapper around the single feature flag) when determining if a feature flag is enabled.

```js
// example feature flag data object
{
  "id": 26,
  "feature_key": "new_profile_page",
  "key": "boolean",
  "value": "true", // <-
  "created_at": "2017-03-22T03:30:10.270Z",
  "updated_at": "2017-03-22T03:30:10.270Z"
}
```

### `shouldMemoize {Boolean} = true`

By default, the service will instantiate and cache `FeatureFlag` objects. Set this to `false` to disable.

### `defaultValue {Boolean} = false`

If the service is in error mode, all feature flag lookups will return this value as their `isEnabled` value.

## API

* Properties
  + [`didFetchData`](#didfetchdata)
  + [`data`](#data)
* Methods
  + [`configure`](#configure)
  + [`fetchFeatures`](#fetchfeatures)
  + [`receiveData`](#receivedata)
  + [`receiveError`](#receiveerror)
  + [`normalizeKey`](#normalizekey)
  + [`get`](#get)
  + [`setupForTesting`](#setupfortesting)

#### `didFetchData`

Returns a boolean value that represents the success state of fetching data from your API. If the GET request fails, this will be `false` and the service will be set to "error" mode. In error mode, all feature flags will return the default value as the value for `isEnabled`.

**[⬆️ back to top](#api)**

#### `data`

A computed property that represents the normalized feature flag data.

```js
let data = service.get('data');

/**
  {
    "newProfilePage": { value: "true" },
    "newFriendList": { value: "true" }
  }
**/
```

**[⬆️ back to top](#api)**

#### `configure {Object}`

Configure the service. You can use this method to change service options at runtime. Acceptable options are the same as in the [configuration](#configuration) section.

```js
service.configure({
  featureUrl: 'http://www.example.com/features',
  featureKey: 'feature_key',
  enabledKey: 'value',
  shouldMemoize: true,
  defaultValue: false
});
```

**[⬆️ back to top](#api)**

#### `fetchFeatures {String} = featureUrl`

Performs the GET request to the specified URL. If no value is passed in, it will use the `featureUrl` set in the service. Returns a Promise.

```js
service.fetchFeatures().then((data) => doStuff(data));
```

**[⬆️ back to top](#api)**

#### `receiveData {Object}`

Receive data from API and set internal properties. If data is blank, we set the service in error mode.

```js
service.receiveData([
  {
    "id": 26,
    "feature_key": "new_profile_page",
    "key": "boolean",
    "value": "true",
    "created_at": "2017-03-22T03:30:10.270Z",
    "updated_at": "2017-03-22T03:30:10.270Z"
  },
  {
    "id": 27,
    "feature_key": "new_friend_list",
    "key": "boolean",
    "value": "true",
    "created_at": "2017-03-22T03:30:10.287Z",
    "updated_at": "2017-03-22T03:30:10.287Z"
  }
]);
service.get('data') // normalized data
```

**[⬆️ back to top](#api)**

#### `receiveError {Object}`

Set service in errored state. Records failure reason as a side effect.

```js
service.receiveError('Something went wrong');
service.get('didFetchData', false);
service.get('error', 'Something went wrong');
```

**[⬆️ back to top](#api)**

#### `normalizeKey {String}`

Normalizes keys. Defaults to camelCase.

```js
service.normalizeKey('new_profile_page'); // "newProfilePage"
```

**[⬆️ back to top](#api)**

#### `get {String}`

Fetches the feature flag. Use in conjunction with `isEnabled` or `isDisabled` on the feature flag.

```js
service.get('newProfilePage.isEnabled'); // true
service.get('newFriendList.isEnabled'); // true
service.get('oldProfilePage.isDisabled'); // true
```

**[⬆️ back to top](#api)**

#### `setupForTesting`

Sets the service in testing mode. This is useful when writing acceptance/integration tests in your application as you don't need to intercept the request to your API. When the service is in testing mode, all features are enabled.

```js
service.setupForTesting();
service.get('newFriendList.isEnabled'); // true
```

**[⬆️ back to top](#api)**

## Installation

* `git clone <repository-url>` this repository
* `cd ember-api-feature-flags`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
