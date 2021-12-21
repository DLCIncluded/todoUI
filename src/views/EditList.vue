<template>
<div class="container">
	<div class="card-container">
		<div class="card">
			<!-- <div>
				<Button text="Back to Lists"/>
			</div> -->
			<div class="card-head">
				<div>
					<h1>Edit List</h1>
				</div>
				<!-- <Button text="Edit List" @click="goToEdit()"/> -->
			</div>
			<div class="card-body">

				<transition name="fade">
					<div v-if="isLoading">
						<div class="spinner">
							<div></div><div></div><div></div><div></div>
						</div>
					</div>
				</transition>
				<transition name="fade">
					<div v-if="!isLoading">
						<form @submit.prevent="editList();">
							<div class="input-group">
								<label for="list-name">List Name:</label>
								<input type="text" name="list-name" v-model="currentList.list_name" placeholder="List Name" autocomplete="off" />
							</div>
							<div class="input-group">
								<label for="list-description">List Description:</label>
								<input type="text" v-model="currentList.list_description" name="list-description" placeholder="List Description(optional)" autocomplete="off" />
							</div>
							<div class="input-group">
								<button type="submit" name="submit">Save</button>
								<!-- <button type="submit" @click.prevent="cancel()">Cancel</button> -->
								<Button text="Cancel" type="cancel-full" @click.prevent="cancel()"/>
							</div>
						</form>
					</div>
				</transition>
				
			</div>
		</div>
	</div>
	
</div>
</template>

<script>
import Button from '@/components/Button.vue'
import axios from 'axios';
export default {
	data() {
		return {
			isLoading:true,
			currentList: []
		}
	},
	components: {
		Button,
	},
	methods: {
		async getList(){
			if(this.listId == null){
				console.log("No ID Provided");
				return;
			}
			var v = this;
			// v.todos = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('list_id', v.listId);
			fd.append('token', localStorage.token);
			// this.isLoading = loading;

			await axios.post("server.php?action=getlist",fd).then(function(response){
				console.log(response.data)
				if(response.data.error){
					v.isLoading = false;
					v.currentList.list_name = "Error!"
					v.error = "You do not have access, or that List does not exist!"
					return;
				}if(response.data.message == "No todo items."){
					console.log('no list items found')
					v.listItems = null
					v.currentList = response.data.list;
				}
				else{
					v.currentList = response.data.list;
					v.listItems = response.data.todos;
				}
			}).then(()=>{
				v.isLoading = false;
				// console.log(v.showDeleteAll)
			})
		},
		cancel(){
			this.$router.push({ path: `/list/${this.listId}` })
		},
		async editList(){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			fd.append('list_id', this.currentList.list_id)
			fd.append('list_description', this.currentList.list_description)
			fd.append('list_name', this.currentList.list_name)

			await axios.post("server.php?action=editlist",fd).then(function(response){
				// console.log(response.data)
				if(response.data.error){
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})
					// return response.data.error;						
				}else{
					console.log(response.data);
					v.showEditListPrompt = false;
					v.listActive = true;
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})	
					v.$router.push({ path: `/list/${v.listId}` })
				}

				
			}).then(() =>{
				v.getLists();
			})
		},
	},
	computed: {
		listId(){
			return this.$route.params.id;
		}
	},
	created(){
		this.getList();
	}
}
</script>

<style>

</style>