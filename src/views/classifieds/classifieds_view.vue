<template>
  <section>
    <template currentUser v-if="ad.sold_to && ad.sold_to.username === currentUser.username">
      <div class="columns is-centered" v-if="!ad.reviewed">
        <article class="message is-success">
          <div class="message-body">
            <b-field label="Este articulo es tuyo! deja tu opinión sobre la compra aquí!">
              <b-input v-model="opinionText" maxlength="200" type="textarea"></b-input>
            </b-field>
            <b-button icon-left="thumb-up" @click="sendReview(true)"></b-button><b-button @click="sendReview(false)" icon-left="thumb-down"></b-button>
          </div>
        </article>
      </div>
      <div class="columns is-centered" v-else>
        <article class="message is-success">
          <div class="message-body">
            Ya has dejado una opinión en este articulo!
          </div>
        </article>
      </div>
    </template>
    <div class="columns is-centered">
      <div class="column is-flex">
        <router-link class="user-link is-flex" :to="{name: 'profile', params: {username: ad.creator.username}}">
          <figure class="image is-64x64">
            <div class="is-paddingless">
              <img class="is-rounded" :src="ad.creator.avatar"/>
            </div>
          </figure>

          <div class="classified-user">
            <h1 class="title is-6">{{ad.creator.username}}</h1>
            <h1 class="subtitle">{{ad.creator.classified_count}} anuncios {{ad.creator.classifieds_positive_review_count}} <b-icon icon="thumb-up" size="is-small" type="is-success"></b-icon> {{ad.creator.classifieds_negative_review_count}} <b-icon icon="thumb-down" size="is-small" type="is-danger"></b-icon></h1>
          </div>
        </router-link>
      </div>
      <div class="column contact-column" v-if="currentUser && currentUser.username !== ad.creator.username">
        <b-button class="is-primary" @click="sendMessage()">Contactar</b-button>
      </div>
    </div>
    <b-carousel :autoplay="false" :indicator-inside="false" with-carousel-list :overlay="gallery">
      <b-carousel-item v-for="item in ad.images" :key="item.id">
        <a @click="switchGallery(true)" class="image has-image-centered">
          <img :src="item.image">
        </a>
      </b-carousel-item>
      <span v-if="gallery" @click="switchGallery(false)" class="modal-close is-large"/>
      <template slot="indicators" slot-scope="props">
          <span class="al image">
              <img class="has-image-centered" :src="getImage(props.i).image">
          </span>
      </template>
    </b-carousel>
    <h1 class="title has-text-centered"><b-tag v-if="this.ad.sold" type="is-primary">Vendido</b-tag> {{ ad.title }}</h1>
    <h2 class="title is-4 has-text-centered">{{ formatMoney(ad.price_currency, ad.price) }}</h2>
    <article class="tile is-child notification is-white has-text-centered">
      {{ad.content}}
    </article>
  </section>
</template>

<script>
import PetitionsMixin from '@/components/mixins/petitions'
import NSFWWarningMixin from '@/components/mixins/NSFWWarningMixin'
import Classifieds from '@/api/classifieds'
import MoneyFormatter  from 'money-formatter';
import SendMessageModal from '@/components/profile/SendMessageModal'

export default {
  mounted () {
    this.fetchData()
  },
  data () {
    return {
      ad: {
        id: "",
        title: "",
        content: "",
        images: [],
        creator: {
          username: "EIREXE",
          avatar: ""
        }
      },
      opinionText: "",
      gallery: false
    }
  },
  mixins: [PetitionsMixin, NSFWWarningMixin],
  props: ['slug'],
  methods: {
    getImage(i) {
      return this.ad.images[i]
    },
    fetchData () {

      this.makePetition(Classifieds.getClassifiedAD(this.slug), true, true).then((ad) => {
        this.ad = ad
        if (this.ad.nsfw && !this.isNSFWEnabled) {
          this.askNSFW()
        }
      })
    },
    formatMoney(currency, quantity) {
      return MoneyFormatter.format(currency, quantity);
    },
    switchGallery(value) {
      this.gallery = value
    },
    sendMessage() {
      this.$buefy.modal.open({
        parent: this,
        component: SendMessageModal,
        props: {
            receiver: this.ad.creator.username,
            defaultSubject: `Articulo "${this.ad.title}"`,
            relatedAD: this.ad.id
          },
        hasModalCard: true
      })
    },
    sendReview (result) {
      this.$awn.async(this.makePetition(Classifieds.sendReview(this.ad.slug, this.opinionText, result), true, true), 'Opinión enviada correctamente.',
        'Error enviando opinión', 'Enviando opinión').then(() => {
        this.ad.reviewed = true
        resolve()
      }).catch((error) => {
        reject(error)
      })
    }
  },
}
</script>

<style>
  .carousel-items {
    max-height: 20rem;
  }
  .is-overlay .carousel-items {
    max-height: none !important;
  }
  .is-overlay .carousel-items .carousel-item, .is-overlay .carousel-items .carousel-item .image {
    height: 100%;

  }
  .carousel-item .image img {
    height: 100%;
    width: auto;
    margin-left: auto;
    margin-right: auto;
  }
  .has-image-centered {
    margin-left: auto;
    margin-right: auto;
    height: 100%;
  }
  .carousel-image {
    max-height: 20rem;
    width: auto !important;
  }
  .classified-description {
    margin-top: 2.5rem;
  }
  .is-active .al img {
      filter: grayscale(0%);
  }
  .al img {
      filter: grayscale(100%);
      max-height: 7rem;
  }
  .classified-user {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .contact-column {
    display: flex;
    justify-content: end;
  }
</style>