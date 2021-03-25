export const utilMixin = {
  data () {
    return {
    }
  },
  computed: {
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent)) {
        return true
      } 
      return false      
    }
  },
  methods: {
    generateId: function () {
      return parseInt(Math.random() * 10000000)
    },
    emailIsValid: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    calculateBattery (voltage) {
      let vol = parseFloat((voltage * 100 / 3).toFixed(1))
      if (vol > 100) {
        vol = 100
      }
      return vol
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
    compareInitTimestamp: function (a, b) {
      let comparison = 0
      if (a.initTimestamp < b.initTimestamp) {
        comparison = -1
      } else if (a.initTimestamp > b.initTimestamp) {
        comparison = 1
      }
      return comparison
    },
    compareId: function (a, b) {
      let comparison = 0
      if (a.id < b.id) {
        comparison = -1
      } else if (a.id > b.id) {
        comparison = 1
      }
      return comparison
    },
    compare: function (a, b) {
      if (a.distance === undefined) {
        a.distance = 0
      }
      if (b.distance === undefined) {
        b.distance = 0
      }
      if (a.consumption === undefined) {
        a.consumption = 0
      }
      if (b.consumption === undefined) {
        b.consumption = 0
      }
      let comparison = 0
      if (a.distance > b.distance) {
        comparison = -1
      } else if (a.distance < b.distance) {
        comparison = 1
      }
      return comparison
    },
    toTime (seconds) {
      var timeString = ''
      try {
        var date = new Date(null)
        date.setSeconds(seconds)
        timeString = date.toISOString().substr(11, 8)
      } catch (error) {
        timeString = seconds
      }
      return timeString
    },
    getUrlParameter (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
      var results = regex.exec(window.location.href)
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
    },
    arrayToObject (array, keyField) {
      array.reduce((obj, item) => {
        obj[item[keyField]] = item
        return obj
      }, {})
    }
  }
}
