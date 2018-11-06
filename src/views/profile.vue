<template>
  <div class="container">
<div class="columns">
  <div class="container profile">
    <div class="section profile-heading">
      <div class="columns is-mobile is-multiline">
        <div class="column is-2-tablet is-6-mobile">
          <figure class="image is-256x256">
            <div class="is-paddingless">
              <img v-if="!editing" class="is-rounded avatar" :src="avatar"/>
            </div>

              <div class="is-paddingless" :class="{'is-hidden': !cropImageSelected}">
                <croppa v-if="editing" v-model="crop"
                        prevent-white-space
                        placeholder="click button on the right :)"
                        :placeholder-font-size="14"
                        :show-remove-button="true"
                        @image-remove="handleImageRemoved"
                        @new-image="imageSelected()"
                        @move="pointerMoved = true"
                        >
                  <img crossOrigin="Anonymous" slot="initial" src="avatar" />
                </croppa>
              </div>

              <div v-if="editing && !cropImageSelected" @click="crop.chooseFile()" class="edit-avatar-image">
              <img  class=" is-rounded" :src="avatar"/>
              <div class="avatar-image-container has-text-centered">
                <p>Editar</p>
              </div>
              </div>

          </figure>
        </div>
        <div class="column is-4-tablet is-6-mobile name" v-if="!editing">
          <p>
            <span class="title is-bold">{{profileUser.username}}</span>
          </p>
            <div v-if="currentUser">
              <template v-if="currentUser.id == profileUser.id">
                <a v-if="!editing" @click="startEdit()" class="button is-primary">
                  Editar perfil
                </a>
                <template v-else>
                </template>
              </template>
            </div>

          <template v-if="!editing">
            <div class="container">
              <div class="location-item" v-if="profileUser.location">
                <b-icon custom-class="mdi-profile" icon="earth"></b-icon> {{profileUser.location}}
              </div>
              <UserSocial :user="profileUser"></UserSocial>
            </div>
            <Markdown :source="profileUser.bio"></Markdown>
          </template>
        </div>
        <div class="column is-2-tablet is-4-mobile has-text-centered" v-if="!editing">
          <p class="stat-val">
            <portal-target  name="figurecount">
              <p>...</p>
            </portal-target>
          </p>
          <p class="stat-key">figuras</p>
        </div>
        <div class="column is-2-tablet is-4-mobile has-text-centered" v-if="!editing">
            <p class="stat-val">
              <portal-target  name="photocount">
                <p>...</p>
              </portal-target>
            </p>
          <p class="stat-key">fotos</p>
        </div>
        <div class="column is-2-tablet is-4-mobile has-text-centered" v-if="!editing">
            <p class="stat-val">
              <portal-target  name="threadcount">
                <p>...</p>
              </portal-target>
            </p>
          <p class="stat-key">temas</p>
        </div>
        <div class="column is-10-tablet is-12-mobile is-multiline" v-if="editing">
          <div class="columns">
            <div class="column">
              <b-field label="Nombre">
                <b-input v-model="tempUser.first_name"></b-input>
              </b-field>
              <b-field label="Apellidos">
                <b-input v-model="tempUser.second_name"></b-input>
              </b-field>
              <b-field label="Usuario de MyFigureCollection">
                <b-input v-model="tempUser.mfc_username"></b-input>
              </b-field>
              <b-field label="Usuario de MyAnimeList">
                <b-input v-model="tempUser.mal_username"></b-input>
              </b-field>
              <b-field label="Usuario de Anilist">
                <b-input v-model="tempUser.anilist_username"></b-input>
              </b-field>
              <b-field label="Usuario de Twitter">
                <b-input v-model="tempUser.twitter_username"></b-input>
              </b-field>
              <b-field label="Lugar">
                <b-input v-model="tempUser.location"></b-input>
              </b-field>
            </div>
            <div class="column  is-three-quarters ">
              <b-field label="Bio">
                <MarkdownEditor v-model="tempUser.bio"></MarkdownEditor>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column is-12">
              <div class="field is-grouped">
                <p class="control">
                  <a class="button is-info" @click="saveEdit()">
                    Guardar
                  </a>
                </p>
                <p class="control">
                  <a class="button is-danger" @click="cancelEdit()">
                    Cancelar
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <b-tabs v-model="activeTab" expanded size="is-medium" v-if="!loading">
    <b-tab-item label="Figuras" v-if="profileUser.mfc_username">
      <UserFigures :username="profileUser.mfc_username"></UserFigures>
    </b-tab-item>
    <b-tab-item label="Fotos" v-if="profileUser.mfc_username">
      <UserPics :username="profileUser.mfc_username"></UserPics>
    </b-tab-item>
    <b-tab-item label="Temas" v-if="profileUser.thread_count">
      <UserThreads :username="profileUser.username"></UserThreads>
    </b-tab-item>
  </b-tabs>
  </div>
</template>

<script>
import PetitionsMixin from '@/components/mixins/petitions'
import UserFigures from '@/components/profile/user_figures'
import UserPics from '@/components/profile/user_pics'
import FigureSite from '@/api/figuresite'
import UserThreads from '@/components/profile/user_threads'
import UserSocial from '@/components/profile/user_social'
import { mapGetters, mapState } from 'vuex'
import MarkdownEditor from '@/components/markdown_editor'
import Markdown from '@/components/markdown'

export default {
  name: 'profile',
  components: { UserFigures, UserPics, UserThreads, UserSocial, MarkdownEditor, Markdown },
  mounted () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  props: ['username'],
  data () {
    return {
      activeTab: 0,
      editing: false,
      profileUser: {},
      crop: {},
      cropImageSelected: false,
      avatar: '',
      loading: true,
      tempUser: {}
    }
  },
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated'
    ]),
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    fetchData () {
      this.loading = true
      console.log(this.username)
      this.makePetition(FigureSite.getUser(this.username)).then((username) => {
        this.profileUser = username
        this.avatar = this.profileUser.avatar
        // We separate the profile avatar from the profile user data because
        // avatar update requests are done using FormData, the rest is JSON
        delete this.profileUser.avatar
        this.loading = false
      })
    },
    startEdit () {
      this.editing = true
      this.tempUser = JSON.parse(JSON.stringify(this.profileUser))
    },
    saveEdit () {
      if (this.cropImageSelected) {
        this.handleImageRemoved()
        this.uploadAvatar().then(() => {
          this.updateProfile()
        })
      } else {
        this.updateProfile()
      }

      this.editing = !this.editing
    },
    cancelEdit () {
      this.editing = false
    },
    uploadAvatar () {
      return new Promise((resolve, reject) => {
        this.avatar = this.crop.generateDataUrl('image/jpeg')
        this.crop.promisedBlob('image/jpeg').then((blob) => {
          const data = new FormData()
          data.append('avatar', blob, 'avatar.jpg')
          var options = {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`
            }
          }
          console.log('return')
          this.$awn.async(this.makePetition(FigureSite.updateUserAvatar(this.username, data, options)), 'Avatar actualizado correctamente.',
            'Error actualizando avatar', 'Actualizando avatar').then(() => {
            resolve()
          }).catch((error) => {
            reject(error)
          })
        })
      })
    },
    updateProfile () {
      this.profileUser = JSON.parse(JSON.stringify(this.tempUser))
      this.$awn.async(this.makePetition(FigureSite.updateUser(this.username, this.profileUser)), 'Perfil actualizado corractualizado correctamente.',
        'Error actualizando perfil', 'Actualizando perfil')
    },
    imageSelected () {
      this.cropImageSelected = true
    },
    handleImageRemoved () {
      this.cropImageSelected = false
    }

  },
  mixins: [PetitionsMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../sass/variables_light.scss";
  .stat-val {
    font-size: 3em;
    padding-top: 20px;
    font-weight: bold;
  }

  .stat-key {
    font-size: 1.4em;
    font-weight: 200
  }

  .section.profile-heading .column.is-2-tablet.has-text-centered + .has-text-centered {
    border-left: 1px dotted rgba(0, 0, 0, .2);
  }

  canvas {
    border-radius: 300000px;
    width: 100% !important;
    height: auto !important;
  }
  .croppa-container {
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    display: block !important;

  }
  .avatar {
    min-height: 196px;
    min-width: 196px;
  }
  .edit-avatar-image {
    min-height: 196px;
    min-width: 196px;
    cursor: pointer;
    img {
      display:block;
    }
    .avatar-image-container {
      position: absolute;
      border-radius: 300000px;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      color: white;
      background-color: #000;
      font-weight: bold;
      transition: all .5s ease-in-out;
      justify-content: center;
      align-items: center;
      display: flex;
      opacity: 0;
      &:hover {
        opacity: 0.85;
      }
    }
  }
  .icon-remove {
    top: 0px !important;
    right: 0px !important;
    position: absolute;
  }

  .icon {
    margin-right: 0.25rem;
  }

.location-item {
  a {
    color: #363636 !important;
    &:not(:last-of-type) {
      margin-right: 0.5rem;
    }
  }
  display: flex;
  margin-bottom: 0.5rem;
}

</style>
