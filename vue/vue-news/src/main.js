import Vue from 'vue';
import VueRouter from 'vue-router';

import { domain, fromNow } from './filters/index.js';

import App from './components/App.vue';
import NewsView from './components/NewsView.vue';
import ItemView from './components/ItemView.vue';
import UserView from './components/UserView.vue';

Vue.use(VueRouter);

Vue.filters('fromNow', fromNow);
Vue.filters('domain', domain);

const router = new VueRouter();

router.map({
	
});

router.start(App, '#app');