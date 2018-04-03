import { bool, not, readOnly } from '@ember/object/computed';
import EmberObject, {
  setProperties,
  get,
  computed
} from '@ember/object';
import { typeOf, isPresent } from '@ember/utils';

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
  value: readOnly('data.value'),

  init() {
    this._super(...arguments);
    this.__listenForData__();
  },

  /**
   * When service is deferred, listen for the trigger so that we can get the
   * updated data from the service.
   *
   * @private
   * @returns {Void}
   */
  __listenForData__() {
    let service = get(this, '__service__');
    if (service === undefined) {
      return;
    }
    let featureFlag = this;
    service.on('didFetchData', function() {
      let service = this;
      let key = get(featureFlag, '__key__');
      let data = get(service, `data.${key}`);
      setProperties(featureFlag, {
        data,
        isRelay: false
      });
    });
  },

  /**
   * Is the `FeatureFlag` enabled?
   *
   * @public
   * @readonly
   * @returns {Boolean}
   */
  isEnabled: computed('isRelay', 'hasData', 'value', 'defaultValue', function() {
    let isRelay = get(this, 'isRelay');
    let hasData = get(this, 'hasData');
    let defaultValue = get(this, 'defaultValue');
    if (isRelay || !hasData) {
      return defaultValue;
    }
    let value = this._normalize(get(this, 'value'));
    return isPresent(value) ? value : defaultValue;
  }).readOnly(),

  /**
   * Is the `FeatureFlag` disabled?
   *
   * @public
   * @readonly
   * @returns {Boolean}
   */
  isDisabled: not('isEnabled').readOnly(),

  _normalize(value) {
    if (typeOf(value) === 'string') {
      return value === 'true';
    }
    return !!value;
  }
});
