<template>
  <div class="notifications">
    <div v-for="(notification, index) in notifications" v-if="notifications.length > 0" class="alert" :class="['alert-' + notification.type, { 'mb-0': index === Object.keys(notifications).length - 1 }]" role="alert">
      <button @click="removeNotification(notification.id)" type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <span v-html="notification.message"></span>
    </div>

    <p v-if="notifications.length === 0" class="card-text">No notifications to display.</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'notifications',
    computed: mapState({
      notifications: state => state.notifications.items
    }),
    methods: {
      removeNotification (id) {
        this.$store.commit('REMOVE_NOTIFICATION', id)
      }
    }
  }
</script>

<style scoped>
  .notifications {
    text-align: left;
  }
</style>
