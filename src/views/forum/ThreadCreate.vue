<template>
  <div class="container" v-if="forum">
<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li>
      <router-link :to="{name: 'ForumIndex'}">
          <span></span>
          <b-icon icon="home"></b-icon>
      </router-link>
    </li>
    <li>
      <router-link v-if="forum.slug" :to="{name: 'forum', params: {slug: forum.slug}}"><span>{{forum.name}}</span></router-link>
    </li>
    <li class="is-active">
      <a href="#">Crear tema</a>
    </li>
  </ul>
</nav>
  <div class="card">
    <div class="card-content">
          <b-field label="Titulo">
            <b-input v-model="post.title" maxlength="100"></b-input>
          </b-field>
          <b-field label="Contenido">
            <MarkdownEditor v-model="post.content"></MarkdownEditor>
          </b-field>
        <div class="is-divider"></div>
        <div class="level">
          <div class="level-left">
          <div class="field">
            <b-switch v-model="post.nsfw" type="is-danger">
                NSFW
            </b-switch>
          </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-primary" :disabled="post.content.trim() == '' || post.title.trim() == ''" @click="createThread">Crear</button>
            </div>
          </div>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
import Forum from '@/api/forum'
import PetitionsMixin from '@/components/mixins/petitions'
import MarkdownEditor from '@/components/markdown_editor'
export default {
  name: 'thread_create',
  mixins: [PetitionsMixin],
  data () {
    return {
      forum: null,
      post: {
        content: '',
        title: '',
        nsfw: false
      }

    }
  },
  mounted () {
    this.fetchData()
  },
  props: ['slug'],
  components: { MarkdownEditor },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getForumThreads(this.slug)).then((forum) => {
        this.forum = forum
      })
    },
    createThread () {
      return this.$awn.async(this.makePetition(Forum.createThread(this.slug, this.post)), 'Tema creado correctamente',
        'Error creando tema', 'Creando tema').then((thread) => {
        this.$router.push({ name: 'thread', params: { forum: this.forum.slug, slug: thread.slug, id: thread.id } })
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

.notification {
  padding: 1.25rem 2.5rem 1.25rem 1.5rem;
  border-radius: 2px !important;
  border: 0 !important;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}

.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}
</style>
