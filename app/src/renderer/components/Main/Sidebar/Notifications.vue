<template>
  <div class="notifications">
    <div v-if="displayType === 'tab'">
      <div v-for="(notification, index) in notifications" v-if="notifications.length > 0" class="alert" :class="['alert-' + notification.type, { 'mb-0': index === Object.keys(notifications).length - 1 }]" role="alert">
        <button @click="removeNotification(notification.id)" type="button" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <span v-html="notification.message"></span>
      </div>

      <p v-if="notifications.length === 0" class="card-text">No notifications to display.</p>
    </div>

    <div v-if="displayType === 'standalone'">
      <transition-group name="fade" tag="div">
        <div v-for="(notification, index) in lastNotifications" v-if="lastNotifications.length > 0" :key="notification.id" class="alert" :class="['alert-' + notification.type]" role="alert">
          <button @click="removeNotification(notification.id)" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <span v-html="notification.message"></span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { bus } from '../../../shared/bus'

  export default {
    name: 'notifications',
    props: ['displayType'],
    data () {
      return {
        lastNotifications: []
      }
    },
    mounted () {
      bus.$on('notification:push', notification => this.handlePush(notification))
    },
    computed: mapState({
      notifications: state => state.notifications.items
    }),
    methods: {
      removeNotification (id) {
        this.$store.commit('REMOVE_NOTIFICATION', id)
      },
      handlePush (notification) {
        this.lastNotifications.unshift(notification)
        setTimeout(() => {
          this.lastNotifications.shift()
        }, 2500)
      }
    }
  }
</script>

<style scoped>
  .notifications {
    text-align: left;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
