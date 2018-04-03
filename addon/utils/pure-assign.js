import { assign } from '@ember/polyfills';

// not really sure what this was doing - eslint reporting nas not used
// function _assign(origin, ...sources) {
//   return sources.reduce((acc, source) => merge(acc, source), merge({}, origin));
// }

export default function pureAssign() {
  return assign({}, ...arguments);
}
