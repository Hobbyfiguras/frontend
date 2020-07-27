<template>
<router-link :to="getThreadLinkData(newsItem)">
    <article class="tile is-child notification is-white news-item" :style="getStyleString()">

      <div v-if="newsItem.nsfw" class="news-item-nsfw">
      </div>
      <div v-if="isNew()" class="news-item-new">
      </div>
      <div class="news-item-info">
        <p class="news-item-title">{{newsItem.title}}</p>
      </div>
    </article>
</router-link>
</template>

<script>
import Markdown from '@/components/markdown'

export default {
  name: 'news_item',
  props: ['newsItem'],
  components: { Markdown },
  methods: {
    truncateMarkdown (markdown) {
      var lines = markdown.split('\n')
      var result = ''
      for (var line of lines) {
        result = result.concat(line + '\n')
        if (line.match(/!\[.*\]\(.*\)/)) {
          break
        }
      }
      return result
    },
    getImageURL(markdown) {
      const REGEX = /!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/
      var result = REGEX.exec(markdown)
      console.log("RETURNING!!!!!", result)
      if (result) {
        if ("groups" in result) {
          if ("filename" in result.groups) {
            console.log("RETURNING!!!!!", result)
            return result.groups.filename
          }
        }
      }

    },
    getStyleString() {
      var image = this.getImageURL(this.newsItem.first_post.content)
      return `background-image: url(${image});`
    },
    isNew() {
      var diff = Date.now() - new Date(this.newsItem.created)
      var days = diff / (1000*60*60*24)
      return days < 2
    }
  },
  eq: {
    breakpoints: {
      contentSmall: {
        maxHeight: 500
      }
    }
  }
}
</script>

<style lang="scss">
.thread-title {
  padding: 1.0rem 2.5rem 1.0rem 1.5rem
}
.news-item {
  background-size: cover;
  min-height: 15rem;
  transition: scale 0.2s ease-in-out;
  border-radius: 7px !important;
  &:hover {
    scale: 1.05;
    box-shadow: 0px 0px 15px 15px rgba(72, 39, 162, 0.3);
  }

  padding: 0;

  .news-item-nsfw, .news-item-new {
    position: absolute;
    border-radius: 7px !important;
    background-size: cover;
    background-position: center;
    background-image: url('../assets/images/noticia-nsfw.svg');
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    :hover > & {
      opacity: 0;
    }
  }

  .news-item-new {
    background-image: url('../assets/images/noticia-novedad.svg');
    background-position: right top;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .news-item-info {
    position: absolute;
    border-radius: 7px !important;
    background-color: rgba(32, 18, 71, 0.0);
    width: 100%;
    height: 100%;
    transition: background-color 0.2s ease-in-out;
    transition: opacity 0.2s ease-in-out;
    padding: 1rem;
    opacity: 0;
    :hover > & {
      background-color: rgba(32, 18, 71, 0.8);
      opacity: 1;
    }
    .news-item-title {
      font-family: sans-serif;
      color: white;
      font-size: 1.5rem;
      line-height: 1.25;
      font-weight: 600;
    }
  }
}


.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}
.readmore-box {
  max-height: 500px;
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
