<template>
  <div
    class="wrapper"
    :style="wrapperStyle"
    v-if="target"
    v-on="$listeners"
    @dblclick="editing = true"
    @keyup.esc="editing = false"
  >
    <div class="handle" v-if="!editing" v-show="!dragging" @click.stop v-dragged="$_onDragged" :style="handleStyle"></div>

    <div class="select-box" :style="selectBoxStyle" v-if="dragging"></div>

    <select v-if="editing && Array.isArray(options)" :value="value" @change="$emit('update', $event.target.value)">
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
    },

    size: {
      type: Number,
      default: 2
    },

    color: {
      type: String,
      default: 'darkblue'
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

    targetBounds () {
      return this.target.getBoundingClientRect()
    },

    wrapperStyle () {
      return {
        border: `${this.size}px solid ${this.color}`,
        width: `${this.targetBounds.width}px`,
        height: `${this.targetBounds.height}px`,
        top: `${window.scrollY + this.targetBounds.top}px`,
        left: `${window.scrollX + this.targetBounds.left}px`
      }
    },

    inputStyle () {
      return {
        width: `${this.targetBounds.width - 2 * this.size}px`,
        height: `${this.targetBounds.height - 2 * this.size}px`
      }
    },

    selectBoxStyle () {
      if (this.dragOffset === null) return

      return {
        border: `${this.size / 2 > 0 ? this.size / 2 : 1}px solid ${this.color}`,
        width: `${this.targetBounds.width}px`,
        height: `${this.targetBounds.height + (this.targetBounds.height * this.dragSteps)}px`,
        top: this.dragOffset <= 0
          ? `-${this.size + (this.targetBounds.height * this.dragSteps)}px`
          : `-${this.size}px`,
        left: `-${this.size}px`
      }
    },

    handleStyle () {
      return {
        'background-color': this.color,
        width: `${7 + this.size}px`,
        height: `${7 + this.size}px`,
        right: `-${3 + this.size}px`,
        bottom: `-${3 + this.size}px`
      }
    },

    dragSteps () {
      if (this.dragOffset === null) return 0

      const steps =
        (this.dragOffset <= 0 ? 0 : 1) +
        parseInt(Math.abs(this.dragOffset) / this.target.offsetHeight, 10)

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
  border: 1px solid white;
  position: absolute;
  cursor: crosshair;
}

.wrapper .select-box {
  position: absolute;
}
</style>
