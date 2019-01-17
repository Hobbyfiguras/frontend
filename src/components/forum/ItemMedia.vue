<template>
  <article class="media">
    <div class="media-left">
        <img width="48" :src="`https://static.myfigurecollection.net/pics/figure/${item.id}.jpg`">
    </div>
    <div class="media-content content is-primary">
      {{ item.name }}
      <br/>
      <a target="_blank" rel="noopener noreferrer" href="http://your_url_here.html">Ver en MyFigureCollection <b-icon size="is-small" icon="open-in-new"></b-icon></a>
    </div>
    <div class="media-right" v-if="hasDeleteListener()">
      <button class="delete" @click="$emit('delete', item)"></button>
    </div>
  </article>
</template>

<script>
export default {
  props: ['item'],
  methods: {
    hasDeleteListener () {
      return this.$listeners && this.$listeners.delete
    }
  }
}
</script>
