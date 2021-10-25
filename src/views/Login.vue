<template>
	<div class="container">
		<div class="card" v-if="!resetPasswordForm">
			<div class="card-head" >
				<h1>Login</h1>
			</div>
			<div class="card-body">
				<div :class="isLoading ? '' : 'not-active'">
					<div class="spinner">
						<div></div><div></div><div></div><div></div>
					</div>
				</div>
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
						<button type="submit" name="submit">Login</button>
					</div>
				</form>
				<div class="input-group">
					<!-- <h3>Password</h3>  -->
					<a href="#" @click.prevent="requestReset()">Forgot Password?</a> - Have a code? <a href="#" @click.prevent="resetPasswordForm = !resetPasswordForm">Reset Password</a> - <router-link to="/register">Register</router-link>
				</div>
			</div>
		</div>


		<div class="card" v-if="resetPasswordForm">
			<div class="card-head" >
				<h1>Reset Password</h1>
			</div>
			<div class="card-body">
				<div :class="isLoading ? '' : 'not-active'">
					<div class="spinner">
						<div></div><div></div><div></div><div></div>
					</div>
				</div>
				<form @submit.prevent="resetPassword()">
					<div class="input-group">
						<h3>Username</h3> 
						<input type="text" name="username" v-model="username" placeholder="Username"/>
					</div>
					<div class="input-group">
						<h3>Reset Code From Email</h3> 
						<input type="text" v-model="resetCode" name="resetCode" placeholder="Code From Email"/>
					</div>
					<div class="input-group">
						<h3>New Password</h3> 
						<input type="password" v-model="newPassword" name="newPassword" placeholder="New Password"/>
					</div>
					<div class="input-group">
						<h3>Repeat New Password</h3> 
						<input type="password" v-model="newPasswordRepeat" name="newPasswordRepeat" placeholder="Repeat New Password"/>
					</div>
					<div class="input-group">
						<button type="submit" name="submit">Reset Password</button>
					</div>
				</form>
				<div class="input-group">
					<!-- <h3>Password</h3>  -->
					<a href="#" @click.prevent="resetPasswordForm = false">Cancel</a>
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
			password: '',
			resetCode: '',
			newPassword: '',
			newPasswordRepeat: '',
			resetPasswordForm: false,
			isLoading: false
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
		},
		async requestReset(){
			var v = this;
			if(this.username.trim() == ""){
				this.$store.dispatch('addNotification', {
					type: "error",
					message: "please input a username",
				});
				return;
			}

			var fd = new FormData();
			fd.append('username', this.username);
			this.isLoading = true;

			await axios.post("server.php?action=passwordresetrequest",fd).then(function(response){
				if(response.data.error){
					
					console.log(response.data.message);
					v.$store.dispatch('addNotification', {
						type: "error",
						message: response.data.message,
					});
				}else{
					v.$store.dispatch('addNotification', {
						type: "success",
						message: response.data.message,
					});
				}
				
			}).then(()=>{
				v.resetPasswordForm = true;
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
