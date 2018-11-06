<template>
<form @submit.prevent="onSearch()">
  <b-field>
    <div class="control">
      <b-input placeholder="Buscar en este foro..."
          type="search"
          icon="magnify"
          v-model="text">
      </b-input>
    </div>
    <div class="control">
      <div class="button is-primary" @click="onSearch()"><b-icon icon="magnify"></b-icon></div>
    </div>
  </b-field>
</form>
</template>

<script>
export default {
  props: ['forum'],
  data () {
    return {
      text: undefined
    }
  },
  methods: {
    onSearch () {
      this.$router.push({ name: 'search', query: { forum: this.forum.slug }, params: { text: this.text } })
    }
  }
}
</script>

<style scoped>

</style>
