<template>

<div class="container">
	<div class="card-container" v-if="!showNewListPrompt">
		<div class="card">
			<div class="card-head">
				<h1>Your Lists</h1>
				<!-- <i class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewListPrompt=true;currentPage='newList'"></i> -->
				<div class="control-buttons">
					<Button text="New List" icon="fas fa-plus-circle" type="new" @click="showNewListPrompt=true;"/>
				</div>
			</div>
			<div class="card-body">
				<div v-if="isLoading">
					<div class="spinner">
						<div></div><div></div><div></div><div></div>
					</div>
				</div>

				<div v-if="!isLoading">
					<draggable 
					v-model="lists" 
					delay-on-touch-only="true"
					delay="100"
					@start="drag=true" 
					@end="drag=false;saveOrderList()" 
					ghost-class="ghost"
					item-key="id">
						<transition-group>
							<div class="list-item cursor-pointer flex-between" v-for="list in lists" :key="list.id" @click="goToList(list.id)">
								<div class="list-info">
									<p class="list-text-large">{{list.name}}</p>
									<p class="list-text-small">Owner: {{list.owner}}</p>
									<p class="list-text-small">List Type: {{list.list_type}}</p>
								</div>

								<div class="list-controls">
									<i class="fas fa-trash-alt trash" @click.stop="trash(list.id, list.name, 'list');showDeletePrompt=true"></i>
									<i class="back-button fas fa-chevron-circle-right"></i>
								</div>
							</div>
						</transition-group>
					</draggable>
				</div>
				

				<div v-if="!isLoading && lists==null">
					<p>No Lists, Please create one Using the button below.</p>
				</div>
			
			</div>
		</div>
	</div>
</div>

<div class="card-container" v-if="showNewListPrompt">
	<div class="card">
		<div class="card-head">
			<h1>Create New List</h1>
		</div>
		<div class="card-body">
			<div>
				<form @submit.prevent="newList();">
					<div class="input-group">
						<input type="text" name="list-name" v-model="newListName" placeholder="List Name" autocomplete="off" />
					</div>
					<div class="input-group">
						<input type="text" v-model="newListDescription" name="description" placeholder="List Description(optional)" autocomplete="off" />
					</div>
					<div class="input-group">
						<button type="submit" name="submit">Save</button>
						<Button text="Cancel" type="cancel-full" @click="showNewListPrompt=false;newListDescription='';newListName=''"/>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<transition name="fade">
<div class="popup-container" v-if="showDeletePrompt">
	<div class="popup-backdrop"></div>
	<div class="popup card active">
		<div class="card-head">
			<h3>Warning! Please Confirm</h3>
		</div>
		<div class="card-body">
			<p>Are you sure you wish to delete "{{currentlyDeleting}}"</p>
			<div class="flex-fill">

				<div class="btn cancel" @click.prevent="showDeletePrompt=false;"><i class="fas fa-times-circle"></i> Cancel</div>
				<div class="btn confirm" @click.prevent="deleteItem();"><i class="fas fa-trash-alt"></i> Delete</div>
			</div>
			
		</div>
	</div>
</div>
</transition>




<!-- current: {{currentPage}} - previous: {{previousPage}} -->
</template>

<script>
import axios from 'axios';
import { VueDraggableNext } from 'vue-draggable-next'
import Button from "@/components/Button.vue"
export default {	
	name: 'Lists',
	data(){
		return {
			listName: '',
			showNewListPrompt: false,
			showEditListPrompt: false,
			showNewTodoPrompt: false,
			showDeletePrompt: false,
			showDeleteAllPrompt: false,
			currentList: "",
			currentListId: -1,
			currentListDescription: "",
			currentListOwner: '',
			isLoading: true,
			lists:  [],
			todos: null,
			newListDescription: '',
			newListName: '',
			currentlyDeleting: '',
			currentlyDeletingId: -1,
			timer: null,
		}
	},
	components: {
        draggable: VueDraggableNext,
		Button,
    },
	methods: {
		trash(id, name){
			var v = this;
			v.showDeletePrompt = true;
			v.currentlyDeleting = name;
			v.currentlyDeletingId = id;
		},
		editCurrentList(id){
			this.showEditListPrompt = true;
			this.listActive = false;
			// this.getFriends();
			// this.getCurrentAccess();
			console.log(id)
		},
		async removeList(id=localStorage.id){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			fd.append('user_id', id)
			fd.append('list_id', this.currentListId)

			await axios.post("server.php?action=removelist",fd).then(function(response){
				// console.log(response.data)
				if(response.data.error){
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})
					// return response.data.error;						
				}else{
					console.log(response.data);
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})	
				}

				
			}).then(() =>{
				v.getLists();
				v.getFriends();
				v.getCurrentAccess();
			})
		},
		async getLists(loading=true){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			this.isLoading = loading;
			await axios.post("server.php?action=getlists",fd).then(function(response){
				console.log(response.data)
				if(response.data.error){
					v.isLoading = false;
					return response.data.error					
				}else{
					v.lists = response.data.lists;
					console.log(response.data.lists);
					v.isLoading = false;
				}
				
			})
        },
		async newList(){
			var v = this;
			if(v.newListName.trim() == ''){
				v.$store.dispatch('addNotification',{
					type: "error",
					message: "Sorry you must at least enter a name."
				})
				return;
			}
			await v.$store.dispatch('newList', {
				listName: v.newListName,
				listDescription: v.newListDescription,
			}).then(function(){
				v.newListName = "";
				v.newListDescription = "";
				v.showNewListPrompt = false;
				v.isLoading = true;
				v.getLists();
				v.setPage('lists');
			});
		},
		async saveOrderList(){
            this.lists.forEach(async function(element,index) {
                var sortOrder = index+1;
                // console.log(element.id + " - " + element.name + " - " + sortOrder);
                // var v = this;
				var fd = new FormData();
				fd.append('id', localStorage.id);
				fd.append('token', localStorage.token)
				fd.append('list_id', element.id);
				fd.append('sort_order', sortOrder);

                
                await axios.post("server.php?action=updatelistsortorder", fd).then(function(response){
                    console.log(response.data)
                    if(response.data.error){
                        console.log(response.data.error)
                        // v.error = response.data.message
                    }else{
                        console.log(response.data.message)
                        // v.todoLists = []
                        // v.todoLists = response.data.lists
                        
                    }
                })
            }
            );
            if(this.error){
				console.log('error')
                // this.$store.dispatch('addNotification',{type: 'error',message:this.error})
            }else{
				console.log('success')
                // this.$store.dispatch('addNotification',{type: 'success',message:"Saved sorting order!"})
            }
        },
		async getCurrentAccess(){
			var v = this;
			v.currentAccess = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('list_id', this.currentListId);
			this.isLoading = true;

			await axios.post("server.php?action=getlistusers",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					v.isLoading = false;
				}else{
					v.currentAccess = response.data.users;
					console.log(response.data);
					v.isLoading = false;
				}
				
			})
        },
		goToList(id){
			this.$router.push({ path: `/list/${id}` })
		},
		refreshData(){
            console.log("refresh data")
            this.timer = setInterval(() => {
				this.getLists(false);
            }, 5000)
        },
	},
	created() {
		var v = this;
		v.getLists();
	},
	mounted() {
		this.refreshData();
	},
	unmounted() {
		clearInterval(this.timer)
	},
    computed: {
		listOwner() {
			if(localStorage.username == this.currentListOwner) {
				return true;
			} else {
				return false;
			}
		},
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        },
    },
}
</script>
