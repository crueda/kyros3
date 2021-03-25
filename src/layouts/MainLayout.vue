<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title> &nbsp;{{ title }} </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          >
            <!--            <q-tooltip>Messages</q-tooltip>-->
          </q-btn>
          <!--q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-menu
            >
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn label="View All" style="max-width: 120px !important;" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn-->
          <!-- <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-primary text-white"
    >
      <q-list>
        <!-- <q-expansion-item icon="location_on" label="Tiempo real" class="main__menu">
          <q-list class="q-pl-lg">
            <q-item to="/dashboard" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="map" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cuador de mandos</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/dashboard" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="grid_on" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Configurar</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item> -->

        <q-item to="/dashboard" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cuadro de mandos</q-item-label>
          </q-item-section>
        </q-item>


        <q-item to="/login" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Salir</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";

import EssentialLink from "components/EssentialLink";
import Messages from "./Messages";

export default {
  name: "MainLayout",

  components: {
    Messages,
    EssentialLink
  },

  data() {
    return {
      leftDrawerOpen: false
    };
  },
  computed: {
    ...mapGetters(['title', 'role'])
  }
};
</script>

<style scoped>
.main__menu {
  margin-top: 1rem;
}
</style>
