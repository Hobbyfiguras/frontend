<template>
  <div class="video-container">
    <iframe width="100%" height="auto" :src="`https://www.youtube-nocookie.com/embed/${youtubeID}`" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
  </div>
</template>

<script>
export default {
  props: ['node', 'updateAttrs', 'view'],
  computed: {
    youtubeID: {
      get() {
        return this.node.attrs['data-youtube-id']
      },
      set(youtubeID) {
        this.updateAttrs({
          'data-youtube-id': youtubeID
        })
      },
    },
  }
}
</script>

<style scoped>
.video-container {
    display: block;
    margin: 15px 0px;
    position: relative;
    width: 100%;
    max-width: 960px;
}

.video-container::after {
    content: "";
    display: table;
    clear: both;
}
.video-container::before {
    content: "";
    width: 1px;
    margin-left: -1px;
    float: left;
    height: 0px;
    padding-top: calc(56.25%);
}

.video-container iframe,
.video-container object,
.video-container embed {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}
</style>
