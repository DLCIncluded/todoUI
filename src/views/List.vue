<template>
<div class="container">

	<div class="card-container">
		<div class="card">
			<div class="card-head">
				<div>
					<h1>{{currentList.list_name}}</h1>
					<p v-if="currentList.list_description!=''">{{currentList.list_description}}</p>
					<!-- <p class="share-link">Share<i class="fas fa-share-alt"></i></p> -->
				</div>
				<div class="control-buttons">
					<Button text="Edit List" icon="far fa-edit" @click="goToEdit()"/>
					<Button text="New Item" icon="fas fa-plus-circle" type="new" @click="goToNewItem()"/>
					<Button text="Share" icon="fas fa-share-alt" type="new" @click="share"/>
				</div>
			</div>
			
			<div class="card-body">
				<transition name="fade">
					<div v-if="isLoading">
						<div class="spinner">
							<div></div><div></div><div></div><div></div>
						</div>
					</div>
				</transition>

				
				<div class="list-item cursor-pointer flex-between" v-if="isLoading==false && listItems==null" @click="goToNewItem()">
					<p >No items found, please create one!</p>
				</div>
				
				<div v-if="error!=null">
					<p>{{error}}</p>
				</div>

				<div>	
					<draggable 
					v-model="listItems" 
					delay-on-touch-only="true"
					delay="100"
					@start="drag=true" 
					@end="drag=false;saveOrderTodo()" 
					ghost-class="ghost"
					item-key="id">
						<transition-group>
							<div class="list-item cursor-pointer flex-between" v-for="todo in listItems" :key="todo.id" @click="markDone(todo.id);todo.done=!todo.done" :class="todo.done==0 ? '' : 'done'">
									<!-- set todo.done=1 on click to avoid the delay on sending the update to the server and waiting on the list to re-render -->
								<p>{{todo.name}}</p>
								<div style="flex-shrink:0">
									<i class="fas fa-trash-alt trash" @click.stop="trash(todo.id, todo.name, 'todo');showDeletePrompt=true"></i>
									<i class="far fa-check-circle primary" v-if="todo.done==1"></i>
									<i class="far fa-circle primary" v-else></i>
								</div>
							</div>
						</transition-group>
					</draggable>
					<!-- <div v-if="showDeleteAll" class="cursor-pointer" style="text-align:center; margin-top:1em" @click.prevent="showDeleteAllPrompt=true">Delete all completed</div> -->
					<Button v-if="showDeleteAll" text="Delete All Completed" class="fill" @click.prevent="showDeleteAllPrompt=true"/>
					<!-- <div class="list-item" v-for="todo in todos" :key="todo.id">{{todo.name}}</div> -->
				</div>
			</div>
		</div>
	</div>
</div>

<transition name="fade">
<div class="popup-container" v-if="showDeleteAllPrompt">
	<div class="popup-backdrop"></div>
	<div class="popup card active">
		<div class="card-head">
			<h3>Warning! Please Confirm</h3>
		</div>
		<div class="card-body">
			<p>Are you sure you wish to delete all completed items from "{{currentList.list_name}}"</p>
			<div class="flex-fill">
				<div class="btn cancel" @click.prevent="showDeleteAllPrompt=false;"><i class="fas fa-times-circle"></i> Cancel</div>
				<div class="btn confirm" @click.prevent="deleteCompleted();"><i class="fas fa-trash-alt"></i> Delete</div>
			</div>
		</div>
	</div>
</div>
</transition>
</template>

<script>
import axios from 'axios'
import { VueDraggableNext } from 'vue-draggable-next'
import Button from '@/components/Button.vue'
export default {
	data() {
		return {
			listId: this.$route.params.id,
			currentList: {list_name: "List Name"},
			listItems: null,
			isLoading: true,
			error: null,
			showDeleteAllPrompt: false,
		}
	},
	components: {
        draggable: VueDraggableNext,
		Button,
    },
	methods: {
		async getList(loading = true){
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
			this.isLoading = loading;

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
		goToEdit(){
			this.$router.push({ path: `/editlist/${this.listId}` })
		},
		goToNewItem(){
			this.$router.push({ path: `/newitem/${this.listId}` })
		},
		async markDone(todo_id){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			fd.append('todo_id', todo_id);
			
			await axios.post("server.php?action=markdone", fd).then(function(response){
				console.log(response.data)
				if(response.data.error){
					console.log(response.data.error)
					// v.error = response.data.message
				}else{
					console.log(response.data.message)
					v.getList(false);//get list items with out showing loader
				}
			})
		},
		async deleteCompleted(){
			var v = this;
			v.isLoading = true;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			fd.append('list_id', this.listId)

			await axios.post("server.php?action=deletecompleted",fd).then(function(response){
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
						message: "Successfully deleted completed todos."
					})	
				}				
			}).then(() =>{
				v.showDeleteAllPrompt = false;
				v.isLoading = false;
				v.getList(false);
			})
		},
		async saveOrderTodo(){
            this.listItems.forEach(async function(element,index) {
                var sortOrder = index+1;
                // console.log(element.id + " - " + element.name + " - " + sortOrder);
                // var v = this;
				var fd = new FormData();
				fd.append('id', localStorage.id);
				fd.append('token', localStorage.token)
				fd.append('todo_id', element.id);
				fd.append('sort_order', sortOrder);

                
                await axios.post("server.php?action=updatetodosortorder", fd).then(function(response){
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
	},
	created() {
		this.getList();
	},
	computed: {
		showDeleteAll(){
			if(this.listItems == null){
				return false;
			}
			// console.log(this.listItems)
			// console.log("test"+this.listItems.some(code=> code.done === '1'));
			return this.listItems.some(code => code.done === '1')

		},
	}
}
</script>

<style>

</style>