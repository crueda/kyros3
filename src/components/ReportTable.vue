<template>
  <div class="main" :style="wrapperStyle">
    <div class="main__table--nav">
      <download-excel
        v-if="withExcel"
        class="main__btn-excel"
        :data="excelData"
        :fields="excelFields"
        :meta="json_meta"
        worksheet="My Worksheet"
        name="sigp.xls"
      >
        <img v-bind:src="urlImgExcel" width="18px" />
      </download-excel>

      <div v-show="dataFil.length > 0" class="main__table--nav-text">
        Mostrando {{ navTableElementInit }} a {{ navTableElementEnd }} de
        {{ dataFil.length }} entradas
      </div>

      <input
        type="text"
        v-show="withFilter && dataFil.length > 0"
        v-model="search"
        id="filter-text"
        placeholder="Buscar..."
        class="form-control filter__input form-control-sm main__table--bar--search"
      />
      <div v-show="dataFil.length > 0" class="main__table--nav-btns">
        <div class="main__table--bar">
          Filas:&nbsp;<input
            type="number"
            v-model.number="entries"
            id="maxrows-text"
            placeholder=""
            class="form-control filter__input form-control-sm main__table--bar--rows"
          />
        </div>
        <img
          class="main__table--nav-btn-first"
          v-bind:src="urlImgBtnPrev2"
          @click="prev2"
        />
        <img
          class="main__table--nav-btn"
          v-bind:src="urlImgBtnPrev1"
          @click="prev1"
        />
        <img
          class="main__table--nav-btn"
          v-bind:src="urlImgBtnNext1"
          @click="next1"
        />
        <img
          class="main__table--nav-btn"
          v-bind:src="urlImgBtnNext2"
          @click="next2"
        />
      </div>
    </div>
    <div class="report-table" :style="{ 'max-height': maxHeight }">
      <table>
        <thead>
          <tr>
            <th
              v-for="el in columns"
              :key="el.field"
              class="main__table--header"
              :class="el.class"
              @click="orderColumn(el.field, el.type, el.sorting)"
            >
              {{ el.label }}&nbsp;<span
                v-if="
                  elementOrder == el.field && orderAsc[elementOrder] === true
                "
                ><i class="fas fa-sort-down"></i></span
              ><span
                v-if="
                  elementOrder == el.field && orderAsc[elementOrder] === false
                "
                ><i class="fas fa-sort-down"></i
              ></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, key) in pages[activePage]" :key="key">
            <td
              class="main__table--cell"
              @click="cellClick(cell)"
              v-for="(cell, key) in row"
              :class="cell.class"
              :style="cell.style"
              :key="key"
            >
              <span
                v-if="cell.tooltip"
                class="simptip-position-top"
                :data-tooltip="cell.tooltipText"
                >{{ cell.text }}</span
              >
              <span v-if="cell.btn" class="cell__btn">
                <va-button :color="cell.color" class="my-0"
                  >{{ cell.text }}
                </va-button></span>
              <span v-if="cell.img"
                ><img :src="cell.text" :width="cell.width" :height="cell.height"
              /></span>
              <span v-if="!cell.img && !cell.btn" >{{ cell.text }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-show="dataFil.length === 0" class="main__nodata">
        Sin datos
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)

export default {
  name: 'ReportTable',
  props: {
    columns: Array,
    rows: Array,
    maxWidth: {
      type: String,
    },
    withFilter: {
      type: Boolean,
      default: () => false,
    },
    withExcel: {
      type: Boolean,
      default: () => false,
    },
    excelFields: {
      type: Object,
      default: () => {},
    },
    excelData: {
      type: Array,
      default: () => [],
    },
    maxHeight: {
      type: String,
    },
    title: String,
  },
  components: {},
  data() {
    return {
      pages: [],
      dataFil: [],
      entries: 25,
      pagination: true,
      activePage: 0,
      navTableElementInit: 0,
      navTableElementEnd: 0,
      urlImgExcel: 'https://sigp.elecnor-deimos.com/images/excel.svg',
      urlImgBtnPrev1: 'https://sigp.elecnor-deimos.com/images/prev1.svg',
      urlImgBtnPrev2: 'https://sigp.elecnor-deimos.com/images/prev2.svg',
      urlImgBtnNext1: 'https://sigp.elecnor-deimos.com/images/next1.svg',
      urlImgBtnNext2: 'https://sigp.elecnor-deimos.com/images/next2.svg',
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8',
          },
        ],
      ],
      search: '',
      orderAsc: {},
      elementOrder: '',
      wrapperStyle: {
        maxWidth: this.maxWidth ? this.maxWidth : '100%',
        margin: '0 auto',
      },
      filterOptions: [],
    }
  },
  computed: {
    rowsDisplay() {
      let arrRows = []
      let headers = this.columns.map(col => col.field)
      this.rows.map(row => {
        let newRow = []
        headers.forEach(header => {
          let content = row[header] || this.defaultRow
          newRow.push(content)
        })
        arrRows.push(newRow)
      })
      this.dataFil = arrRows
      return arrRows
    },
  },
  mounted() {
    const pagesAmount = Math.ceil(this.dataFil.length / this.entries)
    this.pages = []
    if (this.pagination) {
      for (let i = 1; i <= pagesAmount; i++) {
        const pageEndIndex = i * this.entries
        this.pages.push(
          this.dataFil.slice(pageEndIndex - this.entries, pageEndIndex)
        )
      }
    } else {
      this.pages.push(this.dataFil)
    }
    this.activePage = 0
    this.navTableElementInit = 1
    if (this.pages[0] !== undefined) {
      this.navTableElementEnd = this.pages[0].length
    }
    this.$emit('pages', this.pages)
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].type === 'num') {
        this.filterOptions.push({
          key: this.columns[i].field,
          type: 'num',
          value: this.columns[i].label,
        })
      } else if (this.columns[i].type === 'enumerated') {
        this.filterOptions.push({
          key: this.columns[i].field,
          type: 'enumerated',
          enumvalues: this.columns[i].values,
          value: this.columns[i].label,
        })
      }
    }
  },
  watch: {
    columns(newVal) {
      this.columns = newVal
      var newfilters = []
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].type === 'num') {
          newfilters.push({
            key: this.columns[i].field,
            type: 'num',
            value: this.columns[i].label,
          })
        } else if (this.columns[i].type === 'enumerated') {
          newfilters.push({
            key: this.columns[i].field,
            type: 'enumerated',
            enumvalues: this.columns[i].values,
            value: this.columns[i].label,
          })
        }
      }
      this.filterOptions = newfilters
    },
    rowsDisplay() {
      this.dataFil = this.rowsDisplay
      this.search = this.search
      this.paginate()
    },
    dataFil() {
      this.paginate()
    },
    entries: function(val) {
      if (val === '' || val < 0) {
        this.entries = 1
        return
      }
      const pagesAmount = Math.ceil(this.dataFil.length / this.entries)
      this.pages = []
      if (this.pagination) {
        for (let i = 1; i <= pagesAmount; i++) {
          const pageEndIndex = i * this.entries
          this.pages.push(
            this.dataFil.slice(pageEndIndex - this.entries, pageEndIndex)
          )
        }
      } else {
        this.pages.push(this.dataFil)
      }
      this.activePage = 0
      this.prev2()
      this.$emit('pages', this.pages)
    },
    search: function() {
      var fieldsToSearch = []
      for (let i = 0; i < this.columns.length; i++) {
        var col = this.columns[i]
        if (col.search) {
          fieldsToSearch.push(i)
        }
      }
      var a = []
      for (let i = 0; i < this.rowsDisplay.length; i++) {
        var item = this.rowsDisplay[i]
        for (let j = 0; j < fieldsToSearch.length; j++) {
          var field = item[fieldsToSearch[j]].text.toString().toLowerCase()
          if (field.indexOf(this.search.toLowerCase()) > -1) {
            a.push(item)
            break
          }
        }
      }
      this.dataFil = a.slice()
      this.elementOrder = ''
      this.prev2()
    },
  },
  methods: {
    paginate() {
      // do the split on every change in rows (searching)
      const pagesAmount = Math.ceil(this.dataFil.length / this.entries)
      this.pages = []
      if (this.pagination) {
        for (let i = 1; i <= pagesAmount; i++) {
          const pageEndIndex = i * this.entries
          this.pages.push(
            this.dataFil.slice(pageEndIndex - this.entries, pageEndIndex)
          )
        }
      } else {
        this.pages.push(this.dataFil)
      }
      this.navTableElementInit = 1
      if (this.pages[0] !== undefined) {
        this.navTableElementEnd = this.pages[0].length
      }

      this.$emit('pages', this.pages)
    },
    orderColumn(field, type, sort) {
      if (sort) {
        this.elementOrder = field
        this.orderAsc[field] = !this.orderAsc[field]
        let order = ''
        if (this.orderAsc[field]) {
          order = '-'
        }
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field === field) {
            if (type === 'text') {
              this.dataFil.sort(this.dynamicSortStr(order + i))
            } else if (type === 'time') {
              this.dataFil.sort(this.dynamicSortTime(order + i))
            } else {
              this.dataFil.sort(this.dynamicSort(order + i))
            }
          }
        }
        this.prev2()
      }
    },
    filterChanged(filter) {
      if (filter.enabled && filter.value !== '') {
        this.dataFil.splice(0, this.dataFil.length)
        for (let i = 0; i < this.rowsDisplay.length; i++) {
          let el = this.rowsDisplay[i]
          if (filter.direction === '>') {
            if (
              el[this.columns.map(e => e.field).indexOf(filter.option)].text >
              filter.value
            ) {
              this.dataFil.push(el)
            }
          } else if (filter.direction === '=') {
            if (
              el[this.columns.map(e => e.field).indexOf(filter.option)].text ===
              filter.value
            ) {
              this.dataFil.push(el)
            }
          } else if (filter.direction === '<') {
            if (
              el[this.columns.map(e => e.field).indexOf(filter.option)].text <
              filter.value
            ) {
              this.dataFil.push(el)
            }
          }
        }
      } else {
        this.dataFil = this.rowsDisplay.slice()
      }
      this.elementOrder = ''
      this.prev2()
    },
    cellClick(cell) {
      if (cell.onclick || cell.btn) {
        this.$emit('cell-click', cell)
      }
    },
    prev2() {
      this.navTableElementInit = 1
      if (this.entries <= this.dataFil.length) {
        this.navTableElementEnd = this.entries
      } else {
        this.navTableElementEnd = this.dataFil.length
      }
      this.activePage = 0
    },
    prev1() {
      if (this.activePage > 0) {
        this.activePage--
        this.navTableElementInit = this.activePage * this.entries + 1
        this.navTableElementEnd = (this.activePage + 1) * this.entries
      }
    },
    next1() {
      const pagesAmount = Math.ceil(this.dataFil.length / this.entries)
      if (this.activePage < pagesAmount - 1) {
        this.activePage++
        this.navTableElementInit += this.entries
        if (this.activePage !== pagesAmount - 1) {
          this.navTableElementEnd += this.entries
        } else {
          this.navTableElementEnd = this.dataFil.length
        }
      }
    },
    next2() {
      const pagesAmount = Math.ceil(this.dataFil.length / this.entries)
      if (this.activePage < pagesAmount - 1) {
        this.activePage = pagesAmount - 1
        this.navTableElementInit = this.activePage * this.entries + 1
        this.navTableElementEnd = this.dataFil.length
      }
    },
    dynamicSortStr: function(property) {
      var sortOrder = 1
      if (property[0] === '-') {
        sortOrder = -1
        property = property.substr(1)
      }
      return function(a, b) {
        var result =
          a[property].text.toLowerCase() < b[property].text.toLowerCase()
            ? -1
            : a[property].text.toLowerCase() > b[property].text.toLowerCase()
              ? 1
              : 0
        return result * sortOrder
      }
    },
    dynamicSortTime: function(property) {
      var sortOrder = 1
      if (property[0] === '-') {
        sortOrder = -1
        property = property.substr(1)
      }
      return function(a, b) {
        var vsecA = a[property].text.split(/:| /)
        var vsecB = b[property].text.split(/:| /)
        var secA = vsecA[2] * 60 + vsecA[1] * 3600 + vsecA[0] * 86400
        var secB = vsecB[2] * 60 + vsecB[1] * 3600 + vsecB[0] * 86400
        var result = secA < secB ? -1 : secA > secB ? 1 : 0
        return result * sortOrder
      }
    },
    dynamicSort: function(property) {
      var sortOrder = 1
      if (property[0] === '-') {
        sortOrder = -1
        property = property.substr(1)
      }
      return function(a, b) {
        var result =
          a[property].text < b[property].text
            ? -1
            : a[property].text > b[property].text
              ? 1
              : 0
        return result * sortOrder
      }
    },
    dynamicSortNum: function(property) {
      var sortOrder = 1
      if (property[0] === '-') {
        sortOrder = -1
        property = property.substr(1)
      }
      return function(a, b) {
        var result =
          parseFloat(a[property].text) < parseFloat(b[property].text)
            ? -1
            : parseFloat(a[property].text) > parseFloat(b[property].text)
              ? 1
              : 0
        return result * sortOrder
      }
    },
  },
}
</script>

<style scoped>
.report-table tr:nth-child(even) {
  /* background-color: #f2f2f2; */
  background-color: #ffffff;
}
.report-table tr:nth-child(odd) {
  background-color: #fcf7f7;
}
</style>

<style>
.main__table--header {
  border-top: none;
  color: white;
  font-weight: bold;
  background-color: #019bcc;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
}

.main__table--row {
  /* white-space: nowrap; */
  cursor: none;
}

.main__table--cell {
  font-size: 0.9rem;
}

.cell-place {
  min-width: 350px;
  /*white-space: nowrap;*/
}

.cell-alias {
  min-width: 150px;
}

.cell-place-link {
  min-width: 350px;
  color: darkblue;
  text-decoration: underline;
  font-weight: normal;
  cursor: pointer;
}

.cell-link {
  color: darkblue;
  text-decoration: underline;
  font-weight: normal;
  cursor: pointer;
  vertical-align: middle;
}

.cell-text-nowrap {
  white-space: nowrap;
}

.cell-text-m {
  min-width: 130px;
  vertical-align: middle;
}

.cell-text-l {
  min-width: 180px;
  vertical-align: middle;
}

.cell-text-xl {
  min-width: 300px;
  vertical-align: middle;
}

.label {
  font-weight: bold;
  font-size: 1.2em;
  text-shadow: 1px 1px 1px #ccc;
}

.main__table--link {
  color: darkblue;
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}

.main__bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.main__bar--filter {
  width: 350px;
}

.main__table--bar--rows {
  min-width: 50px;
}
.main__table--bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  width: 100px;
}
.main__table--nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main__table--nav-text {
  font-size: 0.8rem;
  width: 250px;
}
.main__table--bar--search {
  width: 200px !important;
}
.main__table--nav-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main__table--nav-btn {
  width: 34px;
  height: 34px;
  padding: 3px;
}
.main__table--nav-btn-first {
  width: 34px;
  height: 34px;
  padding: 3px;
  margin-left: 3px;
}

.fondoBlanco {
  background-color: white;
}
.fondoVerde {
  background-color: #00c851;
}
.fondoRojo {
  background-color: #ff4444;
}
.fondoAmarillo {
  background-color: #ffbb33;
}
.fondoAzul {
  background-color: #33b5e5;
}
.fondoMorado {
  background-color: #9933cc;
}
.alert-cell {
  background-color: #f23f41;
}
.th-xl {
  min-width: 20rem;
}

.report-table {
  overflow-y: auto;
}

.report-table thead th {
  position: sticky;
  height: 30px;
  top: 0;
  font-weight: bold;
  align-items: center;
  font-size: 0.8rem;
  border: 1px solid #dee2e6;
}

table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  vertical-align: center;
}
th {
  background: #eee;
}
tr {
  vertical-align: center;
}

.main__btn-excel {
  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  padding: 0.6rem 0.6rem;
  font-size: 0.81rem;
  border-radius: 0.125rem;
  cursor: pointer;
}
.main__btn-excel:hover,
.main__btn-excel:active,
.main__btn-excel:focus {
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
  outline: 0;
}

.btn {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  padding: 0.84rem 2.14rem;
  font-size: 0.81rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  margin: 0.375rem;
  border: 0;
  border-radius: 0.125rem;
  cursor: pointer;
  text-transform: uppercase;
  white-space: normal;
  word-wrap: break-word;
  color: inherit;
}
.btn:hover,
.btn:active,
.btn:focus {
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
  outline: 0;
}
.btn:not([disabled]):not(.disabled):active,
.btn:not([disabled]):not(.disabled).active {
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
}
.btn .fas,
.btn .fab,
.btn .far {
  position: relative;
  font-size: 0.9rem;
}
.btn .fas.right,
.btn .fab.right,
.btn .far.right {
  margin-left: 0.3rem;
}
.btn .fas.left,
.btn .fab.left,
.btn .far.left {
  margin-right: 0.3rem;
}
.btn.btn-lg {
  padding: 1rem 2.4rem;
  font-size: 0.94rem;
}
.btn.btn-lg .fas,
.btn.btn-lg .fab,
.btn.btn-lg .far {
  font-size: 1rem;
}
.btn.btn-md {
  padding: 0.7rem 1.6rem;
  font-size: 0.7rem;
}
.btn.btn-md .fas,
.btn.btn-md .fab,
.btn.btn-md .far {
  font-size: 0.8rem;
}
.btn.btn-sm {
  padding: 0.5rem 1.6rem;
  font-size: 0.64rem;
}
.btn.btn-sm .fas,
.btn.btn-sm .fab,
.btn.btn-sm .far {
  font-size: 0.7rem;
}
.btn.btn-tb {
  padding: 0.3rem 1rem;
}
.btn.disabled:active,
.btn.disabled:focus,
.btn.disabled:hover,
.btn:disabled:active,
.btn:disabled:focus,
.btn:disabled:hover {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.btn.btn-block {
  margin: inherit;
}
.btn.btn-link {
  box-shadow: none;
  background-color: transparent;
}
.btn.btn-link:active,
.btn.btn-link:focus,
.btn.btn-link:hover {
  box-shadow: none !important;
  background-color: transparent;
}
.btn[class*='btn-outline-'] {
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
}
.btn[class*='btn-outline-'].btn-lg {
  padding-top: 0.88rem;
  padding-bottom: 0.88rem;
}
.btn[class*='btn-outline-'].btn-md {
  padding-top: 0.58rem;
  padding-bottom: 0.58rem;
}
.btn[class*='btn-outline-'].btn-sm {
  padding-top: 0.38rem;
  padding-bottom: 0.38rem;
}

[data-tooltip] {
  position: relative;
  display: inline-block;
}

[data-tooltip]:before,
[data-tooltip]:after {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  z-index: 999999;
}

[data-tooltip]:before {
  content: '';
  position: absolute;
  border-width: 6px;
  border-style: solid;
  border-color: transparent;
}

[data-tooltip]:after {
  height: 22px;
  padding: 5px 11px 0 11px;
  font-size: 13px;
  line-height: 11px;
  content: attr(data-tooltip);
  white-space: nowrap;
}

/*.simptip-position-top {
  color: darkblue;
}*/

[data-tooltip].simptip-position-top:before {
  border-top-color: #323232;
}

[data-tooltip].simptip-position-top:after {
  background-color: #323232;
  color: #ecf0f1;
}

[data-tooltip].simptip-position-bottom:before {
  border-bottom-color: #323232;
}

[data-tooltip].simptip-position-bottom:after {
  background-color: #323232;
  color: #ecf0f1;
}

[data-tooltip].simptip-position-left:before {
  border-left-color: #323232;
}

[data-tooltip].simptip-position-left:after {
  background-color: #323232;
  color: #ecf0f1;
}

[data-tooltip].simptip-position-right:before {
  border-right-color: #323232;
}

[data-tooltip].simptip-position-right:after {
  background-color: #323232;
  color: #ecf0f1;
}

[data-tooltip].simptip-position-top.half-arrow:before {
  border-right: 7px solid #323232;
}

[data-tooltip].simptip-position-bottom.half-arrow:before {
  border-right: 7px solid #323232;
}

[data-tooltip]:hover,
[data-tooltip]:focus {
  background-color: transparent;
}

[data-tooltip]:hover:before,
[data-tooltip]:hover:after,
[data-tooltip]:focus:before,
[data-tooltip]:focus:after {
  visibility: visible;
  opacity: 1;
}
/******************************* Position ****************************/

.simptip-position-right.simptip-movable:before,
.simptip-position-right.simptip-movable:after,
.simptip-position-left.simptip-movable:before,
.simptip-position-left.simptip-movable:after,
.simptip-position-top.simptip-movable:before,
.simptip-position-top.simptip-movable:after,
.simptip-position-bottom.simptip-movable:before,
.simptip-position-bottom.simptip-movable:after {
  -webkit-transition: all 0.1s linear;
  -moz-transition: all 0.1s linear;
  -o-transition: all 0.1s linear;
  -ms-transition: all 0.1s linear;
  transition: all 0.1s linear;
}

.simptip-position-right:before,
.simptip-position-right:after,
.simptip-position-left:before,
.simptip-position-left:after {
  bottom: 50%;
}

.simptip-position-right:before,
.simptip-position-left:before {
  margin-bottom: -5px;
  /*-5px*/
}

.simptip-position-right:after,
.simptip-position-left:after {
  margin-bottom: -14.66667px;
}

.simptip-position-right.half-arrow:before,
.simptip-position-left.half-arrow:before {
  bottom: 16px;
  border-style: none;
  border-top: 7px solid transparent;
}

.simptip-position-right.simptip-multiline:before,
.simptip-position-right.simptip-multiline:after,
.simptip-position-left.simptip-multiline:before,
.simptip-position-left.simptip-multiline:after {
  bottom: -50%;
}

.simptip-position-right.simptip-multiline:before,
.simptip-position-left.simptip-multiline:before {
  margin-bottom: 15px;
}

.simptip-position-right:before,
.simptip-position-right:after {
  left: 100%;
}

.simptip-position-right:before {
  margin-left: -2px;
}

.simptip-position-right:after {
  margin-left: 10px;
}

.simptip-position-right.simptip-movable:before {
  margin-left: -10px;
}

.simptip-position-right.simptip-movable:after {
  margin-left: 2px;
}

.simptip-position-right.simptip-movable:hover:before,
.simptip-position-right.simptip-movable:hover:after {
  -webkit-transform: translateX(10px);
  -moz-transform: translateX(10px);
  -ms-transform: translateX(10px);
  -o-transform: translateX(10px);
  transform: translateX(10px);
}

.simptip-position-right.simptip-movable.half-arrow:before {
  margin-left: -5px;
}

.simptip-position-right.half-arrow:before {
  margin-left: 3px;
  border-right: 7px solid #323232;
}

.simptip-position-left:before,
.simptip-position-left:after {
  right: 100%;
}

.simptip-position-left:before {
  margin-right: -2px;
}

.simptip-position-left:after {
  margin-right: 10px;
}

.simptip-position-left.simptip-movable:before {
  margin-right: -10px;
}

.simptip-position-left.simptip-movable:after {
  margin-right: 2px;
}

.simptip-position-left.simptip-movable:hover:before,
.simptip-position-left.simptip-movable:hover:after {
  -webkit-transform: translateX(-10px);
  -moz-transform: translateX(-10px);
  -ms-transform: translateX(-10px);
  -o-transform: translateX(-10px);
  transform: translateX(-10px);
}

.simptip-position-left.simptip-movable.half-arrow:before {
  margin-right: -5px;
}

.simptip-position-left.half-arrow:before {
  margin-right: 3px;
  border-left: 7px solid #323232;
}

.simptip-position-bottom:before,
.simptip-position-bottom:after,
.simptip-position-top:before,
.simptip-position-top:after {
  left: 50%;
}

.simptip-position-bottom:after,
.simptip-position-top:after {
  margin-left: -18px;
}

.simptip-position-bottom.half-arrow:before,
.simptip-position-top.half-arrow:before {
  border-style: none;
  border-right: 7px solid #323232;
}

.simptip-position-bottom:before,
.simptip-position-bottom:after {
  top: 100%;
}

.simptip-position-bottom:before {
  margin-top: -5px;
  /*-5px*/
}

.simptip-position-bottom:after {
  margin-top: 7px;
}

.simptip-position-bottom.simptip-movable:before {
  margin-top: -15px;
}

.simptip-position-bottom.simptip-movable:after {
  margin-top: -3px;
}

.simptip-position-bottom.simptip-movable:hover:before,
.simptip-position-bottom.simptip-movable:hover:after {
  -webkit-transform: translateY(10px);
  -moz-transform: translateY(10px);
  -ms-transform: translateY(10px);
  -o-transform: translateY(10px);
  transform: translateY(10px);
}

.simptip-position-bottom.simptip-movable.half-arrow:before {
  margin-top: -10px;
}

.simptip-position-bottom.half-arrow:before {
  margin-top: 0;
  border-top: 7px solid transparent;
}

.simptip-position-top:before,
.simptip-position-top:after {
  bottom: 100%;
}

.simptip-position-top:before {
  margin-bottom: -5px;
  /*-5px*/
}

.simptip-position-top:after {
  margin-bottom: 7px;
}

.simptip-position-top.simptip-movable:before {
  margin-bottom: -15px;
}

.simptip-position-top.simptip-movable:after {
  margin-bottom: -3px;
}

.simptip-position-top.simptip-movable:hover:before,
.simptip-position-top.simptip-movable:hover:after {
  -webkit-transform: translateY(-10px);
  -moz-transform: translateY(-10px);
  -ms-transform: translateY(-10px);
  -o-transform: translateY(-10px);
  transform: translateY(-10px);
}

.simptip-position-top.simptip-movable.half-arrow:before {
  margin-bottom: -10px;
}

.simptip-position-top.half-arrow:before {
  margin-bottom: 0;
  border-bottom: 7px solid transparent;
}

/******************************* Features ****************************/

.simptip-smooth:after {
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  -ms-border-radius: 4px;
  -o-border-radius: 4px;
  border-radius: 4px;
}

.simptip-fade:before,
.simptip-fade:after {
  -webkit-transition: opacity 0.2s linear, visibility 0.2s linear;
  -moz-transition: opacity 0.2s linear, visibility 0.2s linear;
  -ms-transition: opacity 0.2s linear, visibility 0.2s linear;
  -o-transition: opacity 0.2s linear, visibility 0.2s linear;
  transition: opacity 0.2s linear, visibility 0.2s linear;
}

.simptip-multiline:after {
  height: auto;
  width: 150px;
  padding: 11px;
  line-height: 19px;
  white-space: normal;
  text-align: left;
}

/**************************** Diverse Colors *************************/

.simptip-success.simptip-position-top:before {
  border-top-color: #62c462;
}

.simptip-success.simptip-position-top:after {
  background-color: #62c462;
  color: #ecf0f1;
}

.simptip-success.simptip-position-bottom:before {
  border-bottom-color: #62c462;
}

.simptip-success.simptip-position-bottom:after {
  background-color: #62c462;
  color: #ecf0f1;
}

.simptip-success.simptip-position-left:before {
  border-left-color: #62c462;
}

.simptip-success.simptip-position-left:after {
  background-color: #62c462;
  color: #ecf0f1;
}

.simptip-success.simptip-position-right:before {
  border-right-color: #62c462;
}

.simptip-success.simptip-position-right:after {
  background-color: #62c462;
  color: #ecf0f1;
}

.simptip-success.simptip-position-top.half-arrow:before {
  border-right: 7px solid #62c462;
}

.simptip-success.simptip-position-bottom.half-arrow:before {
  border-right: 7px solid #62c462;
}

.simptip-info.simptip-position-top:before {
  border-top-color: #5bc0de;
}

.simptip-info.simptip-position-top:after {
  background-color: #5bc0de;
  color: #ecf0f1;
}

.simptip-info.simptip-position-bottom:before {
  border-bottom-color: #5bc0de;
}

.simptip-info.simptip-position-bottom:after {
  background-color: #5bc0de;
  color: #ecf0f1;
}

.simptip-info.simptip-position-left:before {
  border-left-color: #5bc0de;
}

.simptip-info.simptip-position-left:after {
  background-color: #5bc0de;
  color: #ecf0f1;
}

.simptip-info.simptip-position-right:before {
  border-right-color: #5bc0de;
}

.simptip-info.simptip-position-right:after {
  background-color: #5bc0de;
  color: #ecf0f1;
}

.simptip-info.simptip-position-top.half-arrow:before {
  border-right: 7px solid #5bc0de;
}

.simptip-info.simptip-position-bottom.half-arrow:before {
  border-right: 7px solid #5bc0de;
}

.simptip-danger.simptip-position-top:before {
  border-top-color: #e74c3c;
}

.simptip-danger.simptip-position-top:after {
  background-color: #e74c3c;
  color: #ecf0f1;
}

.simptip-danger.simptip-position-bottom:before {
  border-bottom-color: #e74c3c;
}

.simptip-danger.simptip-position-bottom:after {
  background-color: #e74c3c;
  color: #ecf0f1;
}

.simptip-danger.simptip-position-left:before {
  border-left-color: #e74c3c;
}

.simptip-danger.simptip-position-left:after {
  background-color: #e74c3c;
  color: #ecf0f1;
}

.simptip-danger.simptip-position-right:before {
  border-right-color: #e74c3c;
}

.simptip-danger.simptip-position-right:after {
  background-color: #e74c3c;
  color: #ecf0f1;
}

.simptip-danger.simptip-position-top.half-arrow:before {
  border-right: 7px solid #e74c3c;
}

.simptip-danger.simptip-position-bottom.half-arrow:before {
  border-right: 7px solid #e74c3c;
}

.simptip-warning.simptip-position-top:before {
  border-top-color: #e67e22;
}

.simptip-warning.simptip-position-top:after {
  background-color: #e67e22;
  color: #ecf0f1;
}

.simptip-warning.simptip-position-bottom:before {
  border-bottom-color: #e67e22;
}

.simptip-warning.simptip-position-bottom:after {
  background-color: #e67e22;
  color: #ecf0f1;
}

.simptip-warning.simptip-position-left:before {
  border-left-color: #e67e22;
}

.simptip-warning.simptip-position-left:after {
  background-color: #e67e22;
  color: #ecf0f1;
}

.simptip-warning.simptip-position-right:before {
  border-right-color: #e67e22;
}

.simptip-warning.simptip-position-right:after {
  background-color: #e67e22;
  color: #ecf0f1;
}

.simptip-warning.simptip-position-top.half-arrow:before {
  border-right: 7px solid #e67e22;
}

.simptip-warning.simptip-position-bottom.half-arrow:before {
  border-right: 7px solid #e67e22;
}

.cell-s {
  min-width: 50px;
}
.cell-m {
  min-width: 100px;
}
.cell-l {
  min-width: 150px;
}
.cell-xl {
  min-width: 200px;
}

.cell-img {
  min-width: 60px;
  text-align: center;
  vertical-align: center;
}
.cell-center {
  text-align: center;
}
.cell-vcenter {
  vertical-align: middle;
}
.main__nodata {
  padding-top: .5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: gray;
}

.cell__btn {
  display: flex;
  justify-content: center;
}
</style>
