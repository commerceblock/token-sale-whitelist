
// imports
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import {
  ApolloClient,
  createNetworkInterface,
} from 'apollo-client';

// local imports
import App from './App.vue';
import router from './router';
import endpoints from './lib/endpoints'

// check env
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not defined');
}

// init endpoints
endpoints.initBaseUrl(process.env.BASE_URL);
Vue.config.productionTip = false;

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    networkInterface: createNetworkInterface({
      uri: endpoints.gql(),
    }),
  }),
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  template: '<App/>',
  components: { App },
});
