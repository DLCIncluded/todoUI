<template>

<div class="container">
	<!-- <div class="card-container" :class="[listActive ? 'not-active-left' : '',showNewListPrompt ? 'not-active-left' : '',showEditListPrompt ? 'not-active-left' : '']"> -->
	<transition :name="listsTransition">
		<div class="card-container" v-if="currentPage=='lists'">
			<div class="card">
				<div class="card-head" >
					<h1>Your Lists</h1>
					<!-- <i class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewListPrompt=true;currentPage='newList'"></i> -->
				</div>
				<div class="card-body">
					<transition name="fade">
						<!-- <div :class="isLoading ? '' : 'not-active'"> -->
						<div v-if="isLoading">
							<div class="spinner">
								<div></div><div></div><div></div><div></div>
							</div>
						</div>
					</transition>
					<transition name="fade">
						<!-- <div :class="isLoading ? 'not-active' : ''">	 -->
						<div v-if="!isLoading && lists!=null">
							<draggable 
							v-model="lists" 
							delay-on-touch-only="true"
							delay="100"
							@start="drag=true" 
							@end="drag=false;saveOrderList()" 
							ghost-class="ghost"
							item-key="id">
								<transition-group>
									<div class="list-item cursor-pointer flex-between" v-for="list in lists" :key="list.id" @click="setPage('todoList');showList(list.id, list.name, list.owner, list.description);showLoader()">
										<p>{{list.name}}</p>
										<div>
											<i class="fas fa-trash-alt trash" @click.stop="trashclicked=true;trash(list.id, list.name, 'list');showDeletePrompt=true"></i>
											<i class="back-button fas fa-chevron-circle-right"></i>
										</div>
									</div>
								</transition-group>
							</draggable>
						</div>
						
					</transition>
					<transition name="fade">
						<div v-if="!isLoading && lists==null">
							<p>No Lists, Please create one Using the button below.</p>
						</div>
					</transition>
					
				</div>
			</div>
		</div>
	</transition>
	
	<!-- <div class="card-container" :class="[listActive ? '' : 'not-active-right', showNewTodoPrompt ? 'not-active-left' : '']"> -->
	<transition :name="todosTransition">
		<div class="card-container" v-if="currentPage=='todoList'">
			<div class="card">
				
				<div class="card-head">
					<!-- <i class="back-button fas fa-chevron-circle-left fa-2x" @click="this.listActive=false;currentPage='lists'"></i> -->
					<!-- <div class="flex-between"> -->
						<h2>{{currentList}}</h2>
						<p>{{currentListDescription}}</p>
					<!-- </div> -->
					<div>
						<!-- <i class="edit-button far fa-edit fa-2x" @click="editCurrentList(currentListId);currentPage='editList'"></i> -->
						<!-- <i class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewTodoPrompt=true;currentPage='newTodo'"></i> -->
					</div>
					
				</div>
				<div class="card-body">
					<transition name="fade">
						<!-- <div :class="isLoading ? '' : 'not-active'"> -->
						<div v-if="isLoading">
							<div class="spinner">
								<div></div><div></div><div></div><div></div>
							</div>
						</div>
					</transition>

					
					<div class="list-item cursor-pointer flex-between" v-if="isLoading==false && todos==null" @click="setPage('newTodo')">
						<p >No items found, please create one!</p>
					</div>

					<transition name="fade">
						<!-- <div :class="isLoading ? 'not-active' : ''">	 -->
						<div v-if="!isLoading">	
							<draggable 
							v-model="todos" 
							delay-on-touch-only="true"
							delay="100"
							@start="drag=true" 
							@end="drag=false;saveOrderTodo()" 
							ghost-class="ghost"
							item-key="id">
								<transition-group>
									<div class="list-item cursor-pointer flex-between" v-for="todo in todos" :key="todo.id" @click="markDone(todo.id);todo.done=1" :class="todo.done==0 ? '' : 'done'">
											<!-- set todo.done=1 on click to avoid the delay on sending the update to the server and waiting on the list to re-render -->
										<p>{{todo.name}}</p>
										<div>
											<i class="fas fa-trash-alt trash" @click.stop="trash(todo.id, todo.name, 'todo');showDeletePrompt=true"></i>
											<i class="far fa-check-circle primary" v-if="todo.done==1"></i>
											<i class="far fa-circle primary" v-else></i>
										</div>
									</div>
								</transition-group>
							</draggable>
							<div v-if="showDeleteAll" class="list-item cursor-pointer" style="text-align:center; margin-top:1em" @click.prevent="showDeleteAllPrompt=true">Delete all completed</div>
							<!-- <div class="list-item" v-for="todo in todos" :key="todo.id">{{todo.name}}</div> -->
						</div>
					</transition>
				</div>
			</div>
		</div>
	</transition>

	<!-- <div class="card"  :class="showNewListPrompt ? '' : 'not-active-right'"> -->
	<transition name="not-active-right">
		<div class="card-container" v-if="showNewListPrompt">
			<div class="card">
				<div class="card-head">
					<h2>Create New List</h2>
					<!-- <i class="cancel-btn fas fa-times-circle fa-2x" @click="showNewListPrompt=false;currentPage='lists'"></i> -->
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
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</transition>

	<!-- <div class="card"  :class="showNewTodoPrompt ? '' : 'not-active-right'"> -->
	<transition name="not-active-right">
		<div class="card-container" v-if="currentPage=='newTodo'">
			<div class="card">
				
				<div class="card-head">
					<!-- <i class="back-button fas fa-chevron-circle-left fa-2x" @click="showNewTodoPrompt=false;currentPage='todoList'"></i> -->
					<h2>New Todo</h2>
					<!-- <i class="cancel-btn fas fa-times-circle fa-2x" @click="showNewTodoPrompt=false;currentPage='todoList'"></i> -->
				</div>
				<div class="card-body">
					<div>
						<form @submit.prevent="newTodo();">
							<div class="input-group">
								<input type="text" name="todo-name" v-model="newTodoName" placeholder="Todo Name" autocomplete="off"/>
							</div>
							<div class="input-group">
								<!-- <input type="text" v-model="newListDescription" name="description" placeholder="List Description(optional)" autocomplete="off" :disabled="!showNewTodoPrompt" :style="showNewTodoPrompt ? '':'cursor:unset'" /> -->
								<select v-model="newTodoType">
									<option value="1">No Repeat</option>
									<option value="2">Daily</option>
									<option value="3">weekly</option>
								</select>
							</div>
							<div class="input-group">
								<button type="submit" name="submit">Save</button>
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
	</transition>

	<!-- <div class="card-container" :class="showEditListPrompt ? '' : 'not-active-right'"> -->
	<transition name="not-active-right">
		<div class="card-container" v-if="currentPage=='editList'">
			<div class="card">
				<div class="card-head">
					<!-- <i class="back-button fas fa-chevron-circle-left fa-2x" @click="showEditListPrompt=false;listActive=true;currentPage='todoList'"></i> -->
					<h2>Edit List</h2>
					<!-- <i class="cancel-btn fas fa-times-circle fa-2x" @click="showEditListPrompt=false;listActive=true;currentPage='todoList'"></i> -->
				</div>
				<div class="card-body">
					<div>
						<form @submit.prevent="editList();setPage('todoList')">
							<div class="input-group">
								List Name: <input type="text" name="list-name" v-model="currentList" placeholder="List Name" autocomplete="off" />
							</div>
							<div class="input-group">
								Description: <input type="text" v-model="currentListDescription" name="description" placeholder="List Description" autocomplete="off" />
							</div>
							<div class="input-group">
								<button type="submit" name="submit">Save</button>
							</div>
						</form>
					</div>			
				</div>
			</div>
		</div>
	</transition>
	<transition name="not-active-right">
		<div class="card-container" v-if="currentPage=='shareList'">
			<div class="card">
				<div class="card-head">
					<!-- <i class="back-button fas fa-chevron-circle-left fa-2x" @click="showEditListPrompt=false;listActive=true;currentPage='todoList'"></i> -->
					<h2>Share List</h2>
					<!-- <i class="cancel-btn fas fa-times-circle fa-2x" @click="showEditListPrompt=false;listActive=true;currentPage='todoList'"></i> -->
				</div>
				<div class="card-body" >
					<div v-if="listOwner">
						Share with a friend:
							<transition name="fade">
								<!-- <div :class="isLoading ? '' : 'not-active'"> -->
								<div v-if="isLoading">
									<div class="spinner">
										<div></div><div></div><div></div><div></div>
									</div>
								</div>
							</transition>
							<ul class="friends">
								
								<li v-if="!friends || friends.length == 0">
									No friends to share with.
								</li>
								<li v-else v-for="friend in friends" :key="friend.id" class="friend-item" @click="shareList(friend.user_id)">
									<i class="fas fa-external-link-alt"></i> {{friend.username}}
								</li>
							</ul>
					</div>		
					<div v-else>
						You don't Own this list, but you can remove it from your account:

						<ul class="friends">
							
							<li @click="removeList()" class="cursor-pointer">
								<i class="far fa-trash-alt"></i> Remove List
							</li>
						</ul>
					</div>	
				</div>
				<div class="card-body" v-if="listOwner">
					Users with Access:
					
					<ul class="friends">
						<li v-if="!currentAccess">
							No one has access but you.
						</li>
						<li v-else v-for="user in currentAccess" :key="user.id" class="friend-item">
							{{user.username}} - <span @click="removeList(user.id)">Remove</span>
						</li>
					</ul>
				</div>
				<div class="card-body" v-else>
					Users with Access:
					<ul class="friends">
						<li v-if="!currentAccess">
							No one has access but you.
						</li>
						<li v-else v-for="user in currentAccess" :key="user.id" class="friend-item" style="cursor:default!important">
							{{user.username}}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</transition>
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

				<div v-if="currentlyDeletingType == 'list'" class="btn cancel" @click.prevent="showDeletePrompt=false;setPage('lists')"><i class="fas fa-times-circle"></i> Cancel</div>
				<div v-else class="btn cancel" @click.prevent="this.showDeletePrompt=false;setPage('todoList')"><i class="fas fa-times-circle"></i> Cancel</div>
				<!-- STUPID navigation hack -->
				<div v-if="currentlyDeletingType == 'list'" class="btn confirm" @click.prevent="deleteItem();setPage('lists')"><i class="fas fa-trash-alt"></i> Delete</div>
				<div v-else class="btn confirm" @click.prevent="deleteItem();setPage('todoList')"><i class="fas fa-trash-alt"></i> Delete</div>
			</div>
			
		</div>
	</div>
</div>
</transition>
<transition name="fade">
<div class="popup-container" v-if="showDeleteAllPrompt">
	<div class="popup-backdrop"></div>
	<div class="popup card active">
		<div class="card-head">
			<h3>Warning! Please Confirm</h3>
		</div>
		<div class="card-body">
			<p>Are you sure you wish to delete all completed items from "{{currentList}}"</p>
			<div class="flex-fill">
				<div class="btn cancel" @click.prevent="showDeleteAllPrompt=false;setPage('todoList')"><i class="fas fa-times-circle"></i> Cancel</div>
				<div class="btn confirm" @click.prevent="deleteCompleted(currentListId);setPage('todoList')"><i class="fas fa-trash-alt"></i> Delete</div>
			</div>
		</div>
	</div>
</div>
</transition>


<!-- <div class="bottom-nav">
	{{this.currentPage}}
	<div @click.prevent="back()"><i class="fas fa-backward"></i> Back</div>
</div> -->


<div class="list-nav">
	<div>
		<i v-if="currentPage=='todoList'" class="back-button fas fa-chevron-circle-left fa-2x" @click="this.listActive=false;setPage('lists')"></i>
		<i v-if="currentPage=='shareList'" class="back-button fas fa-chevron-circle-left fa-2x" @click="this.listActive=false;setPage('todoList')"></i>
	</div>
	<div v-if="currentPage=='todoList'">
		<i  class="far fa-share-square fa-2x" @click="setPage('shareList');getFriends();getCurrentAccess();"></i>
	</div>
	<div>
		<!-- <i v-if="currentPage=='newTodo'" class="back-button fas fa-chevron-circle-left fa-2x" @click="showNewTodoPrompt=false;currentPage='todoList'"></i> -->
		<i v-if="currentPage=='newTodo'" class="cancel-btn fas fa-times-circle fa-2x" @click="showNewTodoPrompt=false;setPage('todoList')"></i>
		<i v-if="currentPage=='lists'" class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewListPrompt=true;setPage('newList')"></i>
		<i v-if="currentPage=='newList'" class="cancel-btn fas fa-times-circle fa-2x" @click="showNewListPrompt=false;setPage('lists')"></i>
		<i v-if="currentPage=='editList'" class="cancel-btn fas fa-times-circle fa-2x" @click="showEditListPrompt=false;listActive=true;setPage('todoList')"></i>
		<i v-if="currentPage=='todoList'" class="edit-button far fa-edit fa-2x" @click="editCurrentList(currentListId);setPage('editList')"></i>
		
	</div>
	<div>
		<i v-if="currentPage=='todoList'" class="create-new-btn fas fa-plus-circle fa-2x" @click="showNewTodoPrompt=true;setPage('newTodo');"></i>
	</div>
</div>

<!-- current: {{currentPage}} - previous: {{previousPage}} -->
</template>

<script>
import axios from 'axios';
import { VueDraggableNext } from 'vue-draggable-next'
import mitt from 'mitt'
const emitter = mitt()
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
			listActive: false,
			isLoading: true, 
			lists:  [],
			todos: null,
			newListDescription: '',
			newListName: '',
			newTodoType:1,
			newTodoName: '',
			currentlyDeleting: '',
			currentlyDeletingId: -1,
			currentlyDeletingType: null,
			stayOnPage: null,
			currentPage: 'lists',
			previousPage: 'lists',
			friends:null,
			currentAccess:null,
			timer: null,
		}
	},
	components: {
        draggable: VueDraggableNext,
    },
	methods: {
		back(){
			//weird nav issues
			// fixes the back button for navigation inside the list page
			if(this.currentPage == 'lists') {
				console.log("current page: lists");
			}
			if(this.currentPage == 'todoList'){
				this.listActive=false;
				this.setPage("lists");
			}
			if(this.currentPage == 'newList'){
				this.showNewListPrompt = false;
				this.setPage("lists");
			}
			if(this.currentPage == 'newTodo'){
				this.showNewTodoPrompt = false;
				this.setPage("todoList");
			}
			if(this.currentPage == 'editList'){
				this.setPage("todoList");
				this.showEditListPrompt=false;
				this.listActive=true;
			}
			if(this.currentPage == 'shareList'){
				this.setPage("todoList");
				this.listActive=true;
			}
			if(this.currentPage == 'deleteAll') {
				this.setPage("todoList");
				this.showDeleteAllPrompt=false;
			}
			if(this.currentPage == 'deleteList') {
				this.setPage("lists");
				this.showDeletePrompt=false;
			}
			if(this.currentPage == 'deleteTodo') {
				this.setPage("todoList");
				this.showDeletePrompt=false;
			}
		},
		setPage(page){
			this.previousPage=this.currentPage;
			this.currentPage=page;
		},
		trash(id, name, type){
			var v = this;
			v.showDeletePrompt = true;
			v.currentlyDeleting = name;
			v.currentlyDeletingId = id;
			v.currentlyDeletingType = type;
		},
		async deleteCompleted (id){
			var v = this;
			v.isLoading = true;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			fd.append('list_id', id)

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
				v.getTodos();
			})
		},
		editCurrentList(id){
			this.showEditListPrompt = true;
			this.listActive = false;
			// this.getFriends();
			// this.getCurrentAccess();
			console.log(id)
		},
		async editList(){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token)
			fd.append('list_id', this.currentListId)
			fd.append('list_description', this.currentListDescription)
			fd.append('list_name', this.currentList)

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
				}

				
			}).then(() =>{
				v.getLists();
			})
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
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})	
					// return response.data.error					
				}else{
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})	
					// console.log(response.data);
				}
				
			})
			v.currentlyDeleting = "";
			v.currentlyDeletingId = "";
			v.currentlyDeletingType = "";
			v.showDeletePrompt=false;
			if(url == "todo") {
				v.getTodos();
			}else {
				v.getLists();
			}
			


		},
		showList(id,name,owner,desc){
			// if(this.trashclicked == true){
			// 	return;
			// }
			this.listActive = true;
			this.currentList = name;
			this.currentListId = id;
			this.currentListOwner = owner;
			this.currentListDescription = desc;
			// console.log(id);
			this.getTodos();
		},
		showLoader(){
			// if(this.trashclicked == true){
			// 	return;
			// }
			this.isLoading = true;
			var v = this;
			setTimeout(function(){
				v.isLoading = false;
				// console.log(v.isLoading)
			}, 1000); 
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
		async newTodo(){
			var v = this;
			await v.$store.dispatch('newTodo',{
				list_id: v.currentListId,
				type: v.newTodoType,
				name: v.newTodoName
			}).then(function(){
				v.newTodoType = 1;
				v.newTodoName = "";
				if(!v.stayOnPage){ v.showNewTodoPrompt = false; v.setPage('todoList')}
				v.isLoading = true;
				v.getTodos();
			})
		},
		async getTodos(loading=true){
			var v = this;
			// v.todos = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('list_id', v.currentListId);
			fd.append('token', localStorage.token);
			this.isLoading = loading;

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
				
			}).then(()=>{
				// console.log(v.showDeleteAll)
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
					v.getTodos(false);//get todos with out showing loader
				}
			})
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
		async getFriends(){
			var v = this;
			v.friends = [];
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('list_id', v.currentListId);
			this.isLoading = true;

			await axios.post("server.php?action=getfriendswithoutaccess",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					v.isLoading = false;
				}else{
					v.friends = response.data.friends;
					console.log(response.data);
					v.isLoading = false;
				}
				
			})
        },
		async shareList(friendId){
			var v = this;
			var fd = new FormData();
			fd.append('id', localStorage.id);
			fd.append('token', localStorage.token);
			fd.append('friend_id', friendId);
			fd.append('list_id', v.currentListId);
			this.isLoading = true;
			console.log('friend_id: '+friendId)
			console.log('list_id: '+v.currentListId)

			await axios.post("server.php?action=sharelist",fd).then(function(response){
				// console.log(response.data.lists)
				if(response.data.error){
					v.isLoading = false;
					v.$store.dispatch('addNotification',{
						type: "error",
						message: response.data.message
					})
				}else{
					console.log(response.data);
					v.$store.dispatch('addNotification',{
						type: "success",
						message: response.data.message
					})
					v.getFriends();
					v.getCurrentAccess();
					v.isLoading = false;
				}
				
			})
		},
		refreshData(){
            console.log("refresh data")
            this.timer = setInterval(() => {
				if(this.currentPage=='todoList'){
					this.getTodos(false);
				}else if(this.currentPage=='lists'){
					this.getLists(false);
				}
            }, 5000)
        },
	},
	created() {
		var v = this;
		v.getLists();
		const unregisterRouterGuard = this.$router.beforeEach((to,from,next) => {
			var nextVar = false;
			setTimeout(()=>{
				//have to delay a tiny bit so the value can be updated, then do our checks

				// console.log("force route: "+v.forceRoute)
				if(v.forceRoute){
					// console.log('force')
					next();
					return;
				}
				
				if(this.currentPage == 'lists') {
					nextVar = true;
				}
				this.back();

				if(this.forceRoute){
					nextVar = true;
					next(nextVar);
					return
				}
				next(nextVar);
			},10)
			
		})
		emitter.on('hook:destroyed',()=>{
			unregisterRouterGuard()
		})
	},
	mounted() {
		this.refreshData();
	},
	unmounted() {
		clearInterval(this.timer)
	},
    computed: {
		listsTransition(){
			if(this.currentPage == 'lists' && this.previousPage == 'todoList' ){
				return 'not-active-left';
			}
			return 'not-active-left';
		},
		todosTransition(){
			if(this.currentPage == 'todoList' && this.previousPage == 'lists' ){
				return 'not-active-right';
			}else if(this.currentPage == 'lists' && this.previousPage == 'todoList'){
				return 'not-active-right';
			}
			return 'not-active-left';
		},
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
		showDeleteAll(){
			if(this.todos == null){
				return false;
			}
			console.log(this.todos)
			// console.log("test"+this.todos.some(code=> code.done === '1'));
			return this.todos.some(code=> code.done === '1')

		},
		forceRoute(){
			return this.$store.getters.forceRouterGetter;
		}
    },
}
</script>
