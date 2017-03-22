import Ember from 'ember';
import config from '../config/environment';

const {
  assign,
  assert,
  isNone,
  isPresent
} = Ember;
const FEATURE_FLAG_DEFAULTS = {
  /**
   * Feature API endpoint.
   */
  featureUrl: undefined,
  /**
   * Feature key name on the response object.
   *
   * @public
   * @property {String}
   */
  featureKey: 'feature_key',

  /**
   * Attributes to pass to individual FeatureFlag objects.
   *
   * @public
   * @property {Array<string>}
   */
  attributes: ['id', 'key', 'value'],

  /**
   * If true, will cache FeatureFlag objects.
   *
   * @public
   * @property {Boolean}
   */
  shouldMemoize: true
};

export function initialize(application) {
  application.deferReadiness();
  let { 'ember-api-feature-flags': featureFlagsConfig } = config;
  let options = assign({}, FEATURE_FLAG_DEFAULTS, featureFlagsConfig);
  assert(`[ember-api-feature-flags] No feature URL found, please set one`, isPresent(options.featureUrl));
  let featureFlagService = application.__container__.lookup('service:feature-flags');
  if (isNone(featureFlagService)) {
    return;
  }
  featureFlagService
    .configure(options)
    .fetchFeatures()
    .then((data) => featureFlagService.receiveData(data))
    .catch((reason) => featureFlagService.receiveError(reason))
    .finally(() => application.advanceReadiness());
}

export default {
  name: 'feature-flags',
  initialize
};
