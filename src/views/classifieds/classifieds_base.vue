<template>
    <div class="container">
        
        <div class="columns">
            <div class="column">
                <div class="field has-addons is-expanded">
                    <div class="control is-expanded">
                        <input class="input" @keydown.enter="doSearch()" v-model="searchText" type="text" placeholder="Encontrar una nueva lolaila...">
                    </div>
                    <div class="control">
                        <a class="button is-info" @click="doSearch()">
                        Buscar
                        </a>
                    </div>
                </div>
            </div>
            <div class="column is-2">
                <b-button tag="router-link" :to="{name: 'classifieds_create'}" @click="createAD()" class="is-primary">Nuevo anuncio</b-button>
            </div>
        </div>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  name: 'classifieds_base',
  data () {
      return {
          searchText: ""
      }
  },
  methods: {
      doSearch() {
          if (this.searchText.trim() != "" ) {
            this.$router.push({ name: 'classifieds_search', params: { text: this.searchText } })
          } else {
            this.$router.push({ name: 'classifieds_index' })
          }
      }
  }
}
</script>

<style scoped>

</style>
