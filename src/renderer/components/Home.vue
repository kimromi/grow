<template lang='pug'>
  div#wrapper
    span api url
    input(v-model="apiUrl")
    span token
    input(v-model="token")
    p(@click="test") test
    p {{ message }}
</template>

<script>
  import config from '../lib/config'
  import axios from 'axios'

  export default {
    data () {
      return {
        apiUrl: '',
        token: '',
        message: ''
      }
    },
    mounted () {
      console.log(config.get(config.keys.apiUrl))
      console.log(config.get(config.keys.token))
    },
    methods: {
      test () {
        axios.get(this.apiUrl, {headers: {'Authorization': `token ${this.token}`}})
          .then(function (response) {
            if (response.status === 200) {
              config.set(config.keys.apiUrl, this.apiUrl)
              config.set(config.keys.token, this.token)
              this.message = 'correct!'
            }
          }.bind(this))
          .catch(function () {
            this.message = 'authorization error'
          }.bind(this))
      }
    }
  }
</script>

<style lang='scss'>
  span {
    color: red;
  }
</style>
