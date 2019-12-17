import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import EditableCell from '../../src/index'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(EditableCell)

new Vue({
  render: h => h(App)
}).$mount('#app')
