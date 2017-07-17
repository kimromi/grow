<template lang='pug'>
  div#wrapper
    h2 choose organizations
    ul
      li(v-for="org of organizations")
        input(type="checkbox" :id="org.name" v-model="org.managed")
        label(:for="org.name") {{ org.name }}
    button(@click="back") OK
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
