import Ember from 'ember';

const {
  Object: EmberObject,
  computed: { readOnly, not, bool },
  run: { bind },
  computed,
  assert,
  get,
  typeOf
} = Ember;

/**
 * A small object that represents a feature flag and its `type` and `value`.
 *
 * @public
 * @export
 */
export default EmberObject.extend({
  /**
   * A `FeatureFlag` that is a "relay" means that the object contains no data,
   * it is only a lightweight object that returns `isEnabled` with the default
   * value.
   *
   * @public
   * @property {Boolean}
   */
  isRelay: false,

  /**
   * Default value to return in `isEnabled` if the `FeatureFlag` is a relay.
   *
   * @public
   * @property {Any}
   */
  defaultValue: false,

  hasData: bool('data'),
  type: readOnly('data.key'),
  value: readOnly('data.value'),

  /**
   * Is the `FeatureFlag` enabled?
   *
   * @public
   * @readonly
   * @returns {Boolean}
   */
  isEnabled: computed('isRelay', 'type', 'value', function() {
    let isRelay = get(this, 'isRelay');
    let hasData = get(this, 'hasData');
    let defaultValue = get(this, 'defaultValue');

    if (isRelay || !hasData) {
      return defaultValue;
    }

    let handlers = get(this, 'handlers');
    let type = get(this, 'type');
    let value = get(this, 'value');
    let handler = get(handlers, type);
    assert(`[ember-api-feature-flags] No FeatureFlag handler for ${type}`, typeOf(handler) === 'function');
    return bind(this, handler)(value) || defaultValue;
  }).readOnly(),

  /**
   * Is the `FeatureFlag` disabled?
   *
   * @public
   * @readonly
   * @returns {Boolean}
   */
  isDisabled: not('isEnabled').readOnly(),

  handlers: {
    boolean(value) {
      if (typeOf(value) === 'string') {
        return value === 'true';
      }
      return !!value;
    }
  }
});
