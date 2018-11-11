<template>
<div>
    <article class="tile thread-title is-child notification is-primary">
        <router-link class="title" :to="getThreadLinkData(newsItem)">
        {{newsItem.title}}
        </router-link>
    </article>
    <div class="tile is-child notification is-info post-time is-size-7">
        <div class="level">
        <div class="level-left"><p>por <router-link :to="{name: 'profile', params: {username: newsItem.creator.username}}">{{newsItem.creator.username}}</router-link> {{newsItem.created | timeDiff("from")}}</p></div>
        </div>
    </div>
    <article class="tile is-child notification is-white thread-content">
        <div :class="{'readmore-box': !$eq.contentSmall}" v-if="newsItem.first_post">
          <Markdown :source="newsItem.first_post.content"></Markdown>
          <p class="read-more"></p>
        </div>
        <div class="has-text-centered read-more-button">
          <router-link :to="getThreadLinkData(newsItem)" class="button is-primary" v-if="!$eq.contentSmall">Seguir leyendo</router-link>
        </div>
        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
              <div class="level-item">
              <router-link :to="getThreadLinkData(newsItem)">
                  <b-icon icon="comment" class="badge" :data-badge="newsItem.post_count - 1"></b-icon>
              </router-link>
              </div>
          </div>
        </div>
    </article>
</div>
</template>

<script>
import Markdown from '@/components/markdown'

export default {
  name: 'news_item',
  props: ['newsItem'],
  components: { Markdown },
  eq: {
    breakpoints: {
      contentSmall: {
        maxHeight: 300
      }
    }
  }
}
</script>
+
<style lang="scss">
.thread-title {
  padding: 1.0rem 2.5rem 1.0rem 1.5rem
}
.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}
.readmore-box {
  max-height: 300px;
  position: relative;
  overflow: hidden;
  .read-more {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    margin: 0; padding: 4rem 0;
    /* "transparent" only works here because == rgba(0,0,0,0) */
    background-image: linear-gradient(to bottom, transparent, white);
  }
}

.read-more-button {
  margin-top: 1.25rem;
}
</style>
