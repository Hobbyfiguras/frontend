<template>
  <div class="container">
    <nav class="breadcrumb" aria-label="breadcrumbs" v-if="thread">
      <ul>
        <li>
          <router-link :to="{name: 'ForumIndex'}">
            <span></span>
            <b-icon icon="home"></b-icon>
          </router-link>
        </li>
        <li>
          <router-link
            v-if="thread.forum.slug"
            :to="{name: 'forum', params: {slug: thread.forum.slug}}"
          >
            <span>{{thread.forum.name}}</span>
          </router-link>
        </li>
        <li class="is-active">
          <a href="#">
            <span>{{thread.title}}</span>
          </a>
        </li>
      </ul>
    </nav>
    <article class="container">
      <b-pagination
        :total="thread.posts.count"
        :current.sync="currentPage"
        :per-page="postsPerPage"
        order="is-centered"
        @change="changePage"
      ></b-pagination>
    </article>
    <div class="tile is-ancestor is-vertical" v-if="thread">
      <div v-if="!thread.nsfw || isNSFWEnabled" class="tile is-vertical">
        <div class="tile is-parent is-vertical">
          <article class="tile thread-title is-child notification is-primary">
            <div v class="columns">
              <div class="column">
                <p class="title is-size-4" v-if="!editing">
                  {{thread.title}}
                  <br />
                </p>
                <template v-else>
                  <b-field>
                    <b-input v-model="tempTitle"></b-input>
                  </b-field>
                </template>
                <template
                  v-if="!editing"
                >creado por {{thread.creator.username}}, {{thread.posts.count - 1}} respuestas</template>
              </div>
              <template v-if="currentUser">
                <div
                  class="column is-1 has-text-right"
                  v-if="(currentUser.id === thread.creator.id || currentUser.is_staff)"
                >
                  <b-dropdown>
                    <a slot="trigger">
                      <p>
                        <b-icon icon="dots-vertical"></b-icon>
                      </p>
                    </a>
                    <template>
                      <div class="has-text-left">
                        <b-dropdown-item @click="toggleSubscription()">
                          <template v-if="thread.subscribed">
                            <b-icon icon="eye-off"></b-icon>Desuscribirse
                          </template>
                          <template v-else>
                            <b-icon icon="eye"></b-icon>Suscribirse
                          </template>
                        </b-dropdown-item>
                        <b-dropdown-item @click="makeNSFW()">
                          <b-icon icon="eye-settings"></b-icon>Hacer NSFW
                        </b-dropdown-item>
                        <b-dropdown-item @click="toggleEditing()">
                          <b-icon icon="pencil"></b-icon>Editar
                        </b-dropdown-item>
                        <template v-if="currentUser.is_staff">
                          <hr class="dropdown-divider" />
                          <b-dropdown-item @click="openMoveThreadModal()">
                            <b-icon icon="folder-move"></b-icon>Mover Hilo
                          </b-dropdown-item>
                          <b-dropdown-item @click="toggleSticky()">
                            <template v-if="thread.is_sticky">
                              <b-icon icon="pin-off"></b-icon>Despinear
                            </template>
                            <template v-else>
                              <b-icon icon="pin"></b-icon>Pinear
                            </template>
                          </b-dropdown-item>
                          <b-dropdown-item @click="toggleLock()">
                            <template v-if="thread.is_closed">
                              <b-icon icon="lock-open"></b-icon>Abrir hilo
                            </template>
                            <template v-else>
                              <b-icon icon="lock"></b-icon>Cerrar hilo
                            </template>
                          </b-dropdown-item>
                        </template>
                      </div>
                    </template>
                  </b-dropdown>
                </div>
              </template>
              <div v-if="editing" class="column is-1">
                <div class="buttons">
                  <span class="button is-success" @click="saveEditing">
                    <b-icon icon="content-save"></b-icon>
                  </span>
                  <span class="button is-danger" @click="cancelEditing">
                    <b-icon icon="close"></b-icon>
                  </span>
                </div>
              </div>
            </div>
          </article>
          <transition-group :name="transitonName">
            <div
              v-for="(post, index) in thread.posts.results"
              :key="post.id"
              @deletePost="deletePost"
              :ref="'#' + post.id"
            >
              <PostItem
                class="PostItem"
                allowQuote="true"
                @onQuote="onUserQuote"
                :isOP="index === 0 && currentPage === 1"
                :post="post"
                @changePost="changePost"
              ></PostItem>
              <article
                class="tile thread-content is-child notification is-white"
                v-if="((currentUser && (currentUser.id === thread.creator.id || currentUser.is_staff)) || thread.related_items.length > 0) && index === 0 && currentPage === 1"
              >
                <p class="subtitle">Articulos relacionados</p>
                <ItemList
                  v-model="thread.related_items"
                  :editable="currentUser && (currentUser.id === thread.creator.id || currentUser.is_staff)"
                  @updateList="updateRelatedItems"
                ></ItemList>
              </article>
            </div>
          </transition-group>
          <article class="container">
            <b-pagination
              :total="thread.posts.count"
              :current.sync="currentPage"
              :per-page="postsPerPage"
              order="is-centered"
              @change="changePage"
            ></b-pagination>
          </article>
          <template v-if="currentUser">
            <div class="tile is-child notification is-info new-post is-size-7">
              <div class="level">
                <div class="level-left">Nuevo post</div>
              </div>
            </div>
            <article class="tile is-child notification is-white thread-content">
              <PostCreate
                v-if="!thread.is_closed || currentUser.is_staff"
                ref="postCreate"
                :thread="thread"
                @createPost="onCreatePost"
              ></PostCreate>
              <div v-else>Este hilo ha sido cerrado y no admite respuestas.</div>
            </article>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Forum from "@/api/forum";
import PetitionsMixin from "@/components/mixins/petitions";
import PostItem from "@/components/forum/PostItem";
import NSFWWarningMixin from "@/components/mixins/NSFWWarningMixin";
import PostCreate from "@/views/forum/post_create";
import { mapGetters, mapState } from "vuex";
import MoveThreadModal from "@/components/forum/MoveThreadModal";
import debounce from "debounce";
import ItemList from "@/components/forum/ItemList";

export default {
  name: "thread_view",
  mixins: [PetitionsMixin, NSFWWarningMixin],
  components: { PostItem, PostCreate, ItemList },
  data() {
    return {
      thread: null,
      editing: false,
      postsPerPage: 20,
      currentPage: 1,
      transitonName: "asdasd",
      scrollDisabled: false
    };
  },
  metaInfo() {
    return {
      title: this.thread ? this.thread.title : "",
      meta: [
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@hobbyfiguras" },
        {
          name: "twitter:title",
          content: this.thread ? this.thread.title : "Hobbyfiguras"
        },
        {
          property: "og:title",
          content: this.thread ? this.thread.title : "Hobbyfiguras"
        }
      ]
    };
  },
  mounted() {
    this.fetchData();
  },
  props: {
    id: String,
    page: {
      default: 1
    }
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  computed: {
    ...mapGetters("settings", ["isNSFWEnabled"]),
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  updated: debounce(function() {
    this.$nextTick(() => {
      if (!this.scrollDisabled) {
        this.scrollToHash();
        this.scrollDisabled = true;
      }
    });
  }, 500), // increase to ur needs
  methods: {
    openMoveThreadModal() {
      this.$buefy.modal.open({
        parent: this,
        component: MoveThreadModal,
        props: { thread: this.thread },
        hasModalCard: true
      });
    },
    findHighestQuoteLevel(text) {
      var highestQuoteLevel = 0;
      var currentQuoteLevel = 0;
      for (var i of text) {
        var char = i;
        if (char === ":") {
          currentQuoteLevel++;
        } else {
          currentQuoteLevel = 0;
        }
        if (currentQuoteLevel > highestQuoteLevel) {
          highestQuoteLevel = currentQuoteLevel;
        }
      }
      return highestQuoteLevel;
    },
    updateRelatedItems() {
      let payload = { related_items: [] };
      for (let item of this.thread.related_items) {
        payload.related_items.push(item.id);
      }
      this.makePetition(
        Forum.updateThread(this.thread.id, payload)
      ).then(() => {});
    },
    onUserQuote(post) {
      // highest quote level
      var HQL = Math.max(this.findHighestQuoteLevel(post.content), 2);
      HQL++;
      var quoteStart = ":".repeat(HQL);
      let text = `${quoteStart} cita ${post.creator.username} ${post.id}\n${post.content}\n${quoteStart}`;
      this.$refs.postCreate.addText(text);
    },
    makeNSFW() {
      this.$buefy.dialog.confirm({
        title: "Hacer el hilo NSFW",
        message: "Esta acción no se puede revertir, ¿estás seguro?.",
        confirmText: "Aceptar",
        cancelText: "No, volver atrás",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          return Forum.makeThreadNSFW(this.id).then(() => {
            this.$toast.open("El hilo es ahora NSFW!");
            this.thread.nsfw = true;
          });
        }
      });
    },
    toggleEditing() {
      this.editing = true;
      this.tempTitle = this.thread.title;
    },
    saveEditing() {
      let payload = { title: this.tempTitle };
      this.makePetition(Forum.updateThread(this.id, payload)).then(thread => {
        this.thread.title = this.tempTitle;
        this.editing = false;
      });
    },
    toggleSticky() {
      let payload = { is_sticky: !this.thread.is_sticky };
      this.makePetition(Forum.updateThread(this.id, payload)).then(thread => {
        this.thread.is_sticky = payload.is_sticky;
      });
    },
    toggleLock() {
      let payload = { is_closed: !this.thread.is_closed };
      this.makePetition(Forum.updateThread(this.id, payload)).then(thread => {
        this.thread.is_closed = payload.is_closed;
      });
    },
    cancelEditing() {
      this.editing = false;
    },
    fetchData() {
      var page = this.page;
      if (page === "ultima") {
        page = "last";
      } else {
        page = parseInt(page);
      }

      this.makePetition(Forum.getThread(this.id, page), true, true).then(
        thread => {
          this.thread = thread;
          if (page === "last") {
            this.currentPage = Math.ceil(
              this.thread.posts.count / this.postsPerPage
            );
          } else {
            this.currentPage = parseInt(this.page);
          }
          if (this.thread.nsfw && !this.isNSFWEnabled) {
            this.askNSFW();
          }
        }
      );
    },
    changePost(newpost) {
      console.log(newpost);
      var i = this.thread.posts.results.findIndex(
        post => post.id === newpost.id
      );
      this.thread.posts.results[i].content = newpost.content;
      this.thread.posts.results[i].bans = newpost.bans;
      this.thread.posts.results[i].creator.bans = newpost.creator.bans;
      if (newpost.votes) {
        this.thread.posts.results[i].votes = newpost.votes;
      }
    },
    scrollToHash() {
      if (this.$route.hash) {
        if (this.$refs[this.$route.hash]) {
          var ref = this.$refs[this.$route.hash][0];
          if (ref) {
            this.$scrollTo(ref.$el, 1000);
          }
        }
      }
    },
    toggleSubscription() {
      this.makePetition(
        Forum.changeThreadSubscription(this.thread.id, !this.thread.subscribed)
      ).then(() => {
        this.thread.subscribed = !this.thread.subscribed;
      });
    },
    deletePost(postToDelete) {
      console.log(postToDelete);
      var index = this.thread.posts.results.findIndex(
        post => post.id === postToDelete.id
      );
      console.log(index);
      this.thread.posts.results[index].modified_by = this.currentUser;
      this.thread.posts.results[index].delete_reason =
        postToDelete.delete_reason;
      this.thread.posts.results[index].deleted = true;
    },
    onCreatePost(post) {
      post.thread = this.thread;
      var totalPages = Math.ceil(this.thread.posts.count / this.postsPerPage);
      if (
        totalPages === this.currentPage &&
        this.thread.posts.results.length < this.postsPerPage
      ) {
        this.transitonName = "post";
        this.thread.posts.results.push(JSON.parse(JSON.stringify(post)));
      } else {
        var data = this.getThreadLinkData(this.thread);
        data.hash = "#" + String(post.id);
        data.params.page = "ultima";
        this.$router.push(data);
      }
    },
    changePage: debounce(function(page = 1) {
      var data = this.getThreadLinkData(this.thread);
      if (page === 1) {
        this.$router.push(data);
      } else {
        data.params.page = page;
        this.$router.push(data);
      }
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
@import "../../sass/variables_light";

$forum-header-transition: all 0.25s ease-in-out;

.forum-header {
  cursor: pointer;
  transition: $forum-header-transition;

  &.is-info {
    transition: $forum-header-transition;
    background-color: $info;
    &:hover {
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

.thread-title {
  padding: 1rem 2.5rem 1rem 1.5rem;
}

.new-post {
  padding: 0.5rem 2.5rem 0.5rem 1.5rem;
}

.post-enter-active,
.post-leave-active,
.post-move {
  transition: all 1s;
}
.post-enter, .post-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
