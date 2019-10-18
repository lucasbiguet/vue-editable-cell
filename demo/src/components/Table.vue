<template>
  <div>
    <h4>Simple table</h4>
    <table class ref="table">
      <tr v-for="(row, rowId) in tableData" :key="rowId">
        <td
          v-for="(cell, cellId) in row"
          @click="editTd($event.currentTarget, cell)"
          :key="cellId"
        >
          <span>{{ cell.options ? cell.options[cell.value - 1] && cell.options[cell.value - 1].label : cell.value }}</span>
        </td>
      </tr>
    </table>

    <h4>With header</h4>

    <table class ref="table">
      <thead>
        <tr>
          <th rowspan="2">1</th>
          <th>2</th>
          <th>3</th>
        </tr>
        <tr>
          <th>2</th>
          <th>3</th>
        </tr>
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

    <h4>with multiple tBodies</h4>

    <table class ref="table">
      <thead>
        <tr>
          <th>1</th>
          <th>2</th>
          <th>3</th>
        </tr>
      </thead>
      <tbody style="border-bottom: 3px solid grey">
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
      <tbody style="border-bottom: 3px solid grey">
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

  computed: {
    focusedContainer () {
      if (this.focusedTd.closest('tbody')) return this.focusedTd.closest('tbody')
      if (this.focusedTd.closest('table')) return this.focusedTd.closest('table')

      return null
    },

    focusedRowIndex () {
      if (
        !this.focusedTd ||
        !this.focusedTd.closest('tr') ||
        !this.focusedContainer
      ) return null

      return Array.from(this.focusedContainer.rows).indexOf(this.focusedTd.closest('tr'))
    }
  },

  methods: {
    editTd (td, data) {
      this.focusedTd = td
      this.currentData = data
    },

    updateData (value) {
      this.tableData[this.focusedRowIndex][this.focusedTd.cellIndex].value = value
      this.focusedTd = null
      this.currentData = null
    },

    applyValueToAdjacentRows (steps) {
      if (!steps) return

      let i = this.focusedRowIndex
      let condition = () => {
        return steps < 0
          ? i >= this.focusedRowIndex + steps
          : i <= this.focusedRowIndex + steps
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
