<template lang='pug'>
  div#wrapper
    h2 choose repositories
    ul
      li(v-for="repo of repositories")
        input(type="checkbox" :id="repo.name" v-model="repo.managed")
        label(:for="repo.name") {{ repo.org }} / {{ repo.name }}
    button(@click="back") OK
</template>

<script>
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    data () {
      return {
        repositories: {}
      }
    },
    watch: {
      repositories: {
        deep: true,
        handler () {
          db.set(db.keys.repos, this.repositories)
        }
      }
    },
    async mounted () {
      if (db.get(db.keys.repos) === undefined || db.get(db.keys.repos) === null) {
        db.set(db.keys.repos, await this.fetchRepositories())
      }
      this.repositories = db.get(db.keys.repos)
    },
    methods: {
      async fetchRepositories () {
        let repos = []
        for (let org of db.get(db.keys.orgs)) {
          if (!org.managed) continue
          for (let repo of await client.repositories(org.name)) {
            console.log(repo)
            repos.push({
              org: org.name,
              name: repo.name,
              managed: true
            })
          }
        }
        return repos
      },
      back () {
        this.$router.push('main')
      }
    }
  }
</script>

<style lang='scss'>
  li {
    list-style-type: none
  }
</style>
