import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/Login')
    },
    {
      path: '/github',
      name: 'github',
      component: require('@/components/Github')
    },
    {
      path: '/github-enterprise',
      name: 'github enterprise',
      component: require('@/components/Github_Enterprise')
    },
    {
      path: '/main',
      name: 'main',
      component: require('@/components/Main')
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: require('@/components/Organizations')
    },
    {
      path: '/repositories',
      name: 'repositories',
      component: require('@/components/Repositories')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
