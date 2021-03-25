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
              :style="{ height: chartHeight }"
              :option="getSalesOptions"
              :resizable="true"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs" style="background-color: #ffffff">
          <q-card-section class="text-h6 text-black">
            Distancia semanal
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
              :style="{ height: chartHeight }"
              :option="LineChart2"
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
            Infracciones semanal
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
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
            Actividad semanal por conductor
          </q-card-section>
          <q-card-section class="q-pa-none">
            <IEcharts
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
    this.dashboardApi = new DashboardApi(this.url, this.token)
    this.loadData()
  },
  computed: {
    ...mapGetters(["url", "token"]),
    getSalesOptions() {
      return {
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
            data: [140, 45],
            color: '#546bfa',
          },
          {
            name: 'Consumo',
            type: 'bar',
            data: [54, 10],
            color: '#f88c2b',
          },
        ],
      }
    },
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
      year: 2000,
      month: 1,
      day: 1,
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
      series: [
        {
          data: [44, 55, 41, 64, 22, 43, 21],
        },
        {
          data: [53, 32, 33, 52, 13, 44, 32],
        },
      ],
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
            { label: '0D', max: 500, sales: 490 },
            {
              label: '1D',
              max: 500,
              sales: 472,
            },
            { label: '2D', max: 500, sales: 450 },
            {
              label: '3D',
              max: 500,
              sales: 424,
            },
            { label: '4D', max: 500, sales: 400 },
            {
              label: '5D',
              max: 500,
              sales: 330,
            },
            { label: '6D', max: 500, sales: 200 },
            {
              label: '7D',
              max: 500,
              sales: 123,
            },
            { label: '16D', max: 500, sales: 100 },
            {
              label: '17D',
              max: 500,
              sales: 53,
            },
            { label: '18D', max: 500, sales: 25 },
            { label: '19D', max: 500, sales: 10 },
          ],
        },
      },
      LineChart: {
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
        series: [{ type: 'line', areaStyle: {}, smooth: true }],
        dataset: {
          source: [
            { month: 'Jan', 'Unique Visit': 296, 'Page View': 548 },
            {
              month: 'Feb',
              'Unique Visit': 1181,
              'Page View': 714,
            },
            { month: 'Mar', 'Unique Visit': 235, 'Page View': 961 },
            {
              month: 'Apr',
              'Unique Visit': 294,
              'Page View': 580,
            },
            { month: 'May', 'Unique Visit': 765, 'Page View': 730 },
            {
              month: 'Jun',
              'Unique Visit': 412,
              'Page View': 1249,
            },
            { month: 'Jul', 'Unique Visit': 1125, 'Page View': 267 },
            {
              month: 'Aug',
              'Unique Visit': 800,
              'Page View': 251,
            },
            { month: 'Sep', 'Unique Visit': 948, 'Page View': 1043 },
            {
              month: 'Oct',
              'Unique Visit': 1046,
              'Page View': 1118,
            },
            { month: 'Nov', 'Unique Visit': 363, 'Page View': 573 },
            {
              month: 'Dec',
              'Unique Visit': 909,
              'Page View': 283,
            },
          ],
        },
        color: ['#2196f3'],
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
        series: [
          {
            type: 'line',
            lineStyle: {
              color: '#F88C2B',
            },
            smooth: true,
          },
          {
            type: 'line',
            lineStyle: {
              color: '#546BFA',
            },
            smooth: true,
          },
          {
            type: 'line',
            lineStyle: {
              color: '#7BD4D5',
            },
            smooth: true,
          },
        ],
        dataset: {
          source: [
            {
              month: 'Feb',
              'Unique Visit': 1181,
              'Page View': 714,
              Driver3: 100,
            },
            {
              month: 'Mar',
              'Unique Visit': 235,
              'Page View': 961,
              Driver3: 150,
            },
            {
              month: 'Apr',
              'Unique Visit': 294,
              'Page View': 580,
              Driver3: 100,
            },
            {
              month: 'May',
              'Unique Visit': 765,
              'Page View': 730,
              Driver3: 700,
            },
            {
              month: 'Jun',
              'Unique Visit': 412,
              'Page View': 1249,
              Driver3: 100,
            },
            {
              month: 'Jul',
              'Unique Visit': 1125,
              'Page View': 267,
              Driver3: 500,
            },
            {
              month: 'Aug',
              'Unique Visit': 800,
              'Page View': 251,
              Driver3: 10,
            },
            {
              month: 'Sep',
              'Unique Visit': 948,
              'Page View': 1043,
              Driver3: 100,
            },
            {
              month: 'Oct',
              'Unique Visit': 1046,
              'Page View': 1118,
              Driver3: 160,
            },
            {
              month: 'Nov',
              'Unique Visit': 363,
              'Page View': 573,
              Driver3: 100,
            },
            {
              month: 'Dec',
              'Unique Visit': 909,
              'Page View': 283,
              Driver3: 120,
            },
          ],
        },
        color: ['#7BD4D5'],
      },
      LineChart2: {
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
            { month: 'Jan', 'Unique Visit': 296, 'Page View': 548 },
            {
              month: 'Feb',
              'Unique Visit': 1181,
              'Page View': 714,
            },
            { month: 'Mar', 'Unique Visit': 235, 'Page View': 961 },
            {
              month: 'Apr',
              'Unique Visit': 294,
              'Page View': 580,
            },
            { month: 'May', 'Unique Visit': 765, 'Page View': 730 },
            {
              month: 'Jun',
              'Unique Visit': 412,
              'Page View': 1249,
            },
            { month: 'Jul', 'Unique Visit': 1125, 'Page View': 267 },
            {
              month: 'Aug',
              'Unique Visit': 800,
              'Page View': 251,
            },
            { month: 'Sep', 'Unique Visit': 948, 'Page View': 1043 },
            {
              month: 'Oct',
              'Unique Visit': 1046,
              'Page View': 1118,
            },
            { month: 'Nov', 'Unique Visit': 363, 'Page View': 573 },
            {
              month: 'Dec',
              'Unique Visit': 909,
              'Page View': 283,
            },
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
            { month: 'Jan', 'Unique Visit': 296, 'Page View': 548 },
            {
              month: 'Feb',
              'Unique Visit': 1181,
              'Page View': 714,
            },
            { month: 'Mar', 'Unique Visit': 235, 'Page View': 961 },
            {
              month: 'Apr',
              'Unique Visit': 294,
              'Page View': 580,
            },
            { month: 'May', 'Unique Visit': 765, 'Page View': 730 },
            {
              month: 'Jun',
              'Unique Visit': 412,
              'Page View': 1249,
            },
            { month: 'Jul', 'Unique Visit': 1125, 'Page View': 267 },
            {
              month: 'Aug',
              'Unique Visit': 800,
              'Page View': 251,
            },
            { month: 'Sep', 'Unique Visit': 948, 'Page View': 1043 },
            {
              month: 'Oct',
              'Unique Visit': 1046,
              'Page View': 1118,
            },
            { month: 'Nov', 'Unique Visit': 363, 'Page View': 573 },
            {
              month: 'Dec',
              'Unique Visit': 909,
              'Page View': 283,
            },
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
      messages: [
        {
          id: 5,
          name: 'Pratik Patel',
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            '            weekend. Do you want to grab brunch?',
          avatar: 'https://avatars2.githubusercontent.com/u/34883558?s=400&v=4',
          time: '10:42 PM',
        },
        {
          id: 6,
          name: 'Winfield Stapforth',
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            '            weekend. Do you want to grab brunch?',
          avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
          time: '11:17 AM',
        },
        {
          id: 1,
          name: 'Boy',
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            '            weekend. Do you want to grab brunch?',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          time: '5:17 AM',
        },
        {
          id: 2,
          name: 'Jeff Galbraith',
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            '            weekend. Do you want to grab brunch?',
          avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
          time: '5:17 AM',
        },
        {
          id: 3,
          name: 'Razvan Stoenescu',
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            '            weekend. Do you want to grab brunch?',
          avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
          time: '5:17 AM',
        },
      ],
      contacts: [
        {
          name: 'Pratik Patel',
          position: 'Developer',
          avatar: 'https://avatars2.githubusercontent.com/u/34883558?s=400&v=4',
        },
        {
          name: 'Razvan Stoenescu',
          position: 'Developer',
          avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
        },
        {
          name: 'Jeff Galbraith',
          position: 'Developer',
          avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
        },
        {
          name: 'Brunhilde Panswick',
          position: 'Administrator',
          avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
        },
        {
          name: 'Winfield Stapforth',
          position: 'Administrator',
          avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
        },
      ],
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
        console.log(vehiclesStateResponse)
        this.counter.movement = vehiclesStateResponse.data.data.entries.movement
        this.counter.idle = vehiclesStateResponse.data.data.entries.idle
        this.counter.stopped = vehiclesStateResponse.data.data.entries.stopped
        this.counter.disconnected = vehiclesStateResponse.data.data.entries.disconnected

        let summaryMonthResponse = await this.dashboardApi.summaryMonth(this.year, this.month)
        console.log(summaryMonthResponse)
        summaryMonthResponse.data.data.forEach( element => {

        })
        debugger
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
