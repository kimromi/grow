<template lang='pug'>
  #app
    .window
      .window-content
        router-view
</template>

<script>
  export default {
    data () {
      return {
        name: 'grow'
      }
    }
  }
</script>

<style>
</style>
