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
      signalingOffer: state => state.connection.signalingOffer,
      signalingAnswer: state => state.connection.signalingAnswer,
      status: state => state.connection.status
    }),
    created () {
      pubnub.subscribe({channels: [this.localPeerId]})

      pubnub.addListener({
        status: (statusEvent) => {
          console.log('PubNub: statusEvent', statusEvent)
        },
        message: (message) => {
          console.log('PubNub: message', message)

          // Handle the received signaling
          let signalingData = JSON.parse(message.message)
          if (signalingData.type === 'offer') {
            window.hostPeer.signal(signalingData)
          } else {
            window.clientPeer.signal(signalingData)
          }
        }
      })
    },
    methods: {
      updateRemotePeerId (e) {
        this.$store.commit('UPDATE_REMOTE_PEER_ID', e.target.value)
      },
      connect () {
        localStorage.setItem('remotePeerId', this.remotePeerId)

        console.log('RemoteConnection: connect: remotePeerId', this.remotePeerId)

        pubnub.subscribe({channels: [this.remotePeerId]})

        // Send the signaling offer if it's available
        if (this.signalingOffer !== '') {
          let publishConfig = {
            channel: this.remotePeerId,
            message: this.signalingOffer
          }

          pubnub.publish(publishConfig, function (status, response) {
            console.log('PubNub: publish', status, response)
          })
        }
      }
    },
    watch: {
      signalingOffer: function () {
        if (this.remotePeerId !== '' && !(this.status.isConnecting || this.status.isConnected)) {
          let publishConfig = {
            channel: this.remotePeerId,
            message: this.signalingOffer
          }

          pubnub.publish(publishConfig, function (status, response) {
            console.log('PubNub: publish', status, response)
          })
        }
      },
      signalingAnswer: function () {
        if (this.localPeerId !== '' && !(this.status.isConnecting || this.status.isConnected)) {
          let publishConfig = {
            channel: this.localPeerId,
            message: this.signalingAnswer
          }

          pubnub.publish(publishConfig, function (status, response) {
            console.log('PubNub: publish', status, response)
          })
        }
      }
    }
  }
</script>
