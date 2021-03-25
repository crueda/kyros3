<template>
  <q-page class="q-pa-sm">
    <div class="grid-container">
      <div>
        <q-item-label class="text-center q-pa-sm" style="max-width: 450px">
          <q-input dense rounded outlined v-model="search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-label>

        <q-scroll-area v-bind:style="{ height: listHeight }">
          <div class="q-pa-md" style="max-width: 450px">
            <q-list bordered separator>
              <q-item
                v-for="element in filteredElementsData"
                :key="element.tag_id"
                clickable
                v-ripple
                :active="element.selected"
                active-class="bg-green-5 text-white"
                @click="selectTag(element)"
              >
                <q-item-section>
                  <q-item-label>{{ element.tag_id }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-scroll-area>
      </div>
      <div>
        
        <div class="main__bar">
          <div>
            <q-input dense outlined label="Día" v-model="selectedDay" @click="isShowDatePicker=true">
                <template v-slot:append>
                  <q-icon name="calendar_today" />
                </template>
            </q-input>
            <q-date v-show="isShowDatePicker" v-model="selectedDate" first-day-of-week="1"  :locale="myLocale" today-btn mask="YYYY-MM-DD"/>
          </div>

          <div>
            <q-input dense outlined label="Hora de inicio" v-model="selectedHourInit" @click="isShowDatePicker=true">
                <template v-slot:append>
                  <q-icon name="access_time" />
                </template>
            </q-input>
            <q-time  v-show="isShowDatePicker" v-model="selectedHourInit" mask="HH:mm" />
          </div>

          <div>
            <q-input dense outlined label="Hora de fin" v-model="selectedHourEnd" @click="isShowDatePicker=true">
                <template v-slot:append>
                  <q-icon name="access_time" />
                </template>
            </q-input>
            <q-time v-show="isShowDatePicker" v-model="selectedHourEnd" mask="HH:mm"/>
          </div>
        </div>

        <div class="main__consult--btn">
          <q-btn color="primary" glossy label="Consultar" @click="loadHeatmapData" />
        </div>

    <div>
      <q-inner-loading :showing="isLoading">
        <q-spinner-grid size="100px" color="primary" />
      </q-inner-loading>

        <vl-map
          v-if="renderComponent && isShowMap"
          ref="map"
          :load-tiles-while-animating="true"
          :load-tiles-while-interacting="true"
          v-bind:style="{ height: mapHeight }"
          
        >
          <vl-view
            :projection="projection"
            :zoom.sync="zoom"
            :center.sync="center"
            :rotation.sync="rotation"
          ></vl-view>
          <vl-layer-image id="xkcd">
            <vl-source-image-static
              :url="imgUrl"
              :size="imgSize"
              :extent="imgExtent"
              :projection="projection"
            ></vl-source-image-static>
          </vl-layer-image>

          <vl-layer-heatmap weight="point_weight">
            <vl-source-vector :features="trackingPoints" />
          </vl-layer-heatmap>

          <!-- <vl-feature
            v-for="element in heatmapCells"
            :key="element.id"
            :id="element.id"
          >
            <vl-geom-polygon
              :coordinates="element.coordinatesPolygon"
            ></vl-geom-polygon>

            <vl-style-box>
              <vl-style-stroke
                :width="0"
                color="rgba(149, 230, 181, 0)"
              ></vl-style-stroke>
              <vl-style-fill :color="getCellColor(element)"></vl-style-fill>
            </vl-style-box> -->

            <!-- <vl-geom-point :coordinates="element.coordinates"></vl-geom-point>
            <vl-style-box>

              <vl-style-circle :radius="18">
                <vl-style-fill
                  :color="getCellColor(element)"
                ></vl-style-fill>
              </vl-style-circle>
            </vl-style-box> -->


          <!-- </vl-feature> -->
        </vl-map>

            </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from '@/store/index.js'

import TagApi from '@/repository/TagApi'
import TrackingApi from '@/repository/TrackingApi'

import { createProj, addProj } from 'vuelayers/lib/ol-ext'
import VueLayers from 'vuelayers'

Vue.use(VueLayers)

let size = [2781, 2315]

let extent = [0, 0, ...size]
let customProj = createProj({
  code: 'raster-image',
  units: 'pixels',
  extent,
})
addProj(customProj)

export default {
  name: 'config-tags',
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      },
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      },
      renderComponent: true,
      zoom: 1.6,
      maxZoom: 8,
      center: [size[0] / 2, size[1] / 2],
      rotation: 0,
      projection: customProj.getCode(),
      coordinates: [0, 0],
      imgUrl: '../statics/plano.jpg',
      imgSize: size,
      imgExtent: extent,
      mapHeight: '0px',
      listHeight: '0px',
      tagApi: null,
      trackingApi: null,
      search: '',
      selectedTag: {
        tag_id: '',
      },
      allElements: [],
      heatmapCells: [],
      timestampInit: 1613027482000,
      timestampEnd: 1613067082000,
      selectedDate: null,
      heatmapExtent: [
        1712.3912043927132,
        2754.4180308221903,
        704.0904903173488,
        1931.0011362252776,
      ],
      heatmapBins: 10,
      heatmapData: [],
      maxValue: 0,
      trackingPoints: [],
      point_weight: 0.5,
      selectedDay: '',
      selectedDate: '',
      selectedHourInit: '',
      selectedHourEnd: '',
      isShowDatePicker: false,
      isShowMap: false,
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters(['url', 'token', 'tagData']),
    filteredElementsData() {
      return this.allElements.filter(item => {
        return item.tag_id.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
  },
  watch: {
    selectedDate(val) {
      console.log(this.selectedDate)
      console.log(val)
      // let month = ("0" + (val.getMonth() + 1)).slice(-2);
      this.selectedDay = val.split('-')[2] + '/' + val.split('-')[1] + '/' + val.split('-')[0]
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  mounted() {
    store.commit('setTitle', 'Histórico de tags')
    this.tagApi = new TagApi(this.url, this.token)
    this.trackingApi = new TrackingApi(this.url, this.token)
    this.loadData()
    this.loadInitialDate()
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      this.listHeight = this.window.height - 130 + 'px'
      this.mapHeight = this.window.height - 60 + 'px'
    },
    loadInitialDate() {
      let today = new Date()
      // this.selectedDay = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()
      this.selectedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      // this.selectedDate = today
      this.selectedHourInit = '00:00'
      this.selectedHourEnd = '23:59'
    },
    loadData() {
      this.allElements.length = 0
      for (let key in this.tagData) {
        let el = { ...this.tagData[key] }
        el.selected = false
        this.allElements.push(el)
      }
      // this.selectTag(this.allElements[0])
    },
    generateId: function() {
      return parseInt(Math.random() * 10000000)
    },
    async loadHeatmapData() {
      if (this.selectedTag.tag_id === '') {
        this.showToast('red', 'Seleccione un tag')
        return
      }
      this.isLoading = true
      this.isShowMap = false
      this.isShowDatePicker = false

      this.timestampInit = Date.parse(this.selectedDate)
      let hours = parseInt(this.selectedHourInit.split(':')[0])
      this.timestampInit += hours * 60 * 60 * 1000
      this.timestampInit += parseInt(this.selectedHourInit.split(':')[1]) * 60 * 1000

      this.timestampEnd = Date.parse(this.selectedDate)
      this.timestampEnd += this.selectedHourEnd.split(':')[0] * 60 * 60 * 1000
      this.timestampEnd += this.selectedHourEnd.split(':')[1] * 60 * 1000
      try {
        let trackingData = await this.trackingApi.getTracking(
          this.selectedTag.tag_id,
          this.timestampInit,
          this.timestampEnd
        )
        this.isLoading = false
        // this.heatmapExtent = trackingData.data.extent
        // this.heatmapBins = trackingData.data.bins
        // this.heatmapData = trackingData.data.data

        this.trackingPoints.length = 0
        this.trackingPoints = []
        trackingData.data.data.forEach(el => {
          this.trackingPoints.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [el.x, el.y],
            },
          })
        })
        
        if (this.trackingPoints.length === 0) {
          this.showToast('red', 'No se han encontrado datos para la búsqueda indicada')
          return
        } 
          this.showToast('orange', 'Procesando datos sobre el mapa...', 1000, 'bottom')

        this.renderComponent = false
        this.$nextTick(() => {
          this.renderComponent = true
        })

        // this.showHistogram()
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
      this.isShowMap = true
    },
    showHistogram() {
      let minX = this.heatmapExtent[0]
      let maxX = this.heatmapExtent[1]
      let minY = this.heatmapExtent[2]
      let maxY = this.heatmapExtent[3]
      this.heatmapCells.length = 0
      let stepX = (maxX - minX) / this.heatmapBins
      let stepY = (maxY - minY) / this.heatmapBins
      let cursorX = minX
      let cursorY
      for (let i = 0; i < this.heatmapBins; i++) {
        cursorY = minY
        for (let j = 0; j < this.heatmapBins; j++) {
          let value = this.heatmapData[i][j]
          if (value > this.maxValue) {
            this.maxValue = value
          }
          let el = {
            id: this.generateId(),
            coordinates: [cursorX, cursorY],
            coordinatesPolygon: [
              [
                [cursorX, cursorY],
                [cursorX + stepX, cursorY],
                [cursorX + stepX, cursorY + stepY],
                [cursorX, cursorY + stepY],
              ],
            ],
            // coordinatesPolygon: [[[cursorX, cursorY + stepY],[cursorX + stepX, cursorY + stepY],[cursorX + stepX, cursorY],[cursorX, cursorY]]],
            value,
          }
          this.heatmapCells.push(el)
          cursorY += stepY
        }
        cursorX += stepX
      }
    },
    selectTag(tag) {
      this.allElements.forEach(el => {
        if (el.tag_id == tag.tag_id) {
          this.selectedTag = { ...tag }
          el.selected = true
          // this.loadHeatmapData()
        } else {
          el.selected = false
        }
      })
    },
    unselectAll() {
      this.allElements.forEach(el => {
        el.selected = false
      })
    },
    isExistTag(tag) {
      for (let i = 0; i < this.allElements.length; i++) {
        let el = this.allElements[i]
        if (el.tag_id == tag.tag_id) {
          return true
        }
      }
      return false
    },
    newElement() {
      this.unselectAll()
      this.selectedTag = {
        tag_id: '',
        slot_number: 0,
      }
    },
    getCellColor(element) {
      let opacity = (element.value * 100) / this.maxValue
      return 'rgba(149, 230, 181, ' + opacity + ')'
    },
    showToast(color, msg, timeout=2000, position='top') {
      this.$q.notify.setDefaults({
        position,
        timeout,
        textColor: 'white',
        color,
        actions: [{ icon: 'close', color: 'white' }],
      })
      this.$q.notify(msg)
    },
  },
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
}

.main__form {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.main__form--row {
  display: flex;
  justify-content: center;
}

.main__form--btns {
  display: flex;
  justify-content: center;
}

.grid-container {
  display: grid;
  grid-template-columns: 20% 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: '.';
}

.main__bar {
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding-top: .5rem;
}

.main__consult--btn {
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding-top: 1rem;
}
</style>
