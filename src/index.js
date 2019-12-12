import EditableCell from './components/EditableCell.vue'
import { focus } from 'vue-focus'
import VDragged from 'v-dragged'

const install = function (Vue) {
  Vue.use(VDragged)
  Vue.directive('focus', focus)
  Vue.component(EditableCell.name, EditableCell)
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}

EditableCell.install = install

if (GlobalVue) {
  GlobalVue.use({ EditableCell })
}

export default EditableCell
export { EditableCell }
