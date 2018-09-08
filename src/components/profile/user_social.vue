<template>
  <div class="social-item">
    <a :href="`https://twitter.com/${user.twitter_username}`" v-if="user.twitter_username">
      <b-icon icon="twitter"></b-icon>
    </a>
    <a :href="`https://myfigurecollection.net/profile/${user.mfc_username}`" v-if="user.mfc_username">
      <img class="icon" src="../../assets/images/logo-mfc.svg"/>
    </a>
    <a :href="`https://myanimelist.net/profile/${user.mal_username}`" v-if="user.mal_username">
      <img class="icon" src="../../assets/images/logo-mal.svg"/>
    </a>
    <a :href="`https://anilist.co/user/${user.anilist_username}`" v-if="user.anilist_username">
      <img class="icon" src="../../assets/images/logo-anilist.svg"/>
    </a>
  </div>
</template>

<script>
export default {
  name: 'user_media',
  props: ['user']

}
</script>

<style lang="scss" scoped>
@import "../../sass/variables_light";

.social-item {
  a {
    color: #363636 !important;
    &:not(:last-of-type) {
      margin-right: 0.5rem;
    }
  }
  display: flex;

}
</style>
