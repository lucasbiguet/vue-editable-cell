# vue-editable-cell

![demo](./public/demo.gif)

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

**The table rows must be of equal heights !**

``` js
<EditableCell
  :target="focusedTd"
  :value="editableValue"
  :options="selectOptions"
  @change="updateData"
  @drag="applyValueToAdjacentRows"
/>
```

TODO list and explain props

## Improvements

This package is in very early stage of development, features are missing:

- Drag n drop horizontally
- Style customisation via props
- Write tests
- Improve documentation
- Handle rows / col sizes dynamically
