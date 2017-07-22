<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      h1 choose repositories
      form
        .checkbox(v-for="repo of repositories")
          label
            input(type="checkbox" :id="repo.name" v-model="repo.managed")
            span {{ repo.org }} / {{ repo.name }}
      button.btn.btn-positive.btn-large(@click="ok") OK
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
            repos.push({
              org: org.name,
              name: repo.name,
              managed: true
            })
          }
        }
        return repos
      },
      ok () {
        this.$router.push('main')
      }
    }
  }
</script>

<style lang='scss'>
  .pane {
    padding: 15px;
  }
  .checkbox {
    margin: 0;
  }
</style>
