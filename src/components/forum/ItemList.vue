<template>
  <div>
    <template v-if="editable">
      <ItemMedia v-for="figure in value" :key="figure.id" @delete="deleteItem" :item="figure">
      </ItemMedia>
    </template>
    <template  v-else>
      <ItemMedia v-for="figure in value" :key="figure.id" :item="figure">
      </ItemMedia>
    </template>
    <a class="button is-primary" @click="openRelatedArticleSelector" v-if="editable"><b-icon icon="plus"></b-icon></a>
  </div>
</template>

<script>
import ItemMedia from '@/components/forum/ItemMedia'
import ItemSearchModal from '@/components/forum/ItemSearchModal'

export default {
  props: { value: Array, editable: Boolean },
  components: { ItemMedia },
  methods: {
    openRelatedArticleSelector () {
      this.$modal.open({
        parent: this,
        component: ItemSearchModal,
        width: 960,
        hasModalCard: false,
        props: {
          alreadySelectedItems: this.value
        },
        events: {
          'onSelectItems': this.onSelectItems
        }
      })
    },
    deleteItem (item) {
      let newValue = JSON.parse(JSON.stringify(this.value))
      let index = newValue.findIndex((i) => i.id === item.id)
      newValue.splice(index, 1)
      this.$emit('input', newValue)
    },
    onSelectItems (newItems) {
      let newValue = JSON.parse(JSON.stringify(this.value))
      newValue = [...newValue, ...newItems]
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped>

</style>
