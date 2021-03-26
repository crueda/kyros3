<template>
  <q-page class="q-pa-sm">
    <q-card class="bg-transparent no-shadow no-border">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm ">
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #7cb342" class="q-pa-none">
                <q-item-section class="q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder"
                    >{{counter.movement}}</q-item-label
                  >
                  <q-item-label>En movimiento</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="fas fa-car" color="white" size="34px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #EA4B64" class="q-pa-none">
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder"
                    >{{counter.stopped}}</q-item-label
                  >
                  <q-item-label>Parados</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="fas fa-stop" color="white" size="28px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #546bfa" class="q-pa-none ">
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder"
                    >{{counter.idle}}</q-item-label
                  >
                  <q-item-label>Inactivos</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon
                    name="fas fa-pause"
                    color="white"
                    size="30px"
                  ></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #f88c2b" class="q-pa-none">
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder"
                    >{{counter.disconnected}}</q-item-label
                  >
                  <q-item-label>Sin conexión</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="fas fa-bolt" color="white" size="30px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-sm  q-py-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #ffffff">
          <q-card-section class="text-h6 text-black">
            Distancia y consumo
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :loading="isLoadingDistanceFuel"
              :style="{ height: chartHeight }"
              :option="distanceFuelData"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #ffffff">
          <q-card-section class="text-h6 text-black">
            Distancia y consumo 7 días
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :loading="isLoadingDistanceWeek"
              :style="{ height: chartHeight }"
              :option="distaceWeekData"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #ffffff">
          <q-card-section class="text-h6 text-black">
            Actividad mensual
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :style="{ height: chartHeight }"
              :option="getPieOptions"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-sm  q-py-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #ea4b64">
          <q-card-section class="text-h6 text-white">
            Consumo mensual por flota
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :loading="isLoadingFleetFuel"
              :style="{ height: chartHeight }"
              :option="BarChart"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #dceaf5">
          <q-card-section class="text-h6 text-black">
            Infracciones 7 días
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :loading="isLoadingDistanceWeek"
              :style="{ height: chartHeight }"
              :option="LineChart3"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #638f35">
          <q-card-section class="text-h6 text-white">
            Actividad por conductor 7 días
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :loading="isLoadingDriverWeek"
              :style="{ height: chartHeight }"
              :option="LineChartDrivers"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/full.js'
import { mapGetters } from "vuex";
import Todo from '../components/Todo'
import DashboardApi from '@/repository/DashboardApi'


export default {
  name: 'dashboard',
  components: {
    Todo,
    IEcharts,
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  mounted() {
    let today = new Date()
    this.year = today.getFullYear()
    this.month = today.getMonth() + 1
    this.day = today.getDate()
    today.setHours(0, 0, 0, 0)
    let yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() -1)
    this.monthYesterday = yesterday.getMonth() +1 
    this.dayYesterday = yesterday.getDate()
    let tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    let last7 = new Date(tomorrow)
    last7.setDate(last7.getDate() - 7)
    this.initTimestamp = last7.getTime()
    this.endTimestamp = tomorrow.getTime()

    this.dashboardApi = new DashboardApi(this.url, this.token)
    this.loadData()
  },
  computed: {
    ...mapGetters(["url", "token"]),
    getPieOptions() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['Diciembre', 'Enero', 'Febrero', 'Marzo'],
        },
        series: [
          {
            name: 'Sales',
            type: 'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: 335,
                name: 'Diciembre',
                itemStyle: {
                  color: '#546bfa',
                },
              },
              {
                value: 310,
                name: 'Enero',
                itemStyle: {
                  color: '#3a9688',
                },
              },
              {
                value: 234,
                name: 'Febrero',
                itemStyle: {
                  color: '#02a9f4',
                },
              },
              {
                value: 135,
                name: 'Marzo',
                itemStyle: {
                  color: '#f88c2b',
                },
              },
            ],
          },
        ],
      }
    },
  },
  data() {
    return {
      dashboardApi: null,
      window: {
        width: 0,
        height: 0,
      },
      initTimestamp: 0,
      endTimestamp: 0,
      isLoading: false,
      isLoading1: false,
      isLoadingDistanceFuel: false,
      isLoadingDistanceWeek: false,
      isLoadingFleetFuel: false,
      isLoadingDriverWeek: false,
      year: 2000,
      month: 1,
      day: 1,
      monthYesterday: 1,
      dayYesterday: 1,
      counter: {
          movement: 0,
          idle: 0,
          stopped: 0,
          disconnected: 0,
      },
      chartHeight: '250px',
      filter: '',
      mode: 'list',
      tab: 'contact',
      layout: 'dense',
      side: 'right',
      distanceFuelData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Coordinate axis indicator, coordinate axis trigger is valid
            type: 'shadow', // The default is a straight line, optional:'line' |'shadow'
          },
        },

        grid: {
          left: '2%',
          right: '2%',
          top: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['Ayer', 'Hoy'],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: 'Distancia',
            type: 'bar',
            data: [0, 0],
            color: '#546bfa',
          },
          {
            name: 'Consumo',
            type: 'bar',
            data: [0, 0],
            color: '#f88c2b',
          },
        ],
      },
      chartOptions: {
        chart: {
          type: 'bar',
          height: 430,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff'],
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff'],
        },
        xaxis: {
          categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },
      },
      BarChart: {
        tooltip: { show: true },
        title: {
          show: true,
          textStyle: { color: 'rgba(0, 0, 0 , .87)', fontFamily: 'sans-serif' },
        },
        grid: { containLabel: true, bottom: '10%', top: '5%' },
        xAxis: {
          show: false,
          type: 'category',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
          axisLabel: { show: false },
        },
        yAxis: {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisLabel: { show: false },
          splitLine: { lineStyle: { type: 'dashed' } },
          axisTick: {
            show: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
        },
        series: [
          {
            type: 'bar',
            barGap: '-100%',
            itemStyle: { normal: { color: 'rgba(0,0,0,0.1)' } },
            barWidth: '50%',
          },
          {
            barWidth: '50%',
            type: 'bar',
            itemStyle: { normal: { color: '#ffffff' } },
          },
        ],
        dataset: {
          source: [
            
          ],
        },
      },
      LineChartDrivers: {
        tooltip: { show: true },
        title: {
          show: true,
          textStyle: { color: 'rgba(0, 0, 0 , .87)', fontFamily: 'sans-serif' },
        },
        grid: { containLabel: true, left: '0', bottom: '0', right: '0' },
        xAxis: {
          show: false,
          type: 'category',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
          axisLabel: { show: false },
          boundaryGap: false,
        },
        yAxis: {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisLabel: { show: false },
          splitLine: { lineStyle: { type: 'dashed' } },
          axisTick: {
            show: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
        },
        series: [],
        dataset: {
          source: [{ day: '' },{ day: '' },{ day: '' },{ day: '' },{ day: '' },{ day: '' }],
        },
        color: ['#7BD4D5'],
      },
      distaceWeekData: {
        tooltip: { show: true },
        title: {
          show: true,
          textStyle: { color: 'rgba(0, 0, 0 , .87)', fontFamily: 'sans-serif' },
        },
        grid: { containLabel: true, left: '0', bottom: '0', right: '0' },
        xAxis: {
          show: false,
          type: 'category',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
          axisLabel: { show: false },
          boundaryGap: false,
        },
        yAxis: {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisLabel: { show: false },
          splitLine: { lineStyle: { type: 'dashed' } },
          axisTick: {
            show: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
        },
        series: [{ type: 'line', areaStyle: {
          color: '#546BFA'
        }, smooth: true }, { type: 'line', areaStyle: {
          color: '#F78C2C'
        }, smooth: true }],
        dataset: {
          source: [            
          ],
        },
        color: ['#45c2c5'],
      },
      LineChart3: {
        tooltip: { show: true },
        title: {
          show: true,
          textStyle: { color: 'rgba(0, 0, 0 , .87)', fontFamily: 'sans-serif' },
        },
        grid: { containLabel: true, left: '0', bottom: '0', right: '0' },
        xAxis: {
          show: false,
          type: 'category',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
          axisLabel: { show: false },
          boundaryGap: false,
        },
        yAxis: {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: { color: 'rgba(0, 0, 0 , .54)', type: 'dashed' },
          },
          axisLabel: { show: false },
          splitLine: { lineStyle: { type: 'dashed' } },
          axisTick: {
            show: true,
            lineStyle: {
              show: true,
              color: 'rgba(0, 0, 0 , .54)',
              type: 'dashed',
            },
          },
        },
        series: [{ type: 'line', areaStyle: {}, smooth: false }],
        dataset: {
          source: [
          ],
        },
        color: ['#EA4B64'],
      },
      series2: [44, 55, 41, 17, 15],
      donutchartOptions: {
        chart: {
          width: 380,
          type: 'donut',
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex]
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    }
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      this.chartHeight = (this.window.height - 310) / 2 + 'px'
    },
    async loadData() {
      try {
        this.isLoading = true
        let vehiclesStateResponse = await this.dashboardApi.vehiclesState()
        this.counter.movement = vehiclesStateResponse.data.data.entries.movement
        this.counter.idle = vehiclesStateResponse.data.data.entries.idle
        this.counter.stopped = vehiclesStateResponse.data.data.entries.stopped
        this.counter.disconnected = vehiclesStateResponse.data.data.entries.disconnected
        let summaryMonthResponse = await this.dashboardApi.summaryMonth(this.year, this.month)
        let summaryFleetData = {}
        summaryMonthResponse.data.data.forEach( element => {
          for (let key in element.fleet_data) {
            if (element.fleet_data[key].distance !== undefined) {
              if (summaryFleetData[key] === undefined) {
                summaryFleetData[key] = { ...element.fleet_data[key] }
              } else {
                summaryFleetData[key].distance += element.fleet_data[key].distance
              }
            }
          }
        })
        let fleetMaxDistance = 0
        for (let fleetId in summaryFleetData) {
          if (summaryFleetData[fleetId].distance > fleetMaxDistance) {
            fleetMaxDistance = summaryFleetData[fleetId].distance
          }
        }
        let arrSummaryFleetData = []
        for (let fleetId in summaryFleetData) {
          arrSummaryFleetData.push({ label: fleetId, max: fleetMaxDistance, distance: summaryFleetData[fleetId].distance })
        }
        arrSummaryFleetData.sort((a, b) => (a.distance < b.distance) ? 1 : -1)
        arrSummaryFleetData.forEach (el => {
          this.BarChart.dataset.source.push( {label: el.label, max: el.max.toFixed(2), distance: el.distance.toFixed(2)} )
        })

        this.isLoadingDistanceFuel = true        
        this.isLoadingDistanceWeek = true
        let summaryLast = await this.dashboardApi.summaryRange(this.initTimestamp, this.endTimestamp)
        let summaryLastData = {}
        summaryLast.data.data.forEach( element => {
            if (summaryLastData[[element.month, element.day]] === undefined) {
               summaryLastData[[element.month, element.day]] = {
                   distance: element.distance,
                   consumption: element.consumption,
                   movement: element.movement,
                   events: 0,
               } 
            } else {
                summaryLastData[[element.month, element.day]].distance += element.distance
                summaryLastData[[element.month, element.day]].consumption += element.consumption
                summaryLastData[[element.month, element.day]].movement += element.movement
                if (element.driving_events.harsh_acceleration !== undefined) {
                  summaryLastData[[element.month, element.day]].events += element.driving_events.harsh_acceleration
                }
                if (element.driving_events.max_speed !== undefined) {
                  summaryLastData[[element.month, element.day]].events += element.driving_events.max_speed
                }
                if (element.driving_events.harsh_braking !== undefined) {
                  summaryLastData[[element.month, element.day]].events += element.driving_events.harsh_braking
                }
                if (element.driving_events.harsh_cornering !== undefined) {
                  summaryLastData[[element.month, element.day]].events += element.driving_events.harsh_cornering
                }
            }
        })
        this.isLoadingDistanceFuel = false
        this.isLoadingDistanceWeek = false
        let distanceYesterday = summaryLastData[[this.monthYesterday, this.dayYesterday]].distance
        let distanceToday = 0
        let consumptionToday = 0
        try {
          distanceToday = summaryLastData[[this.month, this.day]].distance
          consumptionToday = summaryLastData[[this.month, this.day]].consumption
        } catch(e) {}
        let consumptionYesterday = summaryLastData[[this.monthYesterday, this.dayYesterday]].consumption
        this.distanceFuelData.series[0].data = [distanceYesterday, distanceToday]
        this.distanceFuelData.series[1].data = [consumptionYesterday, consumptionToday]

        let today = new Date()
        for (let i=7; i>1; i--) {
          let actualDate = new Date(today)
          actualDate.setDate(actualDate.getDate() - i +1 )
          let actualMonth = actualDate.getMonth() + 1
          let actualDay = actualDate.getDate()
          let actualDistance = 0
          let actualConsumption = 0
          let actualEvents = 0
          try {
            actualDistance = summaryLastData[[actualMonth, actualDay]].distance.toFixed(2)
            actualConsumption = summaryLastData[[actualMonth, actualDay]].consumption.toFixed(2)
            actualEvents = summaryLastData[[actualMonth, actualDay]].events.toFixed(0)
          } catch (e) {}
          this.distaceWeekData.dataset.source.push( { day: 'Día ' + actualDay, 'Distancia': actualDistance, 'Consumo': actualConsumption })
          this.LineChart3.dataset.source.push( { day: 'Día ' + actualDay, 'Eventos': actualEvents })
        }

        // this.isLoading1 = false


        this.isLoadingDriverWeek = true
        let driverLast = await this.dashboardApi.driverRange(this.initTimestamp, this.endTimestamp)
        let driverLastData = {}
        driverLast.data.data.forEach( element => {
          let driverName = element.driver_additional_info.driver_name
          if (driverLastData[driverName] === undefined) {
            driverLastData[driverName] = {}
          }
          if (driverLastData[driverName][[element.month, element.day]] === undefined) {
              driverLastData[driverName][[element.month, element.day]] = {
                  distance: element.distance,
                  consumption: element.consumption,
                  movement: element.movement,
              } 
          } else {
            driverLastData[driverName][[element.month, element.day]].distance += element.distance
            driverLastData[driverName][[element.month, element.day]].consumption += element.consumption
            driverLastData[driverName][[element.month, element.day]].movement += element.movement            
          }
        })        
        let colors = ['#1f00ab', '#a80000', '#b5b52b', '#db1ddb', '#32ed54','#fcfcc7','#999933','#882255','#661100','#6699CC','#888888']
        let index = 0
        for (let driver in driverLastData) {
          if (index < 6) {
            this.LineChartDrivers.series.push({
              type: 'line',
              lineStyle: {
                color: colors[index],
              },
              smooth: true,
            })
          }
          index += 1
          for (let i=7; i>1; i--) {
            let actualDate = new Date(today)
            actualDate.setDate(actualDate.getDate() - i +1 )
            let actualMonth = actualDate.getMonth() + 1
            let actualDay = actualDate.getDate()
            let actualDistance = 0
            try {
              actualDistance = driverLastData[driver][[actualMonth, actualDay]].distance.toFixed(2)
            } catch (e) {}
            if (index < 6) {
              this.LineChartDrivers.dataset.source[7-i].day = 'Día ' + actualDay
              this.LineChartDrivers.dataset.source[7-i][driver] = actualDistance
            }
          }          
        }

        this.isLoadingDriverWeek = false

        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.log(err)
      }
    }, 
    getColor(val) {
      if (val > 70 && val <= 100) {
        return 'green'
      } else if (val > 50 && val <= 70) {
        return 'blue'
      }
      return 'red'
    },
    getChipColor(status) {
      if (status == 'Canceled') {
        return 'negative'
      } else if (status == 'Sent') {
        return 'positive'
      } else if (status == 'Pending') {
        return 'warning'
      } else if (status == 'Paid') {
        return 'info'
      } else {
        return 'dark'
      }
    },
  },
}
</script>
