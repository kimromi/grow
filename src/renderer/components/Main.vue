<template lang='pug'>
  div#wrapper
    p main
</template>

<script>
  import db from '../lib/github_db'

  export default {
    async created () {
      if (db.get(db.keys.orgs) === undefined || db.get(db.keys.orgs) === null) {
        this.$router.push('organizations')
        return
      }
      if (db.get(db.keys.repos) === undefined || db.get(db.keys.repos) === null) {
        this.$router.push('repositories')
      }
    }
  }
</script>

<style lang='scss'>
</style>
