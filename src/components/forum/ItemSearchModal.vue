<template>
<div class="modal-card" style="width: auto">
  <header class="modal-card-head">
    <p class="modal-card-title">Añadir articulos relacionados</p>
  </header>
  <section class="modal-card-body">
    <ItemMedia v-for="figure in selected" :key="figure.id" :item="figure" @delete="deleteItem">
    </ItemMedia>
    <b-field label="Buscar Articulo">
        <b-autocomplete
            v-model="search"
            :data="results"
            placeholder="Nombre del articulo o link de MFC"
            field="title"
            :loading="isFetching"
            open-on-focus
            :clear-on-select="false"
            @keyup.native="fetchData"
            @select="onSelectOption">

            <template slot-scope="props" class="has-background-success">
                <div class="media">
                  <div class="media-left" :class="{'has-background-success': isFigureSelected(props.option)}">
                      <img width="32" :src="`https://static.myfigurecollection.net/pics/figure/${props.option.id}.jpg`">
                  </div>
                  <div class="media-content is-primary">
                    {{ props.option.name }}
                    <br>
                    <b-taglist>
                        <b-tag v-for="category in props.option.categories" :key="category.id" type="is-primary">{{ category["@attributes"].name }}</b-tag>
                    </b-taglist>
                  </div>
                </div>
            </template>
        </b-autocomplete>
    </b-field>
  </section>
  <footer class="modal-card-foot">
    <button class="button" type="button" @click="$parent.close()">Cerrar</button>
    <button class="button is-primary" @click="onAccept">Aceptar</button>
  </footer>
</div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import debounce from 'debounce'
import MFC from '@/api/mfc'
import ItemMedia from '@/components/forum/ItemMedia'
export default {
  mixins: [petitionsMixin],
  props: ['alreadySelectedItems'],
  components: { ItemMedia },
  data () {
    return {
      results: [],
      isFetching: false,
      search: '',
      selected: []
    }
  },
  created () {
    this.makePetition(Forum.getForumCategories()).then((categories) => {
      this.categories = categories
    })
  },
  methods: {
    isFigureSelected (figure) {
      for (let selectedFigure of this.selected) {
        if (figure.id === selectedFigure.id) {
          return true
        }
      }
      if (this.alreadySelectedItems) {
        for (let selectedFigure of this.alreadySelectedItems) {
          if (figure.id === selectedFigure.id) {
            return true
          }
        }
      }

      return false
    },
    onAccept () {
      this.$emit('onSelectItems', this.selected)
      this.$parent.close()
    },
    mfcParser (url) {
      const mfcRegex = /^http(?:s?):\/\/(?:.*\.)?(?:.\.)?myfigurecollection\.net\/item\/([a-zA-Z0-9]{1,13}).*/
      const match = url.match(mfcRegex)
      return match && typeof match[1] === 'string' ? match[1] : false
    },
    deleteItem (item) {
      let index = this.selected.findIndex((i) => {
        return item.id === i.id
      })
      this.selected.splice(index, 1)
    },
    fetchData: debounce(function () {
      this.isFetching = true
      var match = this.mfcParser(this.search)
      if (match) {
        var pk = parseInt(match)
        this.makePetition(MFC.getItem(pk)).then((data) => {
          this.results = [data]
          this.isFetching = false
        })
      } else {
        this.makePetition(MFC.searchFigure(this.search)).then((data) => {
          this.results = data.items.item
          this.isFetching = false
        })
      }
    }, 500),
    onSelectOption (option) {
      if (!this.isFigureSelected(option)) {
        this.selected.push(option)
      }
    }
  }
}
</script>

<style scoped>

</style>
