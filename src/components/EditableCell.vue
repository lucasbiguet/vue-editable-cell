<template>
  <div
    class="vue-editable-cell__wrapper"
    :style="wrapperStyle"
    v-if="target"
    v-on="$listeners"
    @dblclick="editing = true"
    @keyup.esc="editing = false"
  >
    <div class="vue-editable-cell__handle" v-if="!editing" v-show="!dragging" @click.stop v-dragged="$_onDragged"></div>

    <div class="vue-editable-cell__drag-box" :style="dragBoxStyle" v-if="dragging"></div>

    <select class="vue-editable-cell__select" v-if="editing && Array.isArray(options)" :value="value" @change="$emit('update', $event.target.value)">
      <option v-for="(option, i) in options" :value="option.value" :key="i">{{ option.label }}</option>
    </select>

    <input
      class="vue-editable-cell__input"
      ref="input"
      type="text"
      v-else-if="editing"
      :value="value"
      :style="inputStyle"
      @input="$emit('update', $event.target.value)"
      @keypress.enter="editing = false"
      @keydown.tab="editing = false"
    >
  </div>
</template>

<script>

export default {
  model: {
    prop: 'value',
    event: 'update'
  },

  name: 'EditableCell',

  props: {
    target: {
      type: HTMLTableCellElement,
      required: true
    },

    value: {
      type: [Number, String],
      default: ''
    },

    options: {
      type: Array,
      default: undefined
    }
  },

  data () {
    return {
      dragOffset: null,
      editing: false
    }
  },

  computed: {
    dragging () { return this.dragOffset !== null },
    targetWidth () { return this.target.getBoundingClientRect().width },
    targetHeight () { return this.target.getBoundingClientRect().height },

    wrapperStyle () {
      return {
        width: `${this.targetWidth}px`,
        height: `${this.targetHeight}px`,
        top: `${this.target.offsetTop + this.target.offsetParent.offsetTop}px`,
        left: `${this.target.offsetLeft + this.target.offsetParent.offsetLeft}px`
      }
    },

    inputStyle () {
      return {
        width: `${this.targetWidth - 4}px`,
        height: `${this.targetHeight - 4}px`
      }
    },

    dragBoxStyle () {
      if (this.dragOffset === null) return

      return {
        width: `${this.targetWidth}px`,
        height: `${this.targetHeight + (this.targetHeight * this.dragSteps)}px`,
        top: this.dragOffset <= 0 ? `-${2 + (this.targetHeight * this.dragSteps)}px` : '-2px',
        left: '-2px'
      }
    },

    dragSteps () {
      if (this.dragOffset === null) return 0

      const steps =
        (this.dragOffset <= 0 ? 0 : 1) +
        parseInt(Math.abs(this.dragOffset) / this.targetHeight, 10)

      return steps > this.maxDragSteps ? this.maxDragSteps : steps
    },

    rowIndex () {
      if (
        !this.target.closest('tr') ||
        !this.targetContainer
      ) return null

      return Array.from(this.targetContainer.rows).indexOf(this.target.closest('tr'))
    },

    targetContainer () {
      if (this.target.closest('tbody')) return this.target.closest('tbody')
      if (this.target.closest('table')) return this.target.closest('table')

      return null
    },

    rowsCount () {
      if (!this.targetContainer) { return 0 }

      return this.targetContainer.rows.length
    },

    maxDragSteps () {
      if (
        !this.dragOffset ||
        this.rowIndex === null ||
        !this.rowsCount
      ) { return 0 }

      return this.dragOffset < 0
        ? this.rowIndex
        : this.rowsCount - (1 + this.rowIndex)
    }
  },

  watch: {
    editing (editing) {
      if (!editing) return

      this.$nextTick(() => {
        if (this.options) return

        this.$refs.input.focus()
        this.$refs.input.select()
      })
    }
  },

  methods: {
    toggleEdition (editing) { this.editing = editing },

    $_onDragged (e) {
      if (e.first) {
        this.dragOffset = 0
      } else if (e.last) {
        this.$emit(
          'drag',
          this.value,
          this.dragOffset < 0 ? 0 - this.dragSteps : this.dragSteps
        )
        this.dragOffset = null
      } else {
        this.dragOffset = e.offsetY
      }
    },

    $_cancelOnClickOutside (e) {
      if (!this.$el.contains(e.target)) {
        this.editing = false
      }
    }
  },

  mounted () {
    document.addEventListener('click', this.$_cancelOnClickOutside)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.$_cancelOnClickOutside)
  }
}
</script>

<style>
.vue-editable-cell__wrapper {
  display: block;
  position: absolute;
  user-select: none;
  border: 2px solid darkblue;
}

.vue-editable-cell__select {
  width: 100%;
  height: 100%;
  border: none;
  position: relative;
}

.vue-editable-cell__input {
  resize: none;
  margin: 0;
  border: none;
}

.vue-editable-cell__handle {
  border: 1px solid white;
  background-color: darkblue;
  position: absolute;
  cursor: crosshair;
  width: 9px;
  height: 9px;
  right: -5px;
  bottom: -5px;
}

.vue-editable-cell__drag-box {
  position: absolute;
  border: 1px solid darkblue;
}
</style>
