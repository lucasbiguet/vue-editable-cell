import EditableCell from './components/EditableCell'

const install = function (Vue) {
  Vue.component(EditableCell.name, EditableCell)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.EditableCell = EditableCell
  window.Vue.use(EditableCell)
}

EditableCell.install = install

export default EditableCell
export { EditableCell }
