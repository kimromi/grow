<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      h1 choose organizations
      form
        .checkbox(v-for="org of organizations")
          label
            input(type="checkbox" :id="org.name" v-model="org.managed")
            span {{ org.name }}
      button.btn.btn-positive.btn-large(@click="ok") OK
</template>

<script>
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    data () {
      return {
        organizations: {}
      }
    },
    watch: {
      organizations: {
        deep: true,
        handler () {
          db.set(db.keys.orgs, this.organizations)
        }
      }
    },
    async mounted () {
      if (db.get(db.keys.orgs) === undefined || db.get(db.keys.orgs) === null) {
        db.set(db.keys.orgs, await this.fetchOrganizations())
      }
      this.organizations = db.get(db.keys.orgs)
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
        return orgs
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
