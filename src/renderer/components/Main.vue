<template lang='pug'>
  div#wrapper
    p main
</template>

<script>
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    async created () {
      if (db.get(db.keys.orgs) === undefined) {
        await this.fetchOrganizations()
      }
      if (db.get(db.keys.repos) === undefined) {
        await this.fetchRepositories()
      }
      // let repo = await client.repositories()
      // console.log(repo)
      // client.pull_requests('muumuu-domain/muu.rb')
      //   .then(function (response) {
      //     console.log(response)
      //   })
    },
    methods: {
      async fetchOrganizations () {
        let orgs = []
        for (let org of await client.organizations()) {
          orgs.push({
            name: org.login,
            managed: false
          })
        }
        db.set(db.keys.orgs, orgs)
      },
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
