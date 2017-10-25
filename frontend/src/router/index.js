
// imports
import Vue from 'vue';
import Router from 'vue-router';

// local imports
import Home from '../components/Home.vue';
import Address from '../components/Address.vue';
import KYCForm from '../components/KYCForm.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      props: (route) => ({ refId: route.query.ref }),
    },
    {
      path: '/addresses/:id',
      name: 'Address',
      component: Address,
      props: (route) => ({ address: route.params.id }),
    },
    {
      path: '/addresses/:id/kyc',
      name: 'KYCForm',
      component: KYCForm,
      props: (route) => ({ address: route.params.id }),
    },
  ],
});
