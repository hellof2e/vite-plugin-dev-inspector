<script lang="ts">
import Hi from './Hi.vue'
import Welcome from './Welcome'

export default {
  name: 'App',
  components: {
    Hi,
    Welcome,
  },
}
</script>

<template>
  <div class="container">
    <div>
      <Hi />
      <Welcome />
      <p>Vite so awesome 🔥 .</p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  width: 100vw
  height: 100vh
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  display: flex
  align-items: center
  justify-content: center
p
  font-size: 18px
  color: #35495d
  cursor: pointer
</style>
