<template>
<div class="container">
	<div class="card" :class="[listActive ? 'not-active-left' : '',showNewListPrompt ? 'not-active-left' : '']">
		<div class="card-head" >
			<h1>Your Lists</h1>
			<i class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewListPrompt=true"></i>
		</div>
		<div class="card-body">
			<div :class="isLoading ? '' : 'not-active'">
				<div class="spinner">
					<div></div><div></div><div></div><div></div>
				</div>
			</div>
			
			
			<div :class="isLoading ? 'not-active' : ''">	
				<draggable 
				v-model="lists" 
				@start="drag=true" 
				@end="drag=false;saveOrderList()" 
				ghost-class="ghost"
				item-key="id">
					<transition-group>
						<div class="list-item cursor-pointer flex-between" v-for="list in lists" :key="list.id" @click.prevent="showList(list.id, list.name);showLoader()">
							<p>{{list.name}}</p>
							<div>
								<i class="fas fa-trash-alt trash" @click.prevent="trashclicked=true;trash(list.id, list.name, 'list')"></i>
								<i class="back-button fas fa-chevron-circle-right"></i>
							</div>
						</div>
					</transition-group>
				</draggable>
			</div>
			
		</div>
	</div>

	<div class="card"  :class="[listActive ? '' : 'not-active-right', showNewTodoPrompt ? 'not-active-left' : '']">
		
		<div class="card-head">
			<i class="back-button fas fa-chevron-circle-left fa-2x" @click="this.listActive=false"></i>
			<h2>{{this.currentList}}</h2>
			<i class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewTodoPrompt=true"></i>
		</div>
		<div class="card-body">
			<div :class="isLoading ? '' : 'not-active'">
				<div class="spinner">
					<div></div><div></div><div></div><div></div>
				</div>
			</div>
			<div :class="isLoading ? 'not-active' : 'is-active'">
				<draggable 
				v-model="todos" 
				@start="drag=true" 
				@end="drag=false;saveOrderTodo()" 
				ghost-class="ghost"
				item-key="id">
					<transition-group>
						<div class="list-item cursor-pointer flex-between" v-for="todo in todos" :key="todo.id" @click="markDone(todo.id)" :class="todo.done==0 ? '' : 'done'">
							<p>{{todo.name}}</p>
							<div>
								<i class="fas fa-trash-alt trash" v-if="todo.done==1" @click.prevent="trashclicked=true;trash(todo.id, todo.name, 'todo')"></i>
								<i class="far fa-check-circle primary" v-if="todo.done==1"></i>
								<i class="far fa-circle primary" v-else></i>
							</div>
						</div>
					</transition-group>
				</draggable>
				<!-- <div class="list-item" v-for="todo in todos" :key="todo.id">{{todo.name}}</div> -->
			</div>
			
		</div>
	</div>

	<div class="card"  :class="showNewListPrompt ? '' : 'not-active-right'">
		
		<div class="card-head">
			<h2>Create New List</h2>
			<i class="cancel-btn fas fa-times-circle fa-2x" @click="this.showNewListPrompt=false"></i>
		</div>
		<div class="card-body">
			<div>
				<form @submit.prevent="newList()">
					<div class="input-group">
						<input type="text" name="list-name" v-model="newListName" placeholder="List Name" autocomplete="off" :disabled="!showNewListPrompt" :style="showNewListPrompt ? '':'cursor:unset'"/>
					</div>
					<div class="input-group">
						<input type="text" v-model="newListDescription" name="description" placeholder="List Description(optional)" autocomplete="off" :disabled="!showNewListPrompt" :style="showNewListPrompt ? '':'cursor:unset'" />
					</div>
					<div class="input-group">
						<input type="submit" name="submit" :disabled="!showNewListPrompt" :style="showNewListPrompt ? '':'cursor:unset'"/>
					</div>
				</form>
			</div>
			
		</div>
	</div>

	<div class="card"  :class="showNewTodoPrompt ? '' : 'not-active-right'">
		
		<div class="card-head">
			<i class="back-button fas fa-chevron-circle-left fa-2x" @click="this.showNewTodoPrompt=false"></i>
			<h2>New Todo</h2>
			<i class="cancel-btn fas fa-times-circle fa-2x" @click="this.showNewTodoPrompt=false"></i>
		</div>
		<div class="card-body">
			<div>
				<form @submit.prevent="newTodo()">
					<div class="input-group">
						<input type="text" name="todo-name" v-model="newTodoName" placeholder="List Name" autocomplete="off" :disabled="!showNewTodoPrompt" :style="showNewTodoPrompt ? '':'cursor:unset'"/>
					</div>
					<div class="input-group">
						<!-- <input type="text" v-model="newListDescription" name="description" placeholder="List Description(optional)" autocomplete="off" :disabled="!showNewTodoPrompt" :style="showNewTodoPrompt ? '':'cursor:unset'" /> -->
						<select v-model="newTodoType" :disabled="!showNewTodoPrompt" :style="showNewTodoPrompt ? '':'cursor:unset'">
							<option value="1">No Repeat</option>
							<option value="2">Daily</option>
							<option value="3">weekly</option>
						</select>
					</div>
					<div class="input-group">
						<input type="submit" name="submit" :disabled="!showNewTodoPrompt" :style="showNewTodoPrompt ? '':'cursor:unset'"/>
					</div>
					<label class="switch">
						<input type="checkbox" v-model="stayOnPage">
						<span class="slider"></span>
					</label>
					<span style="font-size:1.2em;cursor:pointer" @click="stayOnPage=!stayOnPage">Stay on page?</span>
				</form>
			</div>
			
		</div>
	</div>

	
</div>

<div class="popup-container" :class="showDeletePrompt ? '' : 'hidden'">
	<div class="popup card active">
		<div class="card-head">
			<h1>Warning! Please Confirm</h1>
		</div>
		<div class="card-body">
			<p>Are you sure you wish to delete "{{currentlyDeleting}}"</p>
			<div class="flex-fill">
				<div class="btn cancel" @click.prevent="this.showDeletePrompt=false"><i class="fas fa-times-circle"></i> Cancel</div>
				<div class="btn confirm" @click.prevent="deleteItem()"><i class="fas fa-trash-alt"></i> Delete</div>
			</div>
			
		</div>
	</div>
</div>
</template>

<script>
import axios from 'axios';
import { VueDraggableNext } from 'vue-draggable-next'
export default {	
	name: 'Lists',
	data(){
		return {
			listName: '',
			showNewListPrompt: false,
			showNewTodoPrompt: false,
			showDeletePrompt: false,
			currentList: "",
			currentListId: -1,
			listActive: false,
			isLoading: true, 
			lists:  [],
			todos: [],
			newListDescription: '',
			newListName: '',
			newTodoType:1,
			newTodoName: '',
			trashclicked: false,
			currentlyDeleting: '',
			currentlyDeletingId: -1,
			currentlyDeletingType: null,
			stayOnPage: null,
		}
	},
	components: {
        draggable: VueDraggableNext,
    },
	methods: {
		test(){
			console.log("test");

		},
		trash(id, name, type){
			var v = this;
			v.showDeletePrompt = true;
			v.currentlyDeleting = name;
			v.currentlyDeletingId = id;
			v.currentlyDeletingType = type;
			setTimeout(function(){
				v.trashclicked = false;
			}, 50); // dumb ass hack to keep the trash button from triggering the mark done

		},
		async deleteItem(){
			var v = this;
			console.log("currently deleting "+v.currentlyDeletingType+" with id "+v.currentlyDeletingId+" and name "+v.currentlyDeleting);

			var fd = new FormData();
			var url = "";
			if (v.currentlyDeletingType == "todo"){
				url = "todo";
				fd.append('todo_id', v.currentlyDeletingId);	
			}else{
				url = "list";
				fd.append('list_id', v.currentlyDeletingId);	
			}
			
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)

			await axios.post("server.php?action=delete"+url,fd).then(function(response){
				// console.log(response.data)
				if(response.data.error){
					return response.data.error					
				}else{
					console.log(response.data);
				}
				
			})
			v.currentlyDeleting = "";
			v.currentlyDeletingId = "";
			v.currentlyDeletingType = "";
			v.showDeletePrompt=false;
			v.getLists();


		},
		showList(id,name){
			if(this.trashclicked == true){
				return;
			}
			this.listActive = true;
			this.currentList = name;
			this.currentListId = id;
			console.log(id);
			this.getTodos();
		},
		showLoader(){
			if(this.trashclicked == true){
				return;
			}
			this.isLoading = true;
			var v = this;
			setTimeout(function(){
				v.isLoading = false;
				console.log(v.isLoading)
			}, 1000); 
		},
		async getLists(){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
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
			await v.$store.dispatch('newList', {
				listName: v.newListName,
				listDescription: v.newListDescription,
			}).then(function(){
				v.newListName = "";
				v.newListDescription = "";
				v.showNewListPrompt = false;
				v.isLoading = true;
				v.getLists();
			});
		},
		async newTodo(){
			var v = this;
			await v.$store.dispatch('newTodo',{
				list_id: v.currentListId,
				type: v.newTodoType,
				name: v.newTodoName
			}).then(function(){
				v.newTodoType = 1;
				v.newTodoName = "";
				if(!v.stayOnPage){ v.showNewTodoPrompt = false; }
				v.isLoading = true;
				v.getTodos();
			})
		},
		async getTodos(){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('list_id', v.currentListId);
			fd.append('token', localStorage.token);

			await axios.post("server.php?action=gettodos",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					v.isLoading = false;
					return response.data.error		
				}else{
					v.todos = response.data.todos;
					console.log(response.data);
					v.isLoading = false;
				}
				
			})
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
		async saveOrderTodo(){
            this.todos.forEach(async function(element,index) {
                var sortOrder = index+1;
                console.log(element.id + " - " + element.name + " - " + sortOrder);
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
		async markDone(todo_id){
			if(this.trashclicked == true){
				return;
			}
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
					v.getTodos();
					// v.todoLists = []
					// v.todoLists = response.data.lists
					
				}
			})
		}
	},
	created() {
		var v = this;
		v.getLists();
	},
    computed: {
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
