<template>
  <div
    class="wrapper"
    :style="wrapperStyle"
    v-if="target"
    v-on="$listeners"
    @click="editing = true"
    @keyup.esc="cancel"
  >
    <div class="handle" v-if="!editing" @click.stop v-dragged="onDragged"></div>

    <div class="select-box" :style="selectBoxStyle_" v-if="dragOffset !== null"></div>

    <select v-if="editing && Array.isArray(options)" v-model="value_" @change.stop="submit(value_)">
      <option v-for="(option, i) in options" :value="option.value" :key="i">{{ option.label }}</option>
    </select>

    <textarea
      v-else-if="editing"
      v-model="value_"
      :style="textareaStyle"
      @keypress.enter="submit(value_)"
      @keypress.tab="submit(value_)"
      v-focus="true"
    ></textarea>
  </div>
</template>

<script>

export default {
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

    selectBoxStyle: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      dragOffset: null,
      value_: '',
      editing: false
    }
  },

  computed: {
    wrapperStyle () {
      if (!this.target) return

      return {
        width: this.valueToPixels(this.target.offsetWidth - 1),
        height: this.valueToPixels(this.target.offsetHeight - 1),
        top: this.valueToPixels(
          window.scrollY + this.target.getBoundingClientRect().top - 1
        ),
        left: this.valueToPixels(
          window.scrollX + this.target.getBoundingClientRect().left - 1
        )
      }
    },

    textareaStyle () {
      if (!this.target) return

      return {
        width: this.valueToPixels(this.target.offsetWidth - 1),
        height: this.valueToPixels(this.target.offsetHeight - 1)
      }
    },

    selectBoxStyle_ () {
      if (!this.target || this.dragOffset === null) return

      return {
        border: '1px solid red',
        ...this.selectBoxStyle,

        width: this.textareaStyle.width,
        height: this.valueToPixels(
          this.target.offsetHeight * (1 + this.dragSteps) - 1
        ),
        top: this.valueToPixels(
          this.dragOffset <= 0
            ? (0 - this.target.offsetHeight) * this.dragSteps - 1
            : (0 - 1)
        ),
        left: this.valueToPixels(0 - 1)
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
    value: {
      immediate: true,
      handler (value) {
        this.value_ = value
      }
    },

    target () {
      this.editing = false
    }
  },

  methods: {
    valueToPixels: value => `${value}px`,

    submit (value) {
      this.$emit('change', value)
      this.editing = false
    },

    onDragged (e) {
      if (e.first) {
        this.dragOffset = 0
      } else if (e.last) {
        this.$emit(
          'drag',
          this.value_,
          this.dragOffset < 0 ? 0 - this.dragSteps : this.dragSteps
        )
        this.dragOffset = null
      } else {
        this.dragOffset = e.offsetY
      }
    },

    cancel () {
      this.value_ = this.value
      this.editing = false
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: block;
  position: absolute;
  user-select: none;
  border: 1px solid grey;
}

.wrapper select {
  width: 100%;
  height: 100%;
  border: none;
  top: -1px;
  position: relative;
}

.wrapper textarea {
  resize: none;
  margin: 0;
  padding: 0;
  border: none;
}

.wrapper .handle {
  width: 6px;
  height: 6px;
  background-color: grey;
  border: 0;
  position: absolute;
  right: -1px;
  bottom: -1px;
  cursor: crosshair;
}

.wrapper .select-box {
  border: 1px solid red;
  position: absolute;
}
</style>
