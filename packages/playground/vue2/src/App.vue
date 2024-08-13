<script lang="ts">
import Hi from './Hi.vue'
import Welcome from './Welcome'
import Count from './Count.vue'

export default {
  name: 'App',
  components: {
    Hi,
    Welcome,
    Count,
  },
}
</script>

<template>
  <div class="container">
    <div>
      <Hi />
      <Welcome />
      <Count />
      <p>Vite so awesome 🔥 .</p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  width: 100vw
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
