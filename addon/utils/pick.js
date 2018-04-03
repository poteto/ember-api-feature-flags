import { get } from '@ember/object';
import { isNone } from '@ember/utils';

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
