<template>
	<transition name="fade">
		<div class="notification" :class="notification.type" v-if="show">
			{{notification.message}}
			<div class="status-bar"></div>
			<div class="close" @click="close"><i class="fas fa-times-circle"></i></div>
		</div>
	</transition>
</template>

<script>
import {mapActions} from 'vuex'
export default {
	props: ['notification'],
	// methods: mapActions(['removeNotification']),
	data(){
		return {
			timeout: null,
			show:true,
		}
	},
	created() {
		this.timeout = setTimeout(() =>{
			this.show = false;
			this.timeout = setTimeout(()=>{
				this.removeNotification(this.notification);	
			},250)
			// this.removeNotification(this.notification);
		},3000)
	},
	beforeUnmount() {
		clearTimeout(this.timeout)
	},
	methods: {
		...mapActions(['removeNotification']),
		close(){
			this.show = false;
			this.timeout = setTimeout(()=>{
				this.removeNotification(this.notification);	
			},250)
		}
	}
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>