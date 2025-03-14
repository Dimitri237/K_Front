import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import UploadImage from './components/UploadImage.vue';
import Enregistrer  from './components/SignPage.vue';
import Login  from './components/LoginPage.vue';
import loading  from './components/LoadingPage.vue';


const routes = [
    { path: '/home', component: UploadImage },
    { path: '/Enregistrer', component: Enregistrer },
    { path: '/login', component: Login },
    { path: '/', component: loading },
];

const router = createRouter({
  history: createWebHistory(), 
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');

