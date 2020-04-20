<template>
  <section>
    <h1 class="title ">Crear nuevo anuncio</h1>
    <b-field label="Titulo del anuncio">
      <b-input v-model="title" placeholder="Kirino Kousaka la vampira vegana"></b-input>
    </b-field>
    <b-field label="Descripción del anuncio">
      <b-input v-model="description" type="textarea" maxlength="4000" placeholder="Kirino Kousaka la vampira vegana"></b-input>
    </b-field>
    <b-field>
      <b-select v-model="selectedCurrency" placeholder="Currency">
        <option v-for="currency in getAllowedCurrencies()" :key="currency.code" :value="currency.code">{{currency.currency}}</option>
      </b-select>
      <b-input type="number" v-model="price" placeholder="0,00"></b-input>
    </b-field>
    <b-field>
      <b-upload v-model="dropFiles"
        multiple
        drag-drop>
      <section class="section">
        <div class="content has-text-centered">
            <p>
              <b-icon
                  icon="upload"
                  size="is-large">
              </b-icon>
            </p>
            <p>Selecciona imagenes a subir</p>
          </div>
        </section>
      </b-upload>
    </b-field >
    <div class="tags">
      <span v-for="(file, index) in dropFiles"
        :key="index"
        class="tag is-primary" >
        {{file.name}}
        <button class="delete is-small"
            type="button"
            @click="deleteDropFile(index)">
        </button>
      </span>
    </div>
    <b-button @click="createAD()" class="is-primary">Enviar</b-button>
  </section>
</template>

<script>
var cc = require('currency-codes');
import PetitionsMixin from '@/components/mixins/petitions'
import Classifieds from '@/api/classifieds'

export default {
  props: {
    mode: {
      type: String,
      default: "create"
    }
  },
  data() {
    return {
      dropFiles: [],
      allowedCurrencies: ['EUR', 'USD', 'MXN', 'ARS'],
      selectedCurrency: 'EUR',
      description: '',
      title: '',
      price: 0.0
    }
  },
  mixins: [PetitionsMixin],
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1)
    },
    getAllowedCurrencies() {
      var result = []
      for (const iterator of this.allowedCurrencies) {
        result.push(cc.code(iterator))
      }
      return result
    },
    createAD() {
      var request = {
        content: this.description,
        price: this.price,
        price_currency: this.selectedCurrency,
        title: this.title
      }
      var form_data = new FormData();

      var options = {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form_data._boundary}`
        }
      }
      for ( var key in request ) {
        form_data.append(key, request[key]);
      }
      var i = 0;
      for (var file of this.dropFiles) {
          form_data.append("image" + i.toString(), file);
          i++;
      }
      form_data.append("image_count", this.dropFiles.length)
      this.$awn.async(this.makePetition(Classifieds.createAD(form_data, options), true, true), 'Anuncio creado correctamente.',
        'Error creando anuncio', 'Creando anuncio').then((newAD) => {
        this.$router.push({ name: 'classifieds_view', params: { slug: newAD.data.slug } })
      }).catch((error) => {
        reject(error)
      })
    }
  }
}
</script>

<style>
.upload-draggable, .upload {
  width: 100%;
}
</style>