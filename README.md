# vue-editable-cell

## [Demo](https://vue-editable-cell.netlify.com/)

To run it locally clone this repo and:

``` bash
cd demo
yarn
yarn serve
```

## Install

``` bash
yarn add @lucasbiguet/vue-editable-cell
```

Then import the component as a plugin:

``` js
import EditableCell from 'vue-editable-cell'

Vue.use(EditableCell)
```

## Usage

The components works on any regular table and requires a TD element as target

Call the component just below the table and wrap both the table and the component **in a div positioned relatively**

**The table rows must be of equal heights** for the drag n drop box size to be calculated as expected

``` html
<div style="position: relative;">
  <table>
    <tr>
      <td></td>
      <!-- ... -->
    </tr>
  </table>

  <EditableCell
    :target="focusedTd"
    v-model="editableValue"
    :options="selectOptions"
    @drag="applyValueToAdjacentRows"
  />
</div>
```

## API

### Props

| Name    | Type                 | Required | Description                                                                                            |
|---------|----------------------|----------|--------------------------------------------------------------------------------------------------------|
| target  | `HTMLTableCellElement` | true     | The `<td>` element to target                                                                             |
| value   | `[Number, String]`     | false    | The value to bind to the input or select while in edit mode                                            |
| options | `Array`                | false    | Options for the select; when set, the component will display a select instead of an input in edit mode. Must be an array of objects with label/value keys ie `[{ label: 'January', value: '01' }, {...}]` |

### Events

| Name   |  Payload arguments   | Description                                       |
|--------|----------------------|---------------------------------------------------|
| drag   | value, dragOffset | Triggers when drag n' drop ends                   |
| update | value              | Triggers when value is updated in input or select |

### Methods

| Name                   | Description                       |
|------------------------|-----------------------------------|
| toggleEdition(editing) | Programatically trigger edit mode |

## Improvements

This package is in very early stage of development, features are missing, things will break unexpectedly, be prepared for an adventure!

- Drag n drop horizontally
- Write tests
- Improve documentation
- Handle rows / col sizes dynamically
