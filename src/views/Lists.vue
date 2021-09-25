<template>
	<div class="card" :class="listActive ? 'not-active' : 'is-active'">
		<div class="card-head" >
			<h1>Your Lists</h1>
			<i class="create-new-btn fas fa-plus-circle fa-2x" @click="newList"></i>
		</div>
		<div class="card-body">
			
			<div class="list-item cursor-pointer flex-between" v-for="list in lists" :key="list.id" @click.prevent="showList(list.id, list.name)">
				<p>{{list.name}}</p>
				<i class="back-button fas fa-chevron-circle-right"></i>
			</div>
			
		</div>
	</div>

	<div class="card" :class="listActive ? 'is-active' : 'not-active'">
		
		
		<div class="card-head">
			<i class="back-button fas fa-chevron-circle-left fa-2x" @click="this.listActive=false"></i>
			<h2>{{this.currentList}}</h2>
			<i class="create-new-btn fas fa-plus-circle fa-2x" @click="test"></i>
		</div>
		<div class="card-body">
			
			<div class="list-item" v-for="todo in todos" :key="todo.id">{{todo.name}}</div>
			
		</div>
	</div>
</template>

<script>
export default {
	name: 'Lists',
	data(){
		return {
			currentList: "",
			listActive: false,
			lists:  [// get from API but using this to create the layout
				{
					"id": "10",
					"name": "Test List 2",
					"description": "desc",
					"owner": "admin"
				},
				{
					"id": "11",
					"name": "Test 1",
					"description": "desc",
					"owner": "admin"
				}
			],
			todos: [
				{
					"id": "11",
					"name": "list item 1",
					"description": "desc",
					"owner": "admin"
				},
				{
					"id": "12",
					"name": "list item 2",
					"description": "desc",
					"owner": "admin"
				}
			]
		}
	},
	methods: {
		test(){
			console.log("test");
		},
		showList(id,name){
			this.listActive = true;
			this.currentList = name;
			console.log(id);
		}
	}
}
</script>
