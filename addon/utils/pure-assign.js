import { assign } from '@ember/polyfills';

export default function pureAssign() {
  return assign({}, ...arguments);
}
