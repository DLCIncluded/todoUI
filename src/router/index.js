import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/lists',
    name: 'Lists',
	meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "lists" */ '../views/Lists.vue')
  },
  {
    path: '/login',
    name: 'Login',
	meta: {requiresUnAuth: true},
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(function(to,from,next){
	if(to.meta.requiresAuth && !store.getters.authGetter){
		// if we need to be logged in and we are note logged 
		next('/login');
	} else if(to.meta.requiresUnAuth && store.getters.authGetter){
		//if we shouldnt be logged in and try to get to something while logged in ie register / login
		next('/');
	} else {
		next();
	}
})

export default router
