<template>
		<div class="container">
		<div class="card">
			<div class="card-head" >
				<h1>About</h1>
			</div>
			<div class="card-body">		
				<div class="">	
					<p>This is a list app I put together for myself, but you are free to use it if you'd like but please note that it is a beta project, and could change or break at any point.</p>
					<br/>
					<h3>Basic Features</h3>
					<ul style="margin-left:2em">
						<li>Account Creation/Registration (done)</li>
						<li>Password Reset / Forgot Password (done)</li>
						<li>New Lists</li>
						<li>New Todos</li>
							<ul style="margin-left:2em">
								<li>Non-repeating</li>
								<li>Daily(Should Work)</li>
								<li>Weekly(Should Work)</li>
								<li>Monthly(WIP)</li>
								<li>More possibly in the future</li>
							</ul>
						<li>Delete All Completed ToDos (done)</li>
						<li>"Stay on page" setting for new todo (multi entry)</li>
						<li>Auto Refresh(5sec) - as close as possible to "live" updates as I care to add</li>
						<li>Delete List/Todo (done)</li>
						<li>Friend System (WIP)</li>
							<ul style="margin-left:2em">
								<li>Send request/accept request (done)</li>
								<li>Delete Friend / Remove Friend request (done)</li>
								<li>Send friend an invite to view & edit your list (done)</li>
								<li>Permissions (WIP)</li>
							</ul>
						<li>Organize lists/todos by drag and dropping (done)</li>
							<ul style="margin-left:2em">
								<li>FYI On mobile you have to hold for at least .2sec before dragging</li>
							</ul>

					</ul>

					<!-- <button @click="show = !show">Test</button>

					<transition name="fade">
						<div v-if="show">Show Me</div>
					</transition>
-->
					<button @click="test"> test notification</button> 
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: true
		}
	},
	methods: {
		test() {
			this.$store.dispatch(
				"addNotification", {
					type: "success",
					message: "this is a test"
				}
			)
		}
	}
}
</script>
