<template>
  <b-container>
    <b-row>
      <b-col :md="6" :offset-md="3">
        <b-table
          bordered
          fixed
          small
          head-row-variant="secondary"
          :items="items"
          :fields="fields"
          class="mt-5"
          @row-clicked="editTd"
        ></b-table>
      </b-col>
    </b-row>

    <EditableCell
      v-if="focusedTd && focusedField.editable"
      :target="focusedTd"
      v-model="items[focusedRowIndex][focusedField.key]"
      :options="focusedField && focusedField.options"
      @drag="updateData"
    />
  </b-container>
</template>

<script>
import users from '../users.json'

export default {
  name: 'Table',

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
      items: users,

      fields: [
        { key: 'first_name', label: 'First name', variant: 'secondary' },
        { key: 'last_name', label: 'Last name', editable: true },
        { key: 'age', label: 'Age', editable: true },
        {
          key: 'month',
          label: 'Mois',
          options: this.months,
          editable: true,
          formatter: (value) => {
            const month = this.months.find(m => m.value === parseInt(value))
            return month ? month.label : ''
          }
        }
      ],

      focusedTd: null
    }
  },

  computed: {
    focusedField () {
      if (!this.focusedTd) return

      return this.fields[this.focusedTd.cellIndex]
    },

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
    editTd (_item, _idx, e) {
      if (e.target && e.target.tagName === 'TD') this.focusedTd = e.target
    },

    updateData (value, steps = 0) {
      const loopBounds = [this.focusedRowIndex, this.focusedRowIndex + steps].sort((a, b) => a > b)

      console.log(loopBounds)

      for (let rowIndex = loopBounds[0]; rowIndex <= loopBounds[1]; rowIndex++) {
        console.log(rowIndex)
        this.items[rowIndex][this.focusedField.key] = value
      }

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
