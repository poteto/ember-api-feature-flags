import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const { typeOf } = Ember;
const { keys } = Object;
const defaultOptions = {
  featureUrl: 'http://www.example.com/features',
  featureKey: 'feature_key',
  enabledKey: 'value',
  shouldMemoize: true,
  defaultValue: false
};
function isPromise(p) {
  return typeOf(p.then) === 'function'
    && typeOf(p.catch) === 'function';
}

moduleFor('service:feature-flags', 'Unit | Service | feature flags', {
});

test('#configure should set options on service', function(assert) {
  let service = this.subject();
  let options = {
    featureUrl: 'http://www.example.com/features',
    featureKey: 'key',
    enabledKey: 'value',
    shouldMemoize: true,
    defaultValue: false
  };
  service.configure(options);
  keys(options).forEach((k) => {
    assert.equal(service.get(k), options[k], 'should set option');
  });
});

test('#fetchFeatures', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .setupForTesting();
  assert.ok(isPromise(service.fetchFeatures()), 'should return promise');
});

test('#receiveData - when valid', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .receiveData([
      { 'feature_key': 'foo_bar', key: 'boolean', value: true }
    ]);
  assert.ok(service.get('didFetchData'));
  assert.ok(service.get('_data'), 'should set `_data`');
});

test('#receiveData - when invalid', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .receiveData([]);
  assert.notOk(service.get('didFetchData'));
  assert.equal(service.get('error'), 'Empty data received');
});

test('#receiveError', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .receiveError('it failed');
  assert.notOk(service.get('didFetchData'), 'should update `didFetchData`');
  assert.equal(service.get('error'), 'it failed', 'should set `error`');
});

test('computed - #data', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .receiveData([
      { 'feature_key': 'foo_bar', key: 'boolean', value: true }
    ]);
  assert.deepEqual(service.get('data'), { fooBar: { value: true } }, 'should normalize data');
});

test('#normalizeKey', function(assert) {
  let service = this.subject();
  service.configure(defaultOptions);
  assert.equal(service.normalizeKey('foo_bar'), 'fooBar', 'should be camel case');
});

test('#unknownProperty - when `didFetchData` is true', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .receiveData([
      { 'feature_key': 'foo_bar', key: 'boolean', value: true }
    ]);
  assert.ok(service.get('fooBar.isEnabled'), 'should proxy `get` correctly');
});

test('#unknownProperty - when `didFetchData` is false', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .receiveError('it failed');
  assert.notOk(service.get('meow.isEnabled'), 'should proxy `get` correctly');
});

test('#unknownProperty - when `isTesting` is true', function(assert) {
  let service = this.subject();
  service
    .configure(defaultOptions)
    .setupForTesting();
  assert.ok(service.get('anything.isEnabled'), 'should proxy `get` correctly');
});
