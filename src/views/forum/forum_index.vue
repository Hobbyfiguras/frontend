<template>
  <div class="container">
<div class="tile is-ancestor">
  <div class="tile is-vertical is-12">
    <div class="tile is-vertical">
      <div v-for="category in categories" :key="category.id" class="tile is-parent is-vertical">
        <article class="tile is-child notification is-primary">
          <p class="subtitle">{{category.name}}</p>
          {{category.description}}
        </article>
        <router-link v-for="forum in category.forums" :key="forum.id" :to="{name: 'forum', params: {slug: forum.slug}}">
                  <article class="tile is-child notification forum-header  is-info">
          <div class="columns is-vertical-center">
            <div class="column is-1">
              <figure class="image is-64x64">
                <img :src="forum.icon" class="is-rounded" alt="">
              </figure>
            </div>
            <div class="column is-9">
              <p class="subtitle">{{forum.name}}</p>
              {{forum.description}}
            </div>
            <div class="is-divider-vertical"></div>
            <div class="column has-text-centered is-1">
              <p class="subtitle">{{forum.thread_count}}</p>
              Temas
            </div>
          </div>

        </article>
        </router-link>

      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import Forum from '@/api/forum'
import PetitionsMixin from '@/components/mixins/petitions'
export default {
  name: 'forum_index',
  mixins: [PetitionsMixin],
  data () {
    return {
      categories: []
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getForumCategories()).then((categories) => {
        this.categories = categories
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../sass/variables_light";

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

</style>
