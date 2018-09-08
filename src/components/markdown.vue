<template>
  <div class="content">
    <vue-markdown :source="source"></vue-markdown>
  </div>

</template>

<script>
import Vue from 'vue'
export default {
  name: 'markdown',
  props: ['source'],
  methods: {
    postRender (htmlin) {
      let el = Vue.compile('<div>' + htmlin + '</div>')
      el = new Vue({
        render: el.render,
        staticRenderFns: el.staticRenderFns
      }).$mount()

      console.log(htmlin)
      console.log(el.$el.innerHTML)
      return el.$el.innerHTML
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/sass/variables_light";

$forum-header-transition: all .25s ease-in-out;

.forum-header {
  cursor: pointer;
  transition: $forum-header-transition;

  &.is-info {
    transition: $forum-header-transition;
    background-color: $info;
    &:hover{
      background-color: darken($info, 5%);
      transform: scale(1.01);
    }
  }
}

.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}

.thread-title {
  padding: 1.0rem 2.5rem 1.0rem 1.5rem
}

.forum-user {
  border-right: .1rem solid $grey-lighter;
}

.post-time {
  padding: 0.5rem 2.5rem 0.5rem 1.5rem
}
</style>
