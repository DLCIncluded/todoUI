<template>
		<div class="container">
		<div class="card">
			<div class="card-head" >
				<h1>About</h1>
			</div>
			<div class="card-body">		
				<div class="">	
					<p>This is a list app I put together for myself, but you are free to use it if you'd like.</p>

					<h3>Basic Features</h3>
					<ul style="margin-left:2em">
						<li>New Lists</li>
						<li>New Todos</li>
							<ul style="margin-left:2em">
								<li>Non-repeating</li>
								<li>Weekly(WIP)</li>
								<li>Monthly(WIP)</li>
								<li>More possibly in the future</li>
							</ul>
						<li>"Stay on page" setting for new todo(multi entry)</li>
						<li>Auto Refresh(5sec) - as close as possible to "live" updates</li>
						<li>Delete List/Todo</li>
						<li>Friend System</li>
							<ul style="margin-left:2em">
								<li>These features are still WIP</li>
								<li>Send request/accept request</li>
								<li>Send friend an invite to edit/view your list</li>
							</ul>
						<li>Organize lists/todos by drag and dropping</li>
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
