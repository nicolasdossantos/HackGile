import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/polyfills'

import './assets/layout.css'
import './assets/header.css'
import './assets/nav.css'
import './assets/demos.css'
import './assets/form.css'

import Demo from './index.vue'
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  components: { Demo },
  template: '<Demo/>',
  render: h => h(App)
}).$mount('#app')
