<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      form
        .form-group
          router-link(to="/github")
            button.btn.btn-large.btn-default GitHub
        .form-group
          router-link(to="/github-enterprise")
            button.btn.btn-large.btn-default GitHub Enterprise
</template>

<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>

<style lang='scss'>
</style>
