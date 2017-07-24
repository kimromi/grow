<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      span(@click="oauthGithub") github
      router-link(to="/github-enterprise") GitHub Enterprise
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      oauthGithub () {
      }
    }
  }
</script>

<style lang='scss'>
</style>
