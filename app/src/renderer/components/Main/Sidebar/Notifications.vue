<template>
  <div class="notifications">
    <div v-if="displayType === 'tab'">
      <button v-if="notifications.length > 0" @click="clearNotifications" type="button" class="btn btn-danger btn-block mb-3">Clear all notifications</button>

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
          <button @click="removeLastNotification(notification.id)" type="button" class="close" aria-label="Close">
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
      clearNotifications () {
        this.$store.commit('CLEAR_NOTIFICATIONS')
      },
      handlePush (notification) {
        this.lastNotifications.unshift(notification)
        setTimeout(() => {
          if (this.lastNotifications.length > 0) {
            this.lastNotifications.shift()
          }
        }, 2500)
      },
      removeLastNotification (id) {
        this.lastNotifications = this.lastNotifications.filter(notification => {
          return notification.id !== id
        })
      }
    }
  }
</script>

<style scoped>
  .notifications {
    text-align: left;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
