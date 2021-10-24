<template>
	<div class="notification-panel">
		<notification-item v-for="notification in notifications" :key="notification.id" :notification="notification" >
		</notification-item>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import NotificationItem from './Notification.vue'
export default {
	components: {
		NotificationItem
	},
	computed: mapState(['notifications']),
	// methods: mapActions(['removeNotification'])

}
</script>
