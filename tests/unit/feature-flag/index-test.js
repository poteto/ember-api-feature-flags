import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';
import FeatureFlag from 'ember-api-feature-flags/feature-flag';
import { module, test } from 'qunit';

module('Unit | Utility | feature flag');

test('computed - #isEnabled - when no data', function(assert) {
  let featureFlag = FeatureFlag.create({ data: undefined });
  assert.notOk(featureFlag.get('isEnabled'), 'should be disabled');
});

test('computed - #isEnabled - when true', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: true } });
  assert.ok(featureFlag.get('isEnabled'), 'should be enabled');
});

test('computed - #isEnabled - when true as string', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: 'true' } });
  assert.ok(featureFlag.get('isEnabled'), 'should be enabled');
});

test('computed - #isEnabled - when false', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: false } });
  assert.notOk(featureFlag.get('isEnabled'), 'should be enabled');
});

test('computed - #isEnabled - when false as string', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: 'false' } });
  assert.notOk(featureFlag.get('isEnabled'), 'should be enabled');
});

test('computed - #isDisabled - when no data', function(assert) {
  let featureFlag = FeatureFlag.create({ data: undefined });
  assert.ok(featureFlag.get('isDisabled'), 'should be disabled');
});

test('computed - #isDisabled - when true', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: true } });
  assert.notOk(featureFlag.get('isDisabled'), 'should be disabled');
});

test('computed - #isDisabled - when true as string', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: 'true' } });
  assert.notOk(featureFlag.get('isDisabled'), 'should be disabled');
});

test('computed - #isDisabled - when false', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: false } });
  assert.ok(featureFlag.get('isDisabled'), 'should be disabled');
});

test('computed - #isDisabled - when false as string', function(assert) {
  let featureFlag = FeatureFlag.create({ data: { key: 'boolean', value: 'false' } });
  assert.ok(featureFlag.get('isDisabled'), 'should be disabled');
});

test('when deferred - should listen for `didFetchData`', function(assert) {
  let DummyService = EmberObject.extend(Evented, {
    do(eventName) { this.trigger(eventName); }
  });
  let service = DummyService.create({
    data: { foo: { key: 'boolean', value: 'true' } },
  });
  let featureFlag = FeatureFlag.create({
    isDeferred: true,
    __service__: service,
    __key__: 'foo',
    data: { key: 'boolean', value: 'false' }
  });
  assert.ok(featureFlag.get('isDisabled'), 'precondition - should be disabled');
  service.do('didFetchData');
  assert.ok(featureFlag.get('isEnabled'), 'should be enabled');
});
