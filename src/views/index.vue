<template>
<div>
<section class="hero is-primary is-fullheight hero-1">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <header class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <AppNav/>
    </header>
  </div>

  <!-- Hero content: will be in the middle -->
  <div class="hero-body">
    <div class="container has-text-centered">
      <h1 class="title">
        A sandbox eroge where you create your own story.
      </h1>
    </div>
  </div>
</section>
<section class="hero is-primary is-fullheight hero-2">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        In ERO-ONE you make your own characters and then share the game world with them.
      </h1>
      <h2 class="subtitle">
        Depending on how you treat them (and what personality they have) the story will unfold in one way or the other.
      </h2>
    </div>
  </div>
</section>

</div>
</template>

<script>
import AppNav from '@/components/nav.vue'

export default {
  name: 'index',
  components: { AppNav }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/sass/variables_light.scss";

  .hero-parallax {
    position: fixed;
    z-index: 1;
    top: 0;
    bottom:  0;
    left: 0;
    right: 0;
    height: 170vh;
    width: 100vw;

    &:before {
      content: '';
      height: 100%;
      width: 100%;
      height: 170vh;
      width: 100vw;
      background: rgba(44,123,183,.5);
      position: absolute;
    }

    h1 {
      position: relative;
      z-index: 1;

      font-family: 'Pacifico', cursive;
      color: rgba(255,255,255,1);;
      text-align: center;
      font-size: 4rem;
      line-height: 4rem;

      text-shadow: 0 2px 2px rgba(0,0,0,.35);
      max-width: 25rem;
      margin: 30vh auto 0;

      /*-webkit-transition: 1s opacity ease-in-out;*/
    }
  }

</style>
