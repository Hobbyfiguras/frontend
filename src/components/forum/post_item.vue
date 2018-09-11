<template>
  <div>
    <div class="tile is-child notification is-info post-time is-size-7">
      <div class="level">
        <div class="level-left">{{post.created | moment("from")}}</div>
      </div>
    </div>
    <article class="tile is-child notification is-white thread-content" :class="{'is-warning': post.deleted}">
      <div class="post-options" v-if="currentUser">
        <b-dropdown v-if="currentUser.id === post.creator.id && !post.deleted">
          <a class="" slot="trigger">
              <b-icon icon="dots-vertical"></b-icon>
          </a>
          <b-dropdown-item v-if="!editing" @click="startEditing()"><b-icon icon="pencil"></b-icon> Editar</b-dropdown-item>
          <b-dropdown-item v-else @click="cancelEditing()"><b-icon icon="pencil"></b-icon> Dejar de editar</b-dropdown-item>
          <b-dropdown-item @click="askDeletePost()"><b-icon icon="delete"></b-icon> Eliminar</b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="columns" v-if="!post.deleted">
        <div class="column is-2 has-text-centered forum-user">
          <div class="columns is-multiline is-mobile">
            <div class="column is-12-tablet is-one-third-mobile is-hidden-tablet">
              <figure class="image is-128x128">
                <div class="is-paddingless">
                  <router-link class="user-link" :to="{name: 'profile', params: {username: post.creator.username}}">
                    <img class="is-rounded" :src="post.creator.avatar"/>
                  </router-link>
                </div>
              </figure>
            </div>
            <div class="column is-12-tablet">
              <p class="subtitle">
                <router-link class="user-link" :class="{'user-moderator': post.creator.is_staff}" :to="{name: 'profile', params: {username: post.creator.username}}">
                {{post.creator.username}}
                </router-link>
              </p>
            </div>
            <div class="column is-12-tablet is-hidden-mobile">
              <figure class="image is-256x256">
                <div class="is-paddingless">
                  <router-link class="user-link" :to="{name: 'profile', params: {username: post.creator.username}}">
                    <img class="is-rounded" :src="post.creator.avatar"/>
                  </router-link>
                </div>
              </figure>
            </div>
            <div class="column is-12-tablet has-text-centered is-hidden-mobile">
              <UserSocial class="is-horizontal-center" :user="post.creator"></UserSocial>
            </div>

            <div class="column is-12-tablet has-text-centered">
              <div class="is-vertical-center">
                <b-icon custom-class="mdi-profile" icon="earth"></b-icon>
                <span> Barcelona</span>
              </div>
              <div class="">
                <span>Mensajes: 70.000</span>
              </div>
            </div>
          </div>
        </div>
          <div class="column is-10 has-vertically-aligned-content">
            <div class="columns">
              <div class="column is-12 content">
              <Markdown v-if="!editing" :source="post.content"></Markdown>
              <template v-else>
                <MarkdownEditor v-model="post.content"></MarkdownEditor>
                <div class="is-divider"></div>
                  <div class="level">
                    <div class="level-left"></div>
                    <div class="level-right">
                      <div class="level-item">
                        <button class="button is-primary" :disabled="post.content.trim() == ''" @click="saveEditing">Guardar</button>
                      </div>
                      <div class="level-item">
                        <button class="button is-danger" @click="cancelEditing">Cancelar</button>
                      </div>
                    </div>
                </div>
              </template>
            </div>
            </div>
            <div class="columns" style="margin-top: auto;">
              <div class="column is-12">
                          <div class="has-vertically-aligned-content">
            <div class="level is-mobile">
              <div class="level-left">
                <div>
                  <b-tooltip label="Neko">
                    <b-icon icon="cat"></b-icon> <sub>x 2</sub>
                  </b-tooltip>
                </div>
              </div>
              <div class="level-right">
                <b-tooltip label="Neko">
                  <b-icon class="vote-icon" icon="cat"></b-icon>
                </b-tooltip>
                <b-tooltip label="Neko">
                  <b-icon class="vote-icon" icon="cat"></b-icon>
                </b-tooltip>
                <b-tooltip label="Neko">
                  <b-icon class="vote-icon" icon="cat"></b-icon>
                </b-tooltip>
                <b-tooltip label="Neko">
                  <b-icon class="vote-icon" icon="cat"></b-icon>
                </b-tooltip>

              </div>
            </div>
          </div>
              </div>
            </div>
        </div>
      </div>
      <div v-else>
        Post eliminado por {{post.modified_by.username}} con el motivo: "{{post.delete_reason}}"
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MarkdownEditor from '@/components/markdown_editor'
import Forum from '@/api/forum'
import petitionsMixin from '@/components/mixins/petitions'
import UserSocial from '@/components/profile/user_social'
import Markdown from '@/components/markdown'

export default {
  name: 'post_item',
  mixins: [petitionsMixin],
  components: { MarkdownEditor, UserSocial, Markdown },
  props: ['post'],
  data () {
    return {
      editing: false,
      oldPost: null
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    startEditing () {
      this.editing = true
      this.oldPost = JSON.parse(JSON.stringify(this.post))
    },
    saveEditing () {
      this.$awn.async(this.makePetition(Forum.updatePost(this.post.id, this.post.content), 'Post actualizado con exito',
        'Error actualizando post', 'Actualizando post').then((thread) => {
        this.editing = false
        this.$awn.success('Post actualizado con exito')
      }))
    },
    cancelEditing () {
      this.$emit('changePost', JSON.parse(JSON.stringify(this.oldPost)))
      this.editing = false
    },
    askDeletePost () {
      this.$dialog.prompt({
        title: 'Borrar post',
        inputAttrs: {
          placeholder: 'Motivo'
        },
        confirmText: 'Si',
        cancelText: 'No',
        type: 'is-danger',
        onConfirm: (reason) => this.deletePost(reason)
      })
    },
    deletePost (reason = '') {
      var post = JSON.parse(JSON.stringify(this.post))
      post.delete_reason = reason
      this.$awn.async(this.makePetition(Forum.deletePost(this.post.id, reason), 'Post eliminado con exito',
        'Error eliminando post', 'Eliminando post').then((thread) => {
        this.$awn.success('Post eliminado con exito')
        this.$emit('deletePost', post)
      }))
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
  border-right: 0rem solid $grey-lighter;
}

.post-menu {
  font-size: 0.75rem !important;
}

.user-link {
  margin-bottom: 1.25rem !important;
}

.post-options {
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
}

.has-vertically-aligned-content {
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.vote-icon {
  transition: transform .10s ease-in-out;
  transform: scale(0);
  cursor: pointer;
  opacity: 0.5;
  &:not(:last-child) {
    margin-right: 0.25rem;
  }
  &:hover {
    opacity: 1;
  }
}
.thread-content:hover {
  .vote-icon {
    transform: scale(1);
  }
}
</style>
