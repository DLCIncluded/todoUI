<template>
	<button @click="onClick" class="btn" :class="type">
		<i :class="icon" @click="showNewListPrompt=true;currentPage='newList'"></i>
		{{text}}
	</button>
</template>

<script>
export default {
	name: "Button",
	props: {
		text: String,
		icon: String,
		type: String,
	},
}
</script>

<style>

</style>