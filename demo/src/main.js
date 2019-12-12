import Vue from 'vue'
import App from './App.vue'
import EditableCell from '../../src/index'

Vue.config.productionTip = false

Vue.use(EditableCell)

new Vue({
  render: h => h(App)
}).$mount('#app')
