<template>

		<div class="friends-container">
			<div class="card">
				<div class="card-head" >
					<h3>Friends</h3>
				</div>
				<div class="card-body">		
					Friends: {{friendReqUsername}}
					<ul>
						<li v-if="!friends">No Friends</li>
						<li v-for="friend in friends" :key="friend.id"><span>{{friend.username}}</span> <i class="fas fa-user-times  cursor-pointer error-text" @click.prevent="showDeletePrompt=true;toDeleteId=friend.id"> Remove Friend</i></li>
					</ul>	

				</div>
				
			</div>
			<div class="card">
				<div class="card-head"><h3>New Request</h3></div>
				<form @submit.prevent="friendRequest" autocomplete="off">
					<p>Please enter the username of the person you would like to send a friend request to:</p><br>
					<div class="input-group">
						<input type="text" class="username-check" name="request" autocomplete="off" placeholder="Username" :value='friendReqUsername' @input='evt=>friendReqUsername=evt.target.value' @keyup="checkUsername(friendReqUsername)" @blur="checkUsername(friendReqUsername)"/>
						<i class="fas fa-user-times error-text" v-if="!userExists"></i>
						<i class="fas fa-user-check success-text" v-else></i>
					</div>
					<div class="input-group">
						<!-- <input type="submit" name="submit"/> -->
						<button type="submit" name="submit">Send Request</button>
					</div>
				</form>
			</div>

			<div class="card">
				<div class="card-head"><h3>Received Requests</h3></div>
				<div class="card-body">
					<ul>
						<li v-if="!friendRequests">No Requests</li>
						<li v-for="request in friendRequests" :key="request.id">
							<span>{{request.username}}</span>
							<i class="fas fa-user-check cursor-pointer success-text" @click.prevent="acceptRequest(request.id)"> Accept</i>
							<i class="fas fa-user-times  cursor-pointer error-text" @click.prevent="declineRequest(request.id)"> Decline</i>
						</li>
					</ul>
				</div>
			</div>

			<div class="card">
				<div class="card-head"><h3>Sent Requests (pending):</h3></div>
				<div class="card-body">
					<ul class="friends">
						<li v-if="!sentRequests">No Requests</li>
						<li v-for="request in sentRequests" :key="request.id">
							<span>{{request.username}}</span>
							<i class="fas fa-trash-alt cursor-pointer error-text" @click.prevent="deleteRequest(request.id)"> Delete Request</i>
						</li>
					</ul>
			</div>
		</div>
	</div>


<div class="popup-container" :class="showDeletePrompt ? '' : 'hidden'">
	<div class="popup-backdrop"></div>
	<div class="popup card active">
		<div class="card-head">
			<h3>Warning! Please Confirm</h3>
		</div>
		<div class="card-body">
			<p>Are you sure you wish to delete this friend request?</p>
			<div class="flex-fill">
				<div class="btn cancel" @click.prevent="showDeletePrompt=false;toDeleteId=null"><i class="fas fa-times-circle"></i> Cancel</div>
				<div class="btn confirm" @click.prevent="showDeletePrompt=false;deleteFriend(toDeleteId);"><i class="fas fa-trash-alt"></i> Delete</div>
			</div>
			
		</div>
	</div>
</div>

</template>

<script>
import axios from 'axios'
export default {
	data() {
		return {
			friends: null,
			friendRequests: null,
			sentRequests: null,
			friendReqUsername: "",
			showDeletePrompt: false,
			toDeleteId: null,
			userExists: false,
		}
	},
	methods: {
		async refreshAll(){
			this.getFriends();
			this.getFriendRequests();
			this.getPendingRequests();
		},
		async checkUsername(friendReqUsername){
			var v = this;
			var fd = new FormData();
			fd.append('username', friendReqUsername);
			// this.isLoading = true;

			await axios.post("server.php?action=usernamecheck",fd).then(function(response){
				console.log(response.data.message);
				if(response.data.error){
					// reusing code here so an error means success
					
					// v.isLoading = false;
					
					v.userExists = true;
				}else{
					v.userExists = false;
					
					// v.isLoading = false;
				}
				
			})
        },
		async getFriends(){
			var v = this;
			v.friends = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			this.isLoading = true;

			await axios.post("server.php?action=getfriends",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					return response.data.error		
				}else{
					v.friends = response.data.friends;
					console.log(response.data);
					// v.isLoading = false;
				}
				
			})
        },
		async getFriendRequests(){
			var v = this;
			v.friendRequests = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			// this.isLoading = true;

			await axios.post("server.php?action=getfriendrequests",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					return response.data.error		
				}else{
					v.friendRequests = response.data.requests;
					console.log(response.data);
					// v.isLoading = false;
				}
			})
        },
		async getPendingRequests(){
			var v = this;
			v.sentRequests = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			// this.isLoading = true;

			await axios.post("server.php?action=getpendingfriendrequests",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					return response.data.error		
				}else{
					v.sentRequests = response.data.requests;
					console.log(response.data);
					// v.isLoading = false;
				}
				
			})
        },
		async friendRequest(){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('friend_username', this.friendReqUsername);
			this.isLoading = true;

			await axios.post("server.php?action=friendrequest",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})	
				}else{
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})
					console.log(response.data);
					// v.isLoading = false;
				}
				
			}).then(()=>{
				v.friendReqUsername = '';
				v.refreshAll();
			})
        },
		async acceptRequest(id){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('request_id', id);
			this.isLoading = true;

			await axios.post("server.php?action=acceptfriendrequest",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})	
				}else{
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})
					console.log(response.data);
					// v.isLoading = false;
				}
				
			}).then(()=>{
				v.refreshAll();
			})
        },
		async declineRequest(id){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('request_id', id);
			this.isLoading = true;

			await axios.post("server.php?action=declinefriendrequest",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})	
				}else{
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})
					console.log(response.data);
					// v.isLoading = false;
				}
				
			}).then(() => {
				v.refreshAll();
			})
        },
		async deleteRequest(id){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('request_id', id);
			this.isLoading = true;

			await axios.post("server.php?action=deletefriendrequest",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					// v.isLoading = false;
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})	
				}else{
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})
					console.log(response.data);
					// v.isLoading = false;
				}
				
			}).then(() => {
				v.refreshAll();
			})
        },
		async deleteFriend(id){
			var v = this;
			var fd = new FormData();
			v.isLoading = true;
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('friendship_id', id);
			this.isLoading = true;

			await axios.post("server.php?action=deletefriend",fd).then(function(response){
				if(response.data.error){
					v.isLoading = false;
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})	
				}else{
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})
					console.log(response.data);
					v.isLoading = false;
				}
				
			}).then(() => {
				v.refreshAll();
			})
        },
	},
	created() {
		this.refreshAll();
	} 
		
	
}
</script>
