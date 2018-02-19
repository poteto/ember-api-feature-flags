import $ from 'jquery';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | main');

test('it works', function(assert) {
  visit('/');

  andThen(() => assert.equal(currentURL(), '/'));
  andThen(() => assert.ok($('#secret-message').length), 'feature flag is enabled');
  andThen(() => assert.notOk($('#normal-message').length), 'feature flag is enabled');
});
