<template>
<!-- <div class="tab" @click="this.showNav=true">
	<i class="fas fa-chevron-circle-down" ></i>Menu
</div> -->
<div class="nav-container" ><!-- :class="showNav ? 'active' : ''" -->
	<div class="nofication-bell" v-if="isLoggedIn" @click="forceRoute()">
		<router-link to="/friends"><i class="far fa-bell cursor-pointer"> {{numRequests}}</i></router-link>
	</div>
	<h2>Shit To Do</h2>
	<input type="checkbox" v-model="showNav" name="nav-toggle" id="nav-toggle" class="nav-toggle">
	<div class="nav" @click="forceRoute();showNav=false;">
		<div class="nav-item" v-if="isLoggedIn">Welcome {{username}}</div>
		<div class="nav-item"><router-link to="/">Home</router-link></div>
		<div class="nav-item"><router-link to="/about">About</router-link></div>
		<div class="nav-item"><router-link to="/lists">Lists</router-link></div>
		<div class="nav-item" v-if="isLoggedIn"><router-link to="/friends">Friends</router-link></div>
		<div class="nav-item" v-if="!isLoggedIn"><router-link to="/login">Login</router-link></div>
		<div class="nav-item" v-if="!isLoggedIn"><router-link to="/register">Register</router-link></div>
		<div class="nav-item" v-else><a @click.prevent='logout' href="">Logout</a></div>
		<!-- <div class="nav-item closebtn"><i class="fas fa-chevron-circle-up"></i> Close</div> -->
	</div>
	<label for="nav-toggle" class="nav-toggle-label"><span></span></label>
	
</div>

  <router-view/>
  
<notifications-panel></notifications-panel>

<div class="list-nav" v-if="page!='Lists'" @click="showNav=false">
	<div>
		<i class="fas fa-users fa-2x" @click="this.$router.push('/friends')"></i>
	</div>
	<div>
		
	</div>
	
	<div>
		<i class="fas fa-list-ul fa-2x" @click="this.$router.push('/lists')"></i>
	</div>
</div>
</template>

<script>
import NotificationsPanel from './components/NotificationsPanel'

export default {
	data() {
		return {
			showNav: false,
			timer:null,
		}
	},
	created() {
		this.$store.dispatch('authCheck');
		this.$store.dispatch('getFriendRequests');
		this.refreshData();		
		// console.log(this.$store.getters.authGetter)
		// console.log(process.env.VUE_APP_BASE_URL);
	},
	computed: {
		isLoggedIn(){
			return this.$store.getters.authGetter
		},
		username(){
			return this.$store.getters.userGetter
		},
		page(){
			return this.$route.name;
		},
		numRequests(){
			return this.$store.getters.requestsNumGetter;
		}
	},
	methods: {
		refreshData(){
            this.timer = setInterval(() => {
				this.$store.dispatch('getFriendRequests');
				this.$store.dispatch('getPendingRequests');
				this.$store.dispatch('getFriends');
            }, 5000)
        },
		logout(){
			this.$store.dispatch('logout')
		},
		forceRoute() {
			this.$store.dispatch('setForceRoute');
		},
	},
	components:{
		NotificationsPanel
	},
	unmounted() {
		clearInterval(this.timer)
	},
}
</script>


<style>
@import 'assets/css/main.min.css';
</style>
