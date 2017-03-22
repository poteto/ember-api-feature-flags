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
