import Ember from 'ember';

const { get, isNone } = Ember;

/**
 * Pick specific key/value pairs off an object. Returns new array.
 *
 * @export
 * @param {Object} obj
 * @param {Array<string>} [attributes=[]]
 * @returns {Object}
 */
export default function pick(obj, attributes = []) {
  return attributes.reduce((acc, attr) => {
    let value = get(obj, attr);
    if (!isNone(value)) {
      acc[attr] = value;
    }
    return acc;
  }, {});
}
