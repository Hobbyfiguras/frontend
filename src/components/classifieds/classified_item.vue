<template>
  <router-link class="user-link" :to="{name: 'classifieds_view', params: {slug: item.slug}}">

    <div class="card">
      <div class="card-image">
        <figure class="image">
          <img :src="getPreviewImage()" alt="Placeholder image">
        </figure>
      </div>
      <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{formatMoney(item.price_currency, item.price)}}</p>
              <p class="subtitle is-5"><b-tag v-if="this.item.sold" type="is-primary">Vendido</b-tag> {{item.title}}</p>
            </div>
          </div>
        </div>
      </div>
  </router-link>
</template>

<script>
import MoneyFormatter  from 'money-formatter';
export default {
  name: 'classified_item',
  props: ['item'],
  methods: {
    formatMoney(currency, quantity) {
      return MoneyFormatter.format(currency, quantity);
    },
    getPreviewImage() {
        for (var image of this.item.images) {
            if (image.primary) {
                return image.image
            }
        }
    }
  }
  
}
</script>