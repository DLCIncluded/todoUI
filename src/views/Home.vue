<template>
	<div class="container">
		<div class="card">
			<div class="card-head" >
				<h1>Home</h1>
			</div>
			<div class="card-body">		
				<div class="list-item cursor-pointer" @click="goTo('/lists')">	
					Click here to go to the lists<br>
				</div>
				<div class="list-item cursor-pointer" @click="goTo('/about')">	
					Click here for more info
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Home',
	methods: {
		goTo(route) {
			this.$router.push(route);
		}
	}
}
</script>
