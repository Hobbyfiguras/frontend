<template>
  <div class="container">
    <div class="columns">
      <div class="column is-hidden-mobile">
        <div class="tile is-vertical is-ancestor">
          <div class="tile is-parent is-vertical">
            <div class="tile is-child notification is-primary post-time is-size-7">
              <div class="level is-mobile">
                <div class="level-left">Ultimos mensajes</div>
                <div class="level-right"></div>
              </div>
            </div>
            <router-link
              class="tile is-child notification is-white"
              v-for="post in posts"
              :key="post.id"
              :to="getThreadLinkData(post.thread)"
            >
              <article>
                {{post.thread.title}}
                <br />
                <p class="is-size-7">
                  por
                  <a>{{post.creator.username}}</a>
                  en {{post.thread.forum.name}}
                </p>
              </article>
            </router-link>
            <router-link
              class="has-text-right has-text-primary show-more-url"
              :to="{ name: 'forum_recent' }"
            >Mostrar más</router-link>
            <div class="tile is-child notification is-primary post-time is-size-7">
              <div class="level is-mobile">
                <div class="level-left">Webs amigas</div>
                <div class="level-right"></div>
              </div>
            </div>
            <div class="tile is-child">
              <div class="level is-mobile">
                <a href="https://animeagari.com/">
                  <img src="@/assets/images/banner_animeagari.png" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-four-fifths">
        <div class="tile">
          <b-tabs expanded @change="tabsChanged" type="is-toggle">
            <b-tab-item label="Noticias" icon="newspaper"></b-tab-item>
            <b-tab-item label="Reviews" icon="camera"></b-tab-item>
          </b-tabs>
        </div>
        <div class="tile is-vertical is-ancestor">
          <NewsItem
            v-for="newsItem in news.results"
            :key="newsItem.id"
            :newsItem="newsItem"
            class="tile is-parent is-vertical"
          ></NewsItem>
        </div>
        <b-pagination
          v-if="news"
          :total="news.count"
          :current.sync="currentPage"
          :per-page="itemsPerPage"
          order="is-centered"
          @change="changePage"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import PetitionsMixin from "@/components/mixins/petitions";
import Forum from "@/api/forum";
import NewsItem from "@/components/NewsItem";
import debounce from "debounce";

export default {
  name: "index",
  mixins: [PetitionsMixin],
  components: { NewsItem },
  data() {
    return {
      news: [],
      posts: [],
      mode: "normal", // normal or highlighted
      itemsPerPage: 10,
      currentPage: 1
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  methods: {
    setMode(mode) {
      console.log("setting mode! ", mode);
      if (this.mode != mode) {
        this.mode = mode;
        this.currentPage = 1;
        this.fetchData();
      }
    },
    tabsChanged(new_tab_i) {
      if (new_tab_i === 0) {
        this.setMode("normal");
      } else {
        this.setMode("highlighted");
      }
    },
    fetchData() {
      if (this.$route.query.page) {
        var page = parseInt(this.$route.query.page);
        this.currentPage = page;
      }
      if (this.mode === "normal") {
        this.makePetition(Forum.getFrontPageThreads(this.currentPage, 10)).then(
          news => {
            this.news = news;
            console.log("news", this.news);
          }
        );
      } else if (this.mode === "highlighted") {
        this.makePetition(Forum.getHighlighted(this.currentPage, 10)).then(
          news => {
            this.news = news;
            console.log("news", this.news);
          }
        );
      }

      this.makePetition(Forum.getPosts()).then(posts => {
        this.posts = posts.results;
      });
    },
    changePage: debounce(function(page = 1) {
      if (page === 1) {
        this.$router.push({ name: "index" });
      } else if (page !== 0) {
        this.$router.push({ name: "index", query: { page: page } });
      }
    }, 500)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.show-more-url {
  margin-bottom: 1rem !important;
}
</style>
