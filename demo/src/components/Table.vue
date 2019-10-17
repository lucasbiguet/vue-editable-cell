<template>
  <div>
    <table class ref="table">
      <thead>
        <th>1</th>
        <th>2</th>
        <th>3</th>
      </thead>
      <tbody>
        <tr v-for="(row, rowId) in tableData" :key="rowId">
          <td
            v-for="(cell, cellId) in row"
            @click="editTd($event.currentTarget, cell)"
            :key="cellId"
          >
            <span>{{ cell.options ? cell.options[cell.value - 1] && cell.options[cell.value - 1].label : cell.value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <EditableCell
      v-if="currentData"
      :target="focusedTd"
      :value="currentData.value"
      :options="currentData.options"
      @change="updateData"
      @drag="applyValueToAdjacentRows"
    />
  </div>
</template>

<script>
import EditableCell from '../../../src/components/EditableCell'

export default {
  name: 'Table',

  components: { EditableCell },

  props: {
    months: {
      type: Array,
      default: () => [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
    }
  },

  data () {
    return {
      tableData: [
        [{ value: null }, { value: 10 }, { value: 2, options: this.months }],
        [{ value: 0 }, { value: undefined }, { value: 3, options: this.months }],
        [{ value: 0 }, { value: 10 }, { value: 1, options: this.months }],
        [{ value: null }, { value: 10 }, { value: null, options: this.months }],
        [{ value: 0 }, { value: undefined }, { value: 4, options: this.months }],
        [{ value: 0 }, { value: 10 }, { value: 4, options: this.months }]
      ],

      focusedTd: null,
      currentData: null
    }
  },

  methods: {
    editTd (td, data) {
      this.focusedTd = td
      this.currentData = data
    },

    updateData (value) {
      this.tableData[this.focusedTd.parentElement.rowIndex][this.focusedTd.cellIndex].value = value
      this.focusedTd = null
      this.currentData = null
    },

    applyValueToAdjacentRows (steps) {
      if (!steps) return

      let i = this.focusedTd.parentElement.rowIndex
      let condition = () => {
        return steps < 0
          ? i >= this.focusedTd.parentElement.rowIndex + steps
          : i <= this.focusedTd.parentElement.rowIndex + steps
      }

      while (condition()) {
        this.tableData[i][this.focusedTd.cellIndex].value = this.currentData.value

        steps < 0 ? i-- : i++
      }

      this.focusedTd = null
      this.currentData = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  width: 80px;
  border: none;
  padding: 0.2rem 0.5rem;
}

table {
  border-collapse: collapse;
}

table th, table td{
  border: 1px solid lightgray;
  padding: 0;
  min-width: 100px;
}
</style>
