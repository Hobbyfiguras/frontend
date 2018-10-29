<template>
  <div>
    <b-modal :active.sync="isBanModalActive" :width="640">
        <div class="modal-card">
          <div class="modal-card-head">
            <p class="modal-card-title">Banear usuario</p>
          </div>
          <div class="modal-card-body">

            <b-field label="Fecha de fin de baneo">
              <b-datepicker
                placeholder="Fecha de fin de baneo"
                v-model="banData.ban_expiry_date"
                inline
                icon="calendar-today">
              </b-datepicker>
            </b-field>
            <b-field label="Motivo de baneo">
              <b-input
                placeholder="Motivo de baneo"
                v-model="banData.ban_reason">
              </b-input>
            </b-field>
          </div>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Cancelar</button>
            <button class="button is-danger" type="button" @click="banUser()">Banear</button>
          </footer>
        </div>
    </b-modal>

    <div class="tile is-child notification is-info post-time is-size-7">
      <div class="level">
        <div class="level-left"><router-link :to="getPostLinkData(post, post.thread)">{{post.created | timeDiff("from")}}</router-link></div>
      </div>
    </div>
    <article class="tile is-child notification is-white thread-content" :class="{'is-warning': post.deleted}">
      <div class="post-options" v-if="currentUser">
        <b-dropdown>
          <a class="" slot="trigger">
              <b-icon icon="dots-vertical"></b-icon>
          </a>
          <template v-if="(currentUser.id === post.creator.id && !post.deleted || currentUser.is_staff)">
            <b-dropdown-item ref="editButton" v-if="!editing" @click="startEditing()"><b-icon icon="pencil"></b-icon> Editar</b-dropdown-item>
            <b-dropdown-item v-else ref="cancelEditButton" @click="cancelEditing()"><b-icon icon="pencil"></b-icon> Dejar de editar</b-dropdown-item>
            <b-dropdown-item ref="deleteButton" @click="askDeletePost()"><b-icon icon="delete"></b-icon> Eliminar</b-dropdown-item>
          </template>
          <b-dropdown-item ref="reportButton" @click="askReportPost()" v-if="currentUser.id !== post.creator.id"><b-icon icon="flag"></b-icon> Reportar</b-dropdown-item>
          <b-dropdown-item ref="banButton" @click="isBanModalActive = true" v-if="currentUser.id !== post.creator.id && currentUser.is_staff"><b-icon icon="gavel"></b-icon>Banear usuario</b-dropdown-item>
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
                <router-link class="user-link" :class="{'user-moderator': post.creator.is_staff, 'user-banned': isUserBanned(post.creator)}" :to="{name: 'profile', params: {username: post.creator.username}}">
                {{post.creator.username}}
                </router-link>
              </p>
            </div>
            <div class="column is-12-tablet is-hidden-mobile">
              <figure class="image is-256x256">
                <div class="is-paddingless">
                  <router-link class="user-link" :to="{name: 'profile', params: {username: post.creator.username}}">
                    <img v-if="!isUserBanned(post.creator)" class="is-rounded" :src="post.creator.avatar"/>
                    <img v-else src="../../assets/images/ban.png"/>
                  </router-link>
                </div>
              </figure>
            </div>
            <div class="column is-12-tablet has-text-centered is-hidden-mobile">
              <UserSocial class="is-horizontal-center" :user="post.creator"></UserSocial>
            </div>

            <div class="column is-12-tablet has-text-centered">
              <div class="is-vertical-center is-horizontal-center" v-if="post.creator.location">
                <b-icon custom-class="mdi-profile" icon="earth"></b-icon>
                <span> {{post.creator.location}}</span>
              </div>
              <div class="">
                <span>Mensajes: {{post.creator.post_count}}</span>
              </div>
            </div>
          </div>
        </div>
          <div class="column is-10 has-vertically-aligned-content">
            <div class="columns">
              <div class="column is-12 content">
              <template v-if="!editing">
                <Markdown :source="post.content" ref="content"></Markdown>
                <div v-for="ban in post.bans" :key="ban.id" class="card notification is-danger">(Este usuario fue baneado por este post ("{{ban.ban_reason}}") - {{ban.banner.username}})</div>
                <div v-if="post.modified && post.modified_by" class="is-size-7"><b-icon icon="pencil" size="is-small"></b-icon> Editado por {{post.modified_by.username}} {{post.modified | timeDiff("from")}}</div>
              </template>
              <template v-else>
                <MarkdownEditor v-model="post.content"></MarkdownEditor>
                <div class="is-divider"></div>
                  <div class="level">
                    <div class="level-left"></div>
                    <div class="level-right">
                      <div class="level-item">
                        <button class="button is-primary" ref="saveEditButton" :disabled="post.content.trim() == ''" @click="saveEditing">Guardar</button>
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
                    <div class="level-left is-vertical">
                      <div class="level-item" v-for="vote in post.votes" :key="vote.id">
                        <div class="tile is-vertical is-ancestor">
                          <div class="tile">
                            <b-tooltip :label="vote.name">
                              <figure class="image is-32x32 vote-list-item" @click="votePostWithID(vote.id)">
                                <img :src="vote.icon">
                              </figure>
                            </b-tooltip>
                          </div>
                          <div class="tile is-horizontal-center">
                            <b-tooltip class="user-vote-tooltip" position="is-bottom" :label="getUsersTooltip(vote)">
                            {{vote.vote_count}}
                            </b-tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="level-right" v-if="currentUser">
                      <template v-if="!hasVoted">
                        <div class="level-item level-vote" v-if="currentUser.id !== post.creator.id" v-for="vote in orderedVoteTypes" :key="vote.id">
                          <b-tooltip :label="vote.name">
                            <figure class="image is-32x32 vote-icon" @click="votePost(vote)">
                              <img :src="vote.icon">
                            </figure>
                          </b-tooltip>
                        </div>
                      </template>
                      <div class="level-item" v-if="hasVoted" :class="[hasError ? 'has-text-danger' : 'has-text-success']">
                        <b-icon v-if="!hasError" icon="check"></b-icon> <b-icon v-else icon="close"></b-icon> {{error}}
                      </div>
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
  name: 'PostItem',
  mixins: [petitionsMixin],
  components: { MarkdownEditor, UserSocial, Markdown },
  props: ['post', 'isOP'],
  data () {
    return {
      editing: false,
      oldPost: null,
      prettyDesc: this.post.content,
      hasVoted: false,
      hasError: false,
      error: 'Cosas',
      isBanModalActive: false,
      banData: {
        ban_reason: '',
        post: '',
        banner: this.currentUser,
        ban_expiry_date: null
      }
    }
  },
  computed: {
    orderedVoteTypes () {
      return this.forumSettings.vote_types.slice().sort((a, b) => {
        return a.order > b.order
      })
    },
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),
    ...mapState({
      forumSettings: state => state.forum.forumSettings
    })
  },
  mounted () {
    this.stripMd(this.post.content).then(desc => {
      this.prettyDesc = desc
    })
  },
  methods: {
    startEditing () {
      this.editing = true
      this.oldPost = JSON.parse(JSON.stringify(this.post))
    },
    banUser () {
      this.banData.post = this.post.id
      this.$awn.async(
        this.makePetition(
          Forum.banUserForPost(this.post.creator, this.banData),
          'Usuario baneado con exito',
          'Error baneando usuario',
          'Baneando usuario'
        ).then((banData) => {
          var tempPost = JSON.parse(JSON.stringify(this.post))
          tempPost.bans.push(banData)
          tempPost.creator.bans.push(banData)
          this.$emit('changePost', tempPost)
        })
      )
      this.isBanModalActive = false
    },
    saveEditing () {
      this.$awn.async(
        this.makePetition(
          Forum.updatePost(this.post.id, this.post.content),
          'Post actualizado con exito',
          'Error actualizando post',
          'Actualizando post'
        ).then(thread => {
          this.editing = false
          this.$awn.success('Post actualizado con exito')
        })
      )
    },
    cancelEditing () {
      this.$emit('changePost', JSON.parse(JSON.stringify(this.oldPost)))
      this.editing = false
    },
    votePostWithID (voteTypeID) {
      this.votePost(this.forumSettings.vote_types.find((vote) => vote.id === voteTypeID))
    },
    getUsersTooltip (voteType) {
      var result = ''
      for (let user of voteType.users) {
        console.log(user)
        result = result.concat(user + '\n')
      }
      return result
    },
    votePost (voteType) {
      Forum.votePost(this.post.id, voteType.id).then((message) => {
        this.hasVoted = true
        this.error = message.success
        this.oldPost = JSON.parse(JSON.stringify(this.post))
        this.oldPost.votes = []
        var voteIDX = this.oldPost.votes.findIndex((vote) => vote.id === voteType.id)
        if (voteIDX === -1) {
          voteType.vote_count = 0
          voteType.users = []
          voteIDX = this.oldPost.votes.push(voteType) - 1
        }
        this.oldPost.votes[voteIDX].vote_count++
        this.oldPost.votes[voteIDX].users.push(this.currentUser.username)
        this.$emit('changePost', JSON.parse(JSON.stringify(this.oldPost)))
      }).catch((error) => {
        console.log(error)
        this.hasVoted = true
        this.hasError = true
        this.error = error.response.data.error
      })
    },
    askReportPost () {
      this.$dialog.prompt({
        title: 'Reportar post',
        message: 'Antes de reportar un post asegurate que los motivos sean los correctos, de lo contrario tu cuenta podria resultar sancionada.',
        inputAttrs: {
          placeholder: 'Motivo'
        },
        confirmText: 'Reportar',
        cancelText: 'No, volver atrás',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: (reason) => this.reportPost(reason)
      })
    },
    reportPost (reason) {
      this.$awn.async(
        this.makePetition(
          Forum.reportPost(reason, this.post.id)
        ))
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
        onConfirm: reason => this.deletePost(reason)
      })
    },
    deletePost (reason = '') {
      var post = JSON.parse(JSON.stringify(this.post))
      post.delete_reason = reason
      this.$awn.async(
        this.makePetition(Forum.deletePost(this.post.id, reason)).then(() => {
          this.$emit('deletePost', post)
        }),
        'Post eliminado con exito',
        'Error eliminando post',
        'Eliminando post')
    },
    // Injects image into meta info for OpenGraph and Twitter Cards
    getMeta () {
      if (this.isOP && this.$refs.content) {
        var el = this.$refs.content.$el
        var images = Array.from(el.getElementsByTagName('img'))
        var image = images.find(image => {
          if (!image.classList.contains('mfc-thumbnail')) {
            return true
          }
        })
        if (image) {
          console.log(image)
          return [
            { name: 'twitter:image:src', content: image.src },
            { property: 'og:image', content: image.src },
            { itemprop: 'image', content: image.src },
            { property: 'og:description', content: this.prettyDesc }
          ]
        }
      }
      return []
    }
  },
  metaInfo () {
    return {
      meta: this.getMeta()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/sass/variables_light";

$forum-header-transition: all 0.25s ease-in-out;

.forum-header {
  cursor: pointer;
  transition: $forum-header-transition;

  &.is-info {
    transition: $forum-header-transition;
    background-color: $info;
    &:hover,
    &:active {
      background-color: darken($info, 5%);
      transform: scale(1.01);
    }
  }
  &.is-sticky {
    background-color: #58b958;
  }
}

.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}

.thread-title {
  padding: 1rem 2.5rem 1rem 1.5rem;
}

.forum-user {
  border-right: 0rem solid $grey-lighter;
}

.user-link {
  margin-bottom: 1.25rem !important;
}

.post-options {
  position: absolute;
  right: 1rem;
  top: 1.25rem;
  transform: scale(0);
  transition: transform 0.1s ease-in-out;
  z-index: 10000000;
}

.has-vertically-aligned-content {
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.level-item

.vote-icon {
  transition: transform 0.1s ease-in-out;
  transform: scale(0);
  cursor: pointer;
  opacity: 0.5;
  &:not(:last-child) {
    margin-right: 0.25rem;
  }
  &:hover,
  &:active {
    opacity: 1;
  }
}
.thread-content:hover,
.thread-content:active {
  .vote-icon {
    transform: scale(1);
  }
  .post-options {
    transform: scale(1);
  }
}

.level-vote {
  margin-right: 1.0rem !important;
}

.vote-list-item {
  cursor: pointer;
}
.user-vote-tooltip {
  &.tooltip:after {
    white-space: pre;
  }
}
</style>
