<template>
  <Picker :i18n="i18n" title="" set="twitter" emoji="thinking_face" @select="(emoji) => $emit('select', emoji)" />
</template>

<script>
import { Picker } from 'emoji-mart-vue'
export default {
  components: { Picker },
  data () {
    return {
      i18n: {
        search: 'Buscar',
        notfound: 'No se ha encontrado ningún Emoji',
        categories: {
          search: 'Resultados De Busqueda',
          recent: 'Recientes',
          people: 'Emoticonos y Personas',
          nature: 'Animales y Naturaleza',
          foods: 'Alimentos y Bebidas',
          activity: 'Actividades',
          places: 'Viajes y Lugares',
          objects: 'Objetos',
          symbols: 'Símbolos',
          flags: 'Banderas',
          custom: 'Otros',
        }
      }
    }
  }

}
</script>
