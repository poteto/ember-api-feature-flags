import pick from 'ember-api-feature-flags/utils/pick';
import { module, test } from 'qunit';

module('Unit | Utility | pick', function() {
  test('it picks key/value pairs off an object', function(assert) {
    let obj = { foo: '123', bar: '456', baz: '789' };
    assert.deepEqual(pick(obj, ['foo', 'baz']), { foo: '123', baz: '789' });
    assert.deepEqual(pick(obj, ['bar', 'baz']), { bar: '456', baz: '789' });
    assert.deepEqual(obj, { foo: '123', bar: '456', baz: '789' }, 'does not mutate object');
  });
});