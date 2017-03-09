<template>
  <form class="form-inline justify-content-center">
    <div class="input-group">
      <input :value="remotePeerId" @input="updateRemotePeerId" class="form-control" type="text" placeholder="Enter a friend's ID">
      <span class="input-group-btn">
          <button v-if="!status.isConnecting" @click="connect()" class="btn btn-primary" type="button" :disabled="remotePeerId === ''">Connect</button>
          <button v-if="status.isConnecting" class="btn btn-primary" type="button" disabled>Connecting...</button>
        </span>
    </div>
  </form>
</template>

<script>
  import { mapState } from 'vuex'
  import { pubnub } from '../../../../shared/pubnub'

  /**
   * Not used as long as store.connection.useSignaling can't be set to `true`.
   */
  export default {
    name: 'signaling-connection',
    computed: mapState({
      localPeerId: state => state.connection.localPeerId,
      remotePeerId: state => state.connection.remotePeerId,
      status: state => state.connection.status
    }),
    created () {
      pubnub.subscribe({channels: [this.localPeerId]})

      pubnub.addListener({
        status: (statusEvent) => {
          console.log('PubNub: statusEvent', statusEvent)
          this.$store.commit('UPDATE_IS_CONNECTING', false)
        },
        message: (message) => {
          console.log('PubNub: message', message)
        },
        presence: (presenceEvent) => {
          console.log('PubNub: presenceEvent', presenceEvent)
        }
      })
    },
    methods: {
      updateRemotePeerId (e) {
        this.$store.commit('UPDATE_REMOTE_PEER_ID', e.target.value)
      },
      connect () {
        localStorage.setItem('remotePeerId', this.remotePeerId)
        this.$store.commit('UPDATE_IS_CONNECTING', true)

        console.log('RemoteConnection: connect: remotePeerId', this.remotePeerId)

        pubnub.subscribe({
          channels: [this.remotePeerId],
          withPresence: true
        })
      }
    }
  }
</script>
