<template>
	<div class="container">
		<div class="card">
			<div class="card-head" >
				<h1>Home</h1>
			</div>
			<div class="card-body">	
				<h2>Welcome</h2>
				<p>
					This is a ToDo App I created for myself. But please feel free to use it if you would like. You can find more information <router-link to="/about">here</router-link>
				</p>
				<br/>
				<p>
					Please Note: I am actively developing this app, so please know there will be changes / updates / downtime as I go. Please do not rely on this as your sole source of anything for important tasks at this time. This is an ever changing app and is still in Beta
				</p>
				<br/>
				<p>
					Please click the icon in the bottom right to go to your lists, or the bottom left to go to your friends page. There is also the menu in the top left. 
				</p>
				<!-- <div class="list-item cursor-pointer" @click="goTo('/lists')">	
					Click here to go to the lists<br>
				</div>
				<div class="list-item cursor-pointer" @click="goTo('/about')">	
					Click here for more info
				</div> -->
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
