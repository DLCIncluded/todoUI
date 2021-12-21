<template>
<div class="container">
	<div class="card-container">
			<div class="card">
				
				<div class="card-head">
					<!-- <i class="back-button fas fa-chevron-circle-left fa-2x" @click="showNewTodoPrompt=false;currentPage='todoList'"></i> -->
					<h1>New List Item</h1>
					<!-- <i class="cancel-btn fas fa-times-circle fa-2x" @click="showNewTodoPrompt=false;currentPage='todoList'"></i> -->
				</div>
				<div class="card-body">
					<div>
						<form @submit.prevent="newItem();">
							<div class="input-group">
								<label for="list-item-name">Item Name:</label>
								<input type="text" name="list-item-name" v-model="itemName" placeholder="Item Name" autocomplete="off"/>
							</div>
							<div class="input-group">
								<select v-model="itemType">
									<option value="1">No Repeat</option>
									<option value="2">Daily</option>
									<option value="3">weekly</option>
								</select>
							</div>
							<div class="input-group">
								<button type="submit" name="submit">Save</button>
								<Button text="Cancel" type="cancel-full" @click.prevent="goToList()"/>
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
</div>

</template>

<script>
import Button from '@/components/Button.vue'
export default {
	name: "NewItem",
	data() {
		return {
			listId: this.$route.params.id,
			itemName: "",
			itemType: 1,
			stayOnPage: false,
		}
	},
	components: {
		Button,
	},
	methods: {
		async newItem(){
			var v = this;
			if(v.itemName.trim() == ''){
				v.$store.dispatch('addNotification',{
					type: "error",
					message: "Sorry you cannot submit a blank list item."
				})
				return;
			}
			await v.$store.dispatch('newTodo',{
				list_id: v.listId,
				type: v.itemType,
				name: v.itemName
			}).then(function(){
				v.itemType = 1;
				v.itemName = "";
				if(v.stayOnPage){
					return;
				}
				v.$router.push({ path: `/list/${v.listId}` })
			})
		},
		goToList(){
			this.$router.push({ path: `/list/${this.listId}` })
		},
	}
}
</script>

<style>

</style>