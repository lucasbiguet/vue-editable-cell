<template>
  <div
    class="wrapper"
    :style="wrapperStyle"
    v-if="target"
    v-on="$listeners"
    @dblclick="editing = true"
    @change="editing = false"
    @keyup.esc="editing = false"
  >
    <div class="handle" v-if="!editing" @click.stop v-dragged="onDragged" :style="{ 'background-color': focusColor }"></div>

    <div class="select-box" :style="selectBoxStyle" v-if="dragOffset !== null"></div>

    <select ref="select" v-if="editing && Array.isArray(options)" :value="value" @change="$emit('update', $event.target.value)">
      <option v-for="(option, i) in options" :value="option.value" :key="i">{{ option.label }}</option>
    </select>

    <input
      ref="input"
      type="text"
      v-else-if="editing"
      :value="value"
      :style="inputStyle"
      @input="$emit('update', $event.target.value)"
      @keypress.enter="editing = false"
      @keypress.tab="editing = false"
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
      default: null
    },

    value: {
      type: [Number, String],
      default: ''
    },

    options: {
      type: Array,
      default: undefined
    },

    borderSize: {
      type: Number,
      default: 2
    },

    focusColor: {
      type: String,
      default: 'darkblue'
    },

    dragColor: {
      type: String,
      default: 'firebrick'
    }
  },

  data () {
    return {
      dragOffset: null,
      editing: false
    }
  },

  computed: {
    targetBounds () {
      if (!this.target) return {}

      return this.target.getBoundingClientRect()
    },

    wrapperStyle () {
      if (!this.target) return

      return {
        border: `${this.borderSize}px solid ${this.focusColor}`,
        width: `${this.targetBounds.width}px`,
        height: `${this.targetBounds.height}px`,
        top: `${window.scrollY + this.targetBounds.top}px`,
        left: `${window.scrollX + this.targetBounds.left}px`
      }
    },

    inputStyle () {
      if (!this.target) return

      return {
        width: `${this.targetBounds.width - 2 * this.borderSize}px`,
        height: `${this.targetBounds.height - 2 * this.borderSize}px`
      }
    },

    selectBoxStyle () {
      if (!this.target || this.dragOffset === null) return

      return {
        border: `${this.borderSize}px solid ${this.dragColor}`,
        width: `${this.targetBounds.width}px`,
        height: `${this.targetBounds.height + (this.targetBounds.height * this.dragSteps)}px`,
        top: this.dragOffset <= 0
          ? `-${this.borderSize + (this.targetBounds.height * this.dragSteps)}px`
          : `-${this.borderSize}px`,
        left: `-${this.borderSize}px`
      }
    },

    dragSteps () {
      if (!this.target || this.dragOffset === null) return 0

      const steps =
        (this.dragOffset <= 0 ? 0 : 1) +
        parseInt(Math.abs(this.dragOffset) / this.target.offsetHeight, 10)

      return steps > this.maxDragSteps ? this.maxDragSteps : steps
    },

    rowIndex () {
      if (
        !this.target ||
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
      if (!this.target || !this.targetContainer) { return 0 }

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
    target () { this.editing = false },

    editing (editing) {
      if (!editing) return

      this.$nextTick(() => {
        const input = this.options ? this.$refs.select : this.$refs.input
        input.focus()
      })
    }
  },

  methods: {
    onDragged (e) {
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

    cancelOnClickOutside (e) {
      if (!this.$el.contains(e.target)) {
        this.editing = false
      }
    }
  },

  mounted () {
    document.addEventListener('click', this.cancelOnClickOutside)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.cancelOnClickOutside)
  }
}
</script>

<style scoped>
.wrapper {
  display: block;
  position: absolute;
  user-select: none;
}

.wrapper select {
  width: 100%;
  height: 100%;
  border: none;
  position: relative;
}

.wrapper input {
  resize: none;
  margin: 0;
  border: none;
}

.wrapper .handle {
  width: 6px;
  height: 6px;
  border: 0;
  position: absolute;
  right: -1px;
  bottom: -1px;
  cursor: crosshair;
}

.wrapper .select-box {
  position: absolute;
}
</style>
