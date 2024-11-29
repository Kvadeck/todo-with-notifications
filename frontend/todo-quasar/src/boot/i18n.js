import { boot } from 'quasar/wrappers';
import i18n from '../plugins/i18n';

export default boot(({ app }) => {
  app.use(i18n);
  app.config.globalProperties.$t = i18n.global.t;
});
