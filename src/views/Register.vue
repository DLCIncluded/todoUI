<template>
	<div class="container">
		<div class="card">
			<div class="card-head" >
				<h1>Register</h1>
			</div>
			<div class="card-body">
				<div :class="isLoading ? '' : 'not-active'">
					<div class="spinner">
						<div></div><div></div><div></div><div></div>
					</div>
				</div>
				<form @submit.prevent="register()">
					<div class="input-group">
						<h3>Username</h3> 
						<input type="text" name="username" v-model="username" placeholder="Username"/>
					</div>
					<div class="input-group">
						<h3>Email</h3> 
						<input type="text" v-model="email" name="email" placeholder="Email"/>
					</div>
					<div class="input-group">
						<h3>Password</h3> 
						<input type="password" v-model="password" name="password" placeholder="Password"/>
					</div>
					<div class="input-group">
						<h3>Repeat Password</h3> 
						<input type="password" v-model="repeatPassword" name="repeatPassword" placeholder="Repeat Password"/>
					</div>
					<div class="input-group">
						<button type="submit" name="submit">Register</button>
					</div>
				</form>
				<div class="input-group">
					<!-- <h3>Password</h3>  -->
					Already have an account? - <router-link to="/login">Login!</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'Login',
	data() {
		return {
			username: '',
			email: '',
			password: '',
			repeatPassword: '',
			isLoading: false
		}
	},
	methods: {
		test(){
			console.log('test');
		},
		async register(){
			var v = this;
			if(this.username.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a username",
				});
				return;
			}
			if(this.email.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a username",
				});
				return;
			}
			if(this.password.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a password",
				});
				return;
			}
			if(this.repeatPassword.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a password",
				});
				return;
			}
			if(this.password.trim() != this.repeatPassword.trim()){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "Passwords do not match.",
				});
				return;
			}

			var fd = new FormData();
			fd.append('username', this.username);
			fd.append('email', this.email);
			fd.append('password', this.password);
			this.isLoading = true;

			await axios.post("server.php?action=register",fd).then(function(response){
				if(response.data.error){
					console.log(response.data.message);
					v.$store.dispatch('addNotification', {
						type: "error",
						message: response.data.message,
					});
				}else{
					v.$router.push('/login');
					v.$store.dispatch('addNotification', {
						type: "success",
						message: response.data.message,
					});
				}				
			}).then(()=>{
				v.isLoading = false;
			})

			
		},
		async resetPassword(){
			var v = this;

			if(this.username.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a username",
				});
				return;
			}

			if(this.newPassword.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a new password",
				});
				return;
			}

			if(this.newPasswordRepeat.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a repeat password",
				});
				return;
			}

			if(this.newPassword.trim() != this.newPasswordRepeat.trim()){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "Passwords do not match",
				});
				return;
			}

			var fd = new FormData();
			fd.append('username', v.username);
			fd.append('reset_code', v.resetCode);
			fd.append('new_password', v.newPassword);
			this.isLoading = true;

			await axios.post("server.php?action=resetpassword",fd).then(function(response){
				// console.log(response.data.lists)
				
				if(response.data.error){
					v.$store.dispatch('addNotification', {
						type: "error",
						message: response.data.message,
					});
					v.isLoading = false;
				}else{
					v.$store.dispatch('addNotification', {
						type: "success",
						message: response.data.message,
					});
					v.isLoading = false;
				}
				
			}).then(()=>{
				v.resetPasswordForm = false;
				v.newPassword = '';
				v.newPasswordRepeat = '';
				v.resetCode = '';
			})
        },
	}
}
</script>
