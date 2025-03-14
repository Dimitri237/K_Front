import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import UploadImage from './components/UploadImage.vue';
// import ImageViewer from './components/ImageViewer.vue';


const routes = [
    { path: '/', component: UploadImage },
    // { path: '/viewer', component: ImageViewer },
];

const router = createRouter({
  history: createWebHistory(), 
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');

