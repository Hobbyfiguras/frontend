<template>
  <router-link :to="getThreadLinkData(thread)">
  <article class="tile is-child notification forum-header is-info">
    <div class="columns is-multiline is-mobile">
      <div class="column is-7-tablet is-12-mobile">
        <p class="subtitle">{{thread.title}} <b-tag v-if="thread.nsfw" type="is-danger">NSFW</b-tag></p>
        por {{thread.creator.username}}, {{thread.created | moment("from")}}
      </div>
      <div class="is-divider-vertical"></div>
      <div class="column has-text-centered">
        <p class="subtitle">{{thread.post_count - 1}}</p>
        <template v-if="thread.post_count - 1 === 1">
          Respuesta
        </template>
        <template v-else>
          Respuestas
        </template>
      </div>
      <div class="is-divider-vertical"></div>
      <div class="column is-2-tablet  has-text-right">
        <p>{{thread.last_post.creator.username}}</p>
        {{thread.modified | moment("from")}}
      </div>
    </div>

  </article>
  </router-link>
</template>

<script>
export default {
  props: ['thread'],
  methods: {
    getThreadLinkData (thread) {
      return {
        name: 'thread',
        params: {
          id: thread.id,
          slug: thread.slug,
          forum: thread.forum.slug
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../sass/variables_light";

.notification {
  padding: 1.25rem 2.5rem 1.25rem 1.5rem;
  border-radius: 2px !important;
  border: 0 !important;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}

.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}

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
</style>
