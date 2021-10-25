<template>
	<transition name="fade">
		<div class="notification" :class="notification.type" v-if="show">
			{{notification.message}}
			<div class="status-bar"></div>
			<div class="close" @click="close"><i class="fas fa-times-circle fa-2x"></i></div>
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
		var v=this;
		v.timeout = setTimeout(() =>{
			v.show = false;
			v.timeout = setTimeout(()=>{
				v.removeNotification(v.notification);	
			},250)
		},3000)
	},
	beforeUnmount() {
		clearTimeout(this.timeout)
	},
	methods: {
		...mapActions(['removeNotification']),
		close(){
			console.log(this.notification)
			var v=this;
			v.show = false;
			v.timeout = setTimeout(()=>{
				v.removeNotification(v.notification);	
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