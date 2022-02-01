import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Store from '@/store/index';

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/parts',
    name: 'Parts',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Parts.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,

})

router.beforeEach(async (to, from, next) => {
  if (!Store.state.user) {
    if (!to.params.noSession ) {
      try {
        // No user exists
        console.log('no user saved, preparing to validate session');
        // try to get one if an authcookie is present
        await Store.dispatch('sessionLogin');
      } catch (error) {
        console.log('no previous session');
      }
    }

    if (!Store.state.user) {
      if (to.name !== 'Home') {
        next({ name: 'Home', params: { noSession: true } })
      }
      else {
        next();
      }
    }
    else {
      console.log('retrieved session');
      next({ name: 'Parts' });
    }
  }
  else {
    console.log('session valid');
    switch (to.name) {
      case 'Home':
        next({ name: 'Parts' });

      case 'Parts':
        next();
    }
  }
})

export default router
