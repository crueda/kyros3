import VueNativeSock from 'vue-native-websocket'

export default async ({Vue}) => {
  // Vue.use(VueNativeSock, 'ws://localhost:9090', {
  // Vue.use(VueNativeSock, 'wss://echo.websocket.org', {
  Vue.use(VueNativeSock, 'wss://indoor-uwb.kyroslbs.com:8443', {
    format: 'json',
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: Infinity, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
  })

}


