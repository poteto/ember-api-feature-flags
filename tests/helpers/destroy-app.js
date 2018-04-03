import { run } from '@ember/runloop';

export default function destroyApp(application) {
  application.pretenderInstance.shutdown();
  run(application, 'destroy');
}
