
// imports
import Vue from 'vue';
import Router from 'vue-router';

// local imports
import Home from '../components/Home.vue';
import Address from '../components/Address.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      props: (route) => ({ refId: route.query.ref })
    },
    {
      path: '/address/:id',
      name: 'Address',
      component: Address,
      props: (route) => ({ address: route.params.id })
    }
  ]
});
