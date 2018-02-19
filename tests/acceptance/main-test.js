import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | main', function(hooks) {
  setupApplicationTest(hooks);

  test('it works', async function(assert) {
    await visit('/');
    assert.ok(true);
  });
});