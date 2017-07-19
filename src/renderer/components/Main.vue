<template lang='pug'>
  div#wrapper
    p main
</template>

<script>
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    async created () {
      if (db.get(db.keys.orgs) === undefined || db.get(db.keys.orgs) === null) {
        this.$router.push('organizations')
      }
      if (db.get(db.keys.repos) === undefined || db.get(db.keys.repos) === null) {
        this.$router.push('repositories')
      }

      // let repo = await client.repositories()
      // console.log(repo)
      // client.pull_requests('muumuu-domain/muu.rb')
      //   .then(function (response) {
      //     console.log(response)
      //   })
    },
    methods: {
      async fetchRepositories () {
        let repos = []
        for (let org of db.get(db.keys.orgs)) {
          for (let repo of await client.repositories(org.name)) {
            repos.push({
              name: repo.name
            })
          }
          break
        }
        db.set(db.keys.repos, repos)
      }
    }
  }
</script>

<style lang='scss'>
</style>
