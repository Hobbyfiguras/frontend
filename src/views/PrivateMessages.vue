<template>
<div>
  <div class="container">
    <p class="title">Mensajes privados</p>
    <b-tabs>
      <b-tab-item label="Recibidos">
        <PrivateMessageList/>
      </b-tab-item>
      <b-tab-item label="Enviados">
        <PrivateMessageList sent/>
      </b-tab-item>
    </b-tabs>
    <div>
  </div>
  </div>
</div>
</template>

<script>
import PrivateMessageList from '@/components/PrivateMessageList'
export default {
  components: {
    PrivateMessageList
  }
}
</script>

<style scoped>
</style>
