<template>
	<div class="container">
		<div class="card">
			<div class="card-head" >
				<h1>Login</h1>
			</div>
			<div class="card-body">
				<form @submit.prevent="login()">
					<div class="input-group">
						<!-- <h3>Username</h3>  -->
						<input type="text" name="username" v-model="username" placeholder="Username"/>
					</div>
					<div class="input-group">
						<!-- <h3>Password</h3>  -->
						<input type="password" v-model="password" name="password" placeholder="Password"/>
					</div>
					<div class="input-group">
						<!-- <h3>Password</h3>  -->
						<input type="submit" name="submit"/>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		test(){
			console.log('test');
		},
		async login(){
			
			var v=this;
			await v.$store.dispatch('login', {
				username: v.username,
				password: v.password,
			});
		}
	}
}
</script>
