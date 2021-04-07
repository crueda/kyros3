<template>
  <q-layout>
    
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >

          <q-card-section>
            <q-avatar size="110px" class="absolute-center shadow-10 ">
              <img class="logo" src="../statics/kyros.jpg" alt="main logo" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
            </div>
          </q-card-section>          
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h2 ellipsis">
                <img class="logo--img" src="../statics/logo-kyros3.png" alt="logo"/>
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

              <div class="main__btn">

              <div class="google-btn" @click="doLoginGoogle" >
              <div class="google-icon-wrapper">
                <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
              </div>
              <p class="btn-text"><b>Entrar con Google</b></p>
            </div>

                <!-- <q-btn class="ml-2" label="Google" @click="doLoginGoogle" type="button" color="primary" /> -->
                
              </div>

              <div class="main__btn">
                <p v-if="loggedIn">Logado con Google. <a class="link" @click="doLogoutGoogle">Salir</a></p>
                <p v-else></p>

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
import { auth, firebase } from "@/firebase.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      loginApi: null,
      isLoading: false,
      loggedIn: false,
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

    auth.onAuthStateChanged(async authData => {
      console.log('*****')
      console.log(authData)
      if (authData) {
        this.loggedIn = true
      } else {
        this.loggedIn = false
      }
    })
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
    async doLoginGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()
      try {
        await auth.signInWithPopup(provider)
      } catch (error) {
        console.error(error)
      }
    },
    async doLogoutGoogle() {
      try {
        await auth.signOut()
        this.loggedIn = false
      } catch (error) {
        console.error(error)
      }
    }
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

<style>
@import url(https://fonts.googleapis.com/css?family=Roboto:500);
 .google-btn {
	 width: 184px;
	 height: 42px;
	 background-color: #4285f4;
	 border-radius: 2px;
	 box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .25);
}
 .google-btn .google-icon-wrapper {
	 position: absolute;
	 margin-top: 1px;
	 margin-left: 1px;
	 width: 40px;
	 height: 40px;
	 border-radius: 2px;
	 background-color: #fff;
}
 .google-btn .google-icon {
	 position: absolute;
	 margin-top: 11px;
	 margin-left: 11px;
	 width: 18px;
	 height: 18px;
}
 .google-btn .btn-text {
	 float: right;
	 margin: 11px 11px 0 0;
	 color: #fff;
	 font-size: 14px;
	 letter-spacing: 0.2px;
	 font-family: "Roboto";
}
 .google-btn:hover {
	 box-shadow: 0 0 6px #4285f4;
}
 .google-btn:active {
	 background: #1669f2;
}

.link {
  color: darkblue;
  cursor: pointer;
}
 
</style>