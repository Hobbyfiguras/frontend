<template>
    <div class="container">
        
        <div class="columns">
            <div class="column">
                <b-field>
                    <b-select v-model="selectedCategory" placeholder="Category">
                        <option value="all">All</option>
                        <option v-for="category in categories" :key="category.slug" :value="category.slug">{{category.name}}</option>
                    </b-select>
                    <b-input @keydown.enter="doSearch()" expanded v-model="searchText" type="text" placeholder="Encontrar una nueva lolaila..."></b-input>
                    <p class="control">
                        <button class="button is-info" @click="doSearch()">Buscar</button>
                    </p>
                </b-field>
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
import Classifieds from '@/api/classifieds'
import petitionsMixin from "@/components/mixins/petitions";

export default {
  name: 'classifieds_base',
  data () {
      return {
          searchText: "",
          categories: [],
          selectedCategory: "all"
      }
  },
  mixins: [petitionsMixin],
  created () {
      this.getCategories()
  },
  methods: {
      getCategories() {
        this.makePetition(Classifieds.getCategories()).then((categories) => {
            this.categories = categories
        })
      },
      doSearch() {
          this.$router.push({ name: 'classifieds_search', params: {category: this.selectedCategory, text: this.searchText} })
      }
  }
}
</script>

<style scoped>

</style>
