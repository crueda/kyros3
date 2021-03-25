const state = {
  loggedIn: false,
  url: '',
  token: '',
  role: '',
  username: '',
  userData: {},
  title: '',
}

const mutations = {
  setLoggedIn (state, data) {
    state.loggedIn = data
  },
  setUrl (state, data) {
    state.url = data
  },
  setToken (state, data) {
    state.token = data
  },
  setRole (state, data) {
    state.role = data
  },
  setClientId (state, data) {
    state.clientId = data
  },
  setUsername (state, data) {
    state.username = data
  },  
  setUserData (state, data) {
    state.userData = data
  },
  setTitle (state, data) {
    state.title = data
  },
}

const actions = {
}

export default {
  state,
  mutations,
  actions,
}
