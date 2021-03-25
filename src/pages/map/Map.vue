<template>
  <q-page class="q-pa-sm">
    <div class="main__btn">
      <q-btn round color="deep-orange" glossy text-color="white" icon="sell" @click="showSidePanel"/>    
    </div>
    <div ref="content_map" class="main__map">
      <vl-map
        v-if="renderComponent"
        ref="map"
        @click="onClickMap"
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

        <div v-for="element in tagPosition" :key="element.tag_id">
          <vl-feature
            v-if="tagData[element.tag_id].selected"            
            :id="element.tag_id"
          >
            <vl-geom-point :coordinates="element.coordinates"></vl-geom-point>
            <vl-style-box>
              <vl-style-text :text="element.tag_id">
                <vl-style-stroke :width="1"></vl-style-stroke>
                <vl-style-fill color="rgba(0,0,0,0.9)"></vl-style-fill>
              </vl-style-text>
              <vl-style-circle :radius="18">
                <vl-style-stroke :width="1"></vl-style-stroke>
                <vl-style-fill
                  color="rgba(149, 230, 181, 0.8)"
                ></vl-style-fill>
              </vl-style-circle>
            </vl-style-box>
          </vl-feature>
        </div>

        <vl-overlay
          v-if="isOverlay"
          id="overlay"
          :position="overlayCoordinates"
          :offset="[5, 5]"
        >
          <template>
            <div class="overlay-content">
              <table class="blueTable">
                <thead>
                  <tr>
                    <td class="table-header">Tag</td>
                    <td class="table-header">Fecha</td>
                    <td class="table-header">Batería</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="element in elementsOverlay" :key="element.tag_id">
                    <td class="table-element">
                      {{ element.overlayText }}
                    </td>
                    <td class="table-element">
                      {{ element.overlayTextTime }}
                    </td>
                    <td class="table-element">
                      {{ element.overlayBattery }} %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </vl-overlay>
      </vl-map>
    </div>
    <slideout-panel></slideout-panel>
  </q-page>
</template>

<script>
import Vue from "vue"
import { mapGetters } from 'vuex'
import store from '@/store/index.js'

import { createProj, addProj } from "vuelayers/lib/ol-ext"
import VueLayers from "vuelayers"
import { utilMixin } from '@/mixins/util'
import TrackingApi from '@/repository/TrackingApi'
import VueSlideoutPanel from 'vue2-slideout-panel'
import SideTooltip from './SideTooltip.vue'

import * as dayjs from 'dayjs'
var utc = require('dayjs/plugin/utc') 
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)


Vue.use(VueLayers)
Vue.use(VueSlideoutPanel)

Vue.component('side-tooltip', SideTooltip)

// let size = [1081, 904];
// let size = [3371, 2810];
let size = [2781, 2315];
let extent = [0, 0, ...size];
let customProj = createProj({
  code: "image-raster",
  units: "pixels",
  extent
});
addProj(customProj);


// let extent = [-x / 2, -y / 2, x / 2, y / 2]

export default {
  name: "Map",
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      },
      renderComponent: true,
      zoom: 1.8,
      maxZoom: 8,
      // center: [0, 0],
      center: [size[0] / 2, size[1] / 2],
      // rotation: (Math.PI)/2 + 0.145,
      rotation: 0,
      projection: customProj.getCode(),
      imgUrl: '../statics/plano.jpg',
      imgSize: size,
      imgExtent: extent,
      mapHeight: '0px',
      isOverlay: false,
      trackingData: [],
      overlayInfo: {},
      elementsOverlay: [],
      interval: null,
      trackingApi: null,
      tagPosition: {},
      sideTooltip: null,      
    }
  },
  props: {
    // trackingApi: {
    //   default: () => new TrackingApi(),
    // },
  },
  computed: {
    ...mapGetters([
      'url',
      'token',
      'clientId',
      'username',
      'origin',
      'tagData',
    ]),
  },  
  mixins: [utilMixin],  
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  mounted() { 
    store.commit('setTitle', 'Mapa en tiempo real') 
    let wsMsg = {'task': 'login', 'username': this.username, 'token': this.token} 
    this.$socket.send(JSON.stringify(wsMsg))  
    this.trackingApi = new TrackingApi(this.url, this.token)
    this.loadData()
    
    this.$options.sockets.onmessage = (data) => {
        this.onWSmsg(data)
    }
  },
  methods: {
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      this.mapHeight = ((this.window.height) - 60) + 'px'
      this.renderComponent = false
      this.$nextTick(() => {
        this.renderComponent = true
      })
    },
    async loadData() {
      this.overlayInfo = {}
      try {
        let trackingData = await this.trackingApi.getTracking1()
        trackingData.data.data.forEach ( el => {
          this.updateTagPosition(el)
        })
        this.renderComponent = false
        this.$nextTick(() => {
          this.renderComponent = true
        })
        this.showToast('orange', 'Procesando datos sobre el mapa...', 700, 'bottom')
        // this.showData()
      } catch (err) {
        console.log(err)
      }
    },
    onWSmsg(msg) {
        // console.log('Datos recibidos: ' + msg.data)
        let data = JSON.parse(msg.data)
        if (data.type == 'login') {
          store.commit('setClientId', data.client_id)
          let wsMsg = {'task': 'subscription', 'client_id': this.clientId, 'type': 0}
          this.$socket.send(JSON.stringify(wsMsg))
        } else if (data.type == 0) {
          this.updateTagPosition(data.data)
        }
    }, 
    updateTagPosition(data) {
      if (this.tagPosition[data.tag_id] == undefined) {
        this.tagPosition[data.tag_id] = { ...data }
        this.tagPosition[data.tag_id].coordinates = [data.x, data.y]
      } else {
        let tp = { ...this.tagPosition }
        tp[data.tag_id].timestamp = data.timestamp
        tp[data.tag_id].coordinates = [data.x, data.y]
        // tp[data.tag_id].coordinates = [data.x - this.origin[0], data.y - this.origin[1]]
        this.tagPosition = { ...tp }
      }
      
    }, 
    showSidePanel() {
      this.sideTooltip = this.$showPanel({
        component: 'side-tooltip',
        openOn: 'right',
        hideBg: false,
        removeBg: false,
        disableBgClick: true,
        width: 350,
        props: {
          data: {},
        },
      })
      this.sideTooltip.promise.then(result => {
        //result is whatever you're panel component passes to this.$emit("closePanel", {})
      })      
    },
    onClickMap ({ pixel }) {
      this.isOverlay = false
      this.elementsOverlay.length = 0
      this.$refs.map.forEachFeatureAtPixel(pixel, (f) => {
        if (f != undefined) {
          this.elementsOverlay.push({
            overlayText: this.tagPosition[f.id_].tag_id,
            overlayTextTime: dayjs(this.tagPosition[f.id_].timestamp * 1000).tz('Europe/Madrid').format('DD/MM/YYYY - HH:mm:ss'),
            overlayBattery: this.tagPosition[f.id_].battery,
          })
          this.overlayCoordinates = this.tagPosition[f.id_].coordinates
          this.isOverlay = true

          // this.showSidePanel()
        }
      }, { hitTolerance: 25 })
    },
  }
};
</script>

<style scoped>

.main__btn {
  display: flex;
  justify-content: flex-end;
}

</style>

<style lang="scss">
.chart-widget {
  .va-card__body {
    height: 550px;
  }
}

.overlay-content {
  background-color: white;
  font-size: 14px;
  border: 1px solid black;
  padding: .5rem;
}

table.blueTable {
  border: 1px solid #1C6EA4;
  background-color: #EEEEEE;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}
table.blueTable thead th tr td {
  border: 1px solid #AAAAAA;
  padding: 3px 2px;
  color: white;
}
table.blueTable tbody tr td {
  border: 1px solid #AAAAAA;
  color: black;
  padding: 5px;
}
table.blueTable tbody td {
  font-size: 13px;
}
table.blueTable tr:nth-child(even) {
  background: #D0E4F5;
}
table.blueTable thead {
  background: #1C6EA4;
  background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  background: -webkit-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  border-bottom: 2px solid #444444;
}
table.blueTable thead th {
  font-size: 15px;
  font-weight: bold;
  color: #FFFFFF;
  border-left: 2px solid #D0E4F5;
}
table.blueTable thead th:first-child {
  border-left: none;
}

table.blueTable tfoot {
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  background: #D0E4F5;
  background: -moz-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  background: -webkit-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  background: linear-gradient(to bottom, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  border-top: 2px solid #444444;
}
table.blueTable tfoot td {
  font-size: 14px;
}
table.blueTable tfoot .links {
  text-align: right;
}
table.blueTable tfoot .links a{
  display: inline-block;
  background: #1C6EA4;
  color: #FFFFFF;
  padding: 2px 8px;
  border-radius: 5px;
}
.table-header {
  font-weight: bold;
  color: white;
  padding: 5px;
}

.table-element {
  color: black;
  padding: 5px;
}

.table-element-mask {
  background-color: #ff7e00;
}


</style>
