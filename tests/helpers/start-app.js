import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import Pretender from 'pretender';
import Application from '../../app';
import config from '../../config/environment';
import sendResponse from './send-response';

const { 'ember-api-feature-flags': options } = config;
const { featureUrl } = options;

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.pretenderInstance = new Pretender(function() {
      this.get(featureUrl, function() {
        let response = [
          {
            "id": 1,
            "key": "secret_message",
            "value": "true",
            "created_at": "2017-03-22T03:30:10.270Z",
            "updated_at": "2017-03-22T03:30:10.270Z"
          }
        ];
        return sendResponse(response);
      })
    });
    application.setupForTesting();
    application.injectTestHelpers();

    return application;
  });
}
