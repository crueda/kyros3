<template>
  <q-page class="q-pa-sm">
    <div class="grid-container">
      <div>
        <q-item-label class="text-center q-pa-sm" style="max-width: 350px">
          <q-input dense rounded outlined v-model="search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-label>

        <q-scroll-area v-bind:style="{ height: listHeight }">
          <div class="q-pa-md" style="max-width: 350px">
            <q-list bordered separator>
              <q-item
                v-for="element in filteredElementsData"
                :key="element.username"
                clickable
                v-ripple
                :active="element.selected"
                active-class="bg-green-2 text-grey-8"
                @click="selectUser(element)"
              >
                <q-item-section>
                  <q-item-label>{{ element.username }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-scroll-area>
      </div>
      <div>
        <div class="main__form" v-if="selectedUser.username!==''">
          <div class="main__form--row">
            <q-input
              filled
              v-model="selectedUser.username"
              label="Username"
              stack-label
            />
            <q-input
              filled
              v-model="selectedUser.name"
              label="Nombre"
              stack-label
            />
            <q-input
              filled
              v-model="selectedUser.surname"
              label="Apellidos"
              stack-label
            />
          </div>

          <div class="main__form--row2">
            <q-select standout v-model="selectedUser.role" :options="options" label="Role" />
            <q-input
              filled
              v-model="selectedUser.email"
              label="Correo electrónico"
              stack-label
            />
          </div>

          <div class="main__form--row3">
            <q-input
              filled
              v-model="selectedUser.password"
              type="password"
              label="Contraseña"
              stack-label
            />
            <q-input
              filled
              v-model="selectedUser.password2"
              type="password"
              label="Contraseña"
              stack-label
            />
          </div>

          <div class="q-pa-md q-gutter-sm main__form--btns">
            <q-btn color="primary" label="Guardar" @click="saveElement" />
            <q-btn
              color="deep-orange"
              glossy
              label="Eliminar"
              @click="deleteElement"
            />
            <q-btn color="amber" glossy label="Nuevo" @click="newElement" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex"
import store from "@/store/index.js"

import UserApi from "@/repository/UserApi"

export default {
  name: "config-users",
  data() {
    return {
      window: {
        width: 0,
        height: 0
      },
      listHeight: "0px",
      userApi: null,
      search: "",
      selectedUser: {},
      allElements: [],
      options: ['user', 'admin']
    };
  },
  computed: {
    ...mapGetters(["url", "token", "userData"]),
    filteredElementsData() {
      return this.allElements.filter(item => {
        return (
          item.username.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          item.username.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        );
      });
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
  },
  mounted() {
    store.commit("setTitle", "Configuración de usuarios")
    this.userApi = new UserApi(this.url, this.token)
    this.loadData()
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      this.listHeight = this.window.height - 130 + "px";
    },
    loadData() {
      this.allElements.length = 0
      debugger
      for (let key in this.userData) {
        let el = { ...this.userData[key] }
        el.selected = false;
        this.allElements.push(el);
      }
      // this.selectUser(this.allElements[0]);
      this.selectUser.username = ''
    },
    selectUser(user) {
      this.allElements.forEach(el => {
        if (el.username == user.username) {
          this.selectedUser = { ...user };
          this.selectedUser.password = ''
          this.selectedUser.passwor2 = ''
          el.selected = true;
        } else {
          el.selected = false;
        }
      });
    },
    unselectAll() {
      this.allElements.forEach(el => {
        el.selected = false;
      });
    },
    isExistUser(user) {
      for (let i = 0; i < this.allElements.length; i++) {
        let el = this.allElements[i];
        if (el.username == user.username) {
          return true;
        }
      }
      return false;
    },
    newElement() {
      this.unselectAll();
      this.selectedUser = {
        username: '',
        name: '',
        role: 'user',
        surname: '',
        email: '',
        password: '',
        password2: '',
      }
    },
    showToast(color, msg) {
      this.$q.notify.setDefaults({
        position: "top",
        timeout: 2000,
        textColor: "white",
        color,
        actions: [{ icon: "close", color: "white" }]
      });
      this.$q.notify(msg);
    },
    addElementToStore() {
      let data = { ...this.userData }
      data[this.selectedUser.username] = this.selectedUser;
      store.commit("setUserData", data)
    },
    delElementToStore() {
      let data = { ...this.userData }
      delete data[this.selectedUser.username]
      store.commit("setUserData", data)
    },
    async saveElement() {
      if (this.selectedUser.username === '') {
        this.showToast("red", "Introduce un username para el usuario");
        return
      }
      if (this.selectedUser.password !== this.selectedUser.password2) {
        this.showToast("red", "Las contraseñas no coinciden");
        return
      }
      if (!this.isExistUser(this.selectedUser)) {
        try {
          await this.userApi.newUser(this.url, this.token, this.selectedUser)
          this.showToast("green", "Usuario añadido correctamente")
          this.addElementToStore()
          this.loadData()
        } catch (err) {
          this.showToast('red', 'Error añadiendo el usuario')
          console.error(err)
        }
      } else {
        try {
          await this.userApi.editUser(this.url, this.token, this.selectedUser)
          this.showToast("green", "Usuario editado correctamente")
          this.addElementToStore();
          this.loadData();
        } catch (err) {
          this.showToast('red', 'Error editando el usuario')
          console.error(err);
        }
      }
    },
    async deleteElement() {
      if (this.selectedUser.username === 'admin') {
        this.showToast("red", "El usuario admin no puede ser eliminado");
        return
      }
      if (this.isExistUser(this.selectedUser)) {
        try {
          let result = await this.userApi.deleteUser(
            this.url,
            this.token,
            this.selectedUser
          );
          this.showToast("green", "Usuario eliminado")
          this.delElementToStore()
          this.loadData();
        } catch (err) {
          this.showToast("red", "Error eliminando el usuario")
          console.error(err)
        }
      } else {
        this.showToast(
          "deep-orange",
          "Seleccionar el usuario que se desea eliminar"
        );
      }
    }
  }
};
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
  padding-top: 0.5rem;
  display: grid;
  grid-template-columns: 33% 33% 1fr;
  grid-template-rows: 1fr;
  gap: 0.5rem;
}

.main__form--row2 {
  padding-top: 0.5rem;
  display: grid;
  grid-template-columns: 33% 1fr;
  grid-template-rows: 1fr;
  gap: 0.5rem;
}

.main__form--row3 {
  padding-top: 0.5rem;
  display: grid;
  grid-template-columns: 50% 1fr;
  grid-template-rows: 1fr;
  gap: 0.5rem;
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
  grid-template-areas: ".";
}
</style>
