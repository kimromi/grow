<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      form
        .form-group
          label API URL
            span.note  (ex. https://github.com/api/v3)
          input.form-control(v-model="apiUrl")
        .form-group
          label WEB URL
            span.note  (ex. https://github.com)
          input.form-control(v-model="webUrl")
        .form-group
          label API token
          input.form-control(v-model="token")
        button.btn.btn-positive.btn-large(@click="confirm") Confirm
        span.correct  {{ correctMessage }}
        p.error(v-for="message of errorMessages")
          | {{ message }}
</template>

<script>
  import client from '../lib/github_client'
  import config from '../lib/config'

  export default {
    data () {
      return {
        apiUrl: config.get(config.keys.ghe.apiUrl) || '',
        webUrl: config.get(config.keys.ghe.webUrl) || '',
        token: config.get(config.keys.ghe.token) || '',
        errorMessages: [],
        correctMessage: ''
      }
    },
    methods: {
      validate () {
        this.errorMessages = []
        if (this.apiUrl === '') this.errorMessages.push('input API URL.')
        if (this.webUrl === '') this.errorMessages.push('input WEB URL.')
        if (this.token === '') this.errorMessages.push('input API token.')

        return this.errorMessages.length === 0
      },
      confirm () {
        if (!this.validate()) return

        client.check(this.apiUrl, this.token)
          .then(function (response) {
            if (response.status === 200) {
              config.set(config.keys.ghe.apiUrl, this.apiUrl)
              config.set(config.keys.ghe.webUrl, this.webUrl)
              config.set(config.keys.ghe.token, this.token)
              this.correctMessage = 'correct!'

              var self = this
              setTimeout(() => {
                self.$router.push('main')
              }, 1100)
            }
          }.bind(this))
          .catch(function () {
            this.errorMessages.push('authorization error')
          }.bind(this))
      }
    }
  }
</script>

<style lang='scss'>
  .pane {
    padding: 15px;
  }
  .note {
    color: gray;
  }
  .error {
    color: red;
  }
  .correct {
    color: green;
  }
</style>
