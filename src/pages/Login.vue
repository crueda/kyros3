<template>
  <q-layout>
    
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >



          <q-card-section>
            <q-avatar size="110px" class="absolute-center shadow-10 ">
              <img class="logo" src="../statics/kyros.jpg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <!-- <div class="col text-h6 ellipsis">
                &nbsp;
              </div> -->
            </div>
          </q-card-section>          
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h2 ellipsis">
                <img class="logo--img" src="../statics/logo-kyros3.png" />
              </div>
            </div>
          </q-card-section>

          <q-inner-loading :showing="isLoading">
            <q-spinner-puff size="100px" color="primary" />
          </q-inner-loading>

          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="Username" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />

              <div class="main__btn">
                <q-btn label="Entrar" @click="doLogin" type="button" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import { mapGetters } from 'vuex'
import store from '@/store/index.js'
import LoginApi from '@/repository/LoginApi'
import { utilMixin } from '@/mixins/util'

export default {
  data() {
    return {
      username: "",
      password: "",
      loginApi: null,
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'url',
    ]),
  },   
  mixins: [utilMixin],
  created() {  
    // store.commit('setUrl', 'http://localhost:9900/api')
    store.commit('setUrl', 'https://apis.kyroslbs.com')
  },
  mounted() {  
    this.loginApi = new LoginApi(this.url)
  },
  methods: {
    async doLogin() {
      try {
        this.isLoading = true
        let loginResponse = await this.loginApi.login(this.username, this.password)
        let token = loginResponse.data.token
        store.commit('setLoggedIn', true)
        store.commit('setToken', token)
        // store.commit('setRole', role)
        store.commit('setUsername', this.username)
        this.$router.push({ name: 'dashboard' })
      } catch (err) {
        this.isLoading = false
        console.log(err)
        this.showToast('red', 'Error de login')
      }
    }, 
  }
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #044177 0%, #ffffff 100%);
}

.main__btn {
  display: flex;
  justify-content: center;
}

.logo {
  border: 5px solid white;
}

.logo--img {
  height: 120px;
}
</style>
