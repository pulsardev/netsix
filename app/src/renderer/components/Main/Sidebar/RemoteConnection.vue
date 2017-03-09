<template>
  <div>
    <h4 class="card-title">Connect to a friend</h4>
    <p class="card-text">And watch your friend's collections.</p>

    <form class="form-inline justify-content-center">
      <div class="input-group">
        <input :value="remotePeerId" @input="updateRemotePeerId" class="form-control" type="text" placeholder="Enter a friend's ID">
        <span class="input-group-btn">
          <button v-if="!status.isConnecting" @click="connect()" class="btn btn-primary" type="button" :disabled="remotePeerId === ''">Connect</button>
          <button v-if="status.isConnecting" class="btn btn-primary" type="button" disabled>Connecting...</button>
        </span>
      </div>
    </form>

    <form class="form-inline justify-content-center mt-2">
      <div class="input-group">
        <span class="input-group-btn">
          <button @click="signal(true)" class="btn btn-primary" type="button">Generate</button>
        </span>
        <input v-model="wrtcSignal" class="form-control" type="text" placeholder="Enter a WebRTC signal">
        <span class="input-group-btn">
          <button @click="signal()" class="btn btn-primary" type="button" :disabled="wrtcSignal === ''">Signal</button>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { pubnub } from '../../../shared/pubnub'
  import SimplePeer from 'simple-peer'

  export default {
    name: 'remote-connection',
    data () {
      return {
        wrtcSignal: ''
      }
    },
    computed: mapState({
      localPeerId: state => state.connection.localPeerId,
      remotePeerId: state => state.connection.remotePeerId,
      status: state => state.connection.status
    }),
    created () {
      // pubnub.subscribe({channels: [this.localPeerId]})

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

      window.hostPeer = new SimplePeer({trickle: false, objectMode: true})

      window.hostPeer.on('signal', (data) => {
        // when hostPeer has signaling data, give it to clientPeer somehow
        this.wrtcSignal = JSON.stringify(data) // window.clientPeer.signal(data)
      })

      window.hostPeer.on('data', (data) => {
        // got a data channel message
        console.log('got a message from clientPeer: ' + data)
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
          channels: [this.remotePeerId]
        })
      },
      signal (isInitiator) {
        console.log('signal', this.wrtcSignal)

        if (isInitiator) {
          window.clientPeer = new SimplePeer({initiator: true, trickle: false, objectMode: true})

          window.clientPeer.on('signal', (data) => {
            console.log('clientPeer: signal', data)
            // when clientPeer has signaling data, give it to hostPeer somehow
            this.wrtcSignal = JSON.stringify(data) // window.hostPeer.signal(data)
          })

          window.clientPeer.on('connect', () => {
            // wait for 'connect' event before using the data channel
            window.clientPeer.send('hey hostPeer, how is it going?')
          })
        } else {
          let wrtcSignal = JSON.parse(this.wrtcSignal)

          if (wrtcSignal.type === 'offer') {
            window.hostPeer.signal(wrtcSignal)
          }

          if (wrtcSignal.type === 'answer') {
            window.clientPeer.signal(wrtcSignal)
          }
        }
      }
    }
  }
</script>
