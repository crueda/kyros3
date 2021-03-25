<template>
  <div class="main">
    <div class="main__btns">
      <q-btn-group push>
        <q-btn push label="Todos" icon="all_inclusive" @click="selectAll"/>
        <q-btn push label="Ninguno" icon="close" @click="selectNone"/>
      </q-btn-group>
    </div>
    <div class="main__panel">

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
              :key="element.tag_id"
              clickable
              v-ripple
              :active="element.selected"
              active-class="bg-green-2 text-grey-8"
              @click="selectTag(element)"
            >
              <q-item-section>
                <q-item-label>{{ element.tag_id }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </div>

    <div class="main__btn--close">
      <q-btn color="primary" label="Cerrar" @click="onClose"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store/index.js'

import { apiMixin } from '@/mixins/api'

export default {
  name: 'side-tooltip',
  props: {
    data: Object,
  },
  computed: {
    ...mapGetters(['tagData']),
    filteredElementsData() {
      return this.allElements.filter(item => {
        return item.tag_id.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
  },  
  data: function() {
    return {
      window: {
        width: 0,
        height: 0,
      },
      search: '',
      allElements: [],
      listHeight: '0px',
    }
  },
  mixins: [apiMixin],
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  mounted() {
    this.loadData()
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      this.listHeight = this.window.height - 220 + 'px'
    },    
    loadData() {
      this.allElements.length = 0
      for (let key in this.tagData) {
        let el = { ...this.tagData[key] }
        // el.selected = false
        this.allElements.push(el)
      }
    },    
    storeTag(tag) {
      let tags = { ...this.tagData }
      tags[tag.tag_id] = { ...tag }
      store.commit('setTagData', tags)
    },
    selectTag(tag) {
      this.allElements.forEach(el => {
        if (el.tag_id == tag.tag_id) {
          this.selectedTag = { ...tag }
          el.selected = !el.selected
          this.storeTag(el)
        } 
      })
    },
    selectAll() {
      debugger
      let tags = { ...this.tagData }
      this.allElements.forEach(el => {
        el.selected = true        
        tags[el.tag_id].selected = true
      })
      store.commit('setTagData', tags)
    },    
    selectNone() {
      let tags = { ...this.tagData }
      this.allElements.forEach(el => {
        el.selected = false        
        tags[el.tag_id].selected = false
      })
      store.commit('setTagData', tags)
    },      
    onClose() {
      this.$emit('closePanel', {})
    },
  },
}
</script>

<style scoped>
.main {
  border: 1px solid lightgrey;
  height: 100%;
}

.main__panel {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main__btns {
  padding-top: 3.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.main__btn--close {
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

</style>
