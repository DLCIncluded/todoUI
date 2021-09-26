<template>
<div class="tab" @click="this.showNav=true">
	<i class="fas fa-chevron-circle-down" ></i>Menu
</div>
<div class="nav-container" :class="showNav ? 'active' : ''">
	<div class="nav card" @click="this.showNav=false">
		<h2>Navigation</h2>
		<div class="list-item"><router-link to="/">Home</router-link></div>
		<div class="list-item"><router-link to="/about">About</router-link></div>
		<div class="list-item"><router-link to="/lists">Lists</router-link></div>
		<div class="list-item" v-if="!isLoggedIn"><router-link to="/login">Login</router-link></div>
		<div class="list-item" v-else><a @click.prevent='logout' href="">Logout</a></div>
		<div class="list-item closebtn"><i class="fas fa-chevron-circle-up"></i> Close</div>
	</div>
	
</div>

  <router-view/>
</template>

<script>
export default {
	data() {
		return {
			showNav: false,
		}
	},
	created() {
		this.$store.dispatch('authCheck');
		console.log(this.$store.getters.authGetter)
	},
	computed: {
		isLoggedIn(){
			return this.$store.getters.authGetter
		}
	},
	methods: {
		logout(){
			this.$store.dispatch('logout')
		}
	}
}
</script>


<style>
@import 'assets/css/main.min.css';
</style>
