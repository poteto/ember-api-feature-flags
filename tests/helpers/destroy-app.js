import Ember from 'ember';

export default function destroyApp(application) {
  application.pretenderInstance.shutdown();
  Ember.run(application, 'destroy');
}
