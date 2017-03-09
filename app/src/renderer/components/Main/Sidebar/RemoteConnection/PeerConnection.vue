<template>
  <form class="form-inline justify-content-center">
    <div class="input-group">
      <input v-model="signalPayload" class="form-control" type="text" placeholder="Enter a WebRTC signal">
      <span class="input-group-btn">
        <button @click="signal()" class="btn btn-primary" type="button" :disabled="signalPayload === ''">Signal</button>
      </span>
    </div>

    <div v-if="remotePeerId" class="input-group mt-2">
      <input v-model="remotePeerId" class="form-control" type="text" disabled>
      <span class="input-group-btn">
        <button v-if="isElectron" @click="copySignal" class="btn btn-primary" type="button">Copy</button>
      </span>
    </div>
  </form>
</template>

<script>
  import { mapState } from 'vuex'
  import SimplePeer from 'simple-peer'
  import { clipboard } from 'electron'

  export default {
    name: 'peer-connection',
    data () {
      return {
        signalPayload: ''
      }
    },
    computed: mapState({
      localPeerId: state => state.connection.localPeerId,
      remotePeerId: state => state.connection.remotePeerId,
      status: state => state.connection.status,
      isElectron: state => state.configuration.isElectron,
      localCollections: state => state.collections.localCollections
    }),
    created () {
      this.$store.commit('UPDATE_IS_CONNECTING', true)
      window.clientPeer = new SimplePeer({initiator: true, trickle: false, objectMode: true})
      window.hostPeer = new SimplePeer({trickle: false, objectMode: true})

      // Client peer listeners
      window.clientPeer.on('signal', data => this.handleSignal(window.clientPeer, data))
      window.clientPeer.on('connect', () => this.handleConnect(window.clientPeer))
      window.clientPeer.on('data', (data) => this.handleData(window.clientPeer, data))

      // Host peer listeners
      window.hostPeer.on('signal', data => this.handleSignal(window.hostPeer, data))
      window.hostPeer.on('connect', () => this.handleConnect(window.hostPeer))
      window.hostPeer.on('data', (data) => this.handleData(window.hostPeer, data))
    },
    methods: {
      signal () {
        console.log('signal', this.signalPayload)

        let signalPayload = JSON.parse(this.signalPayload)

        if (signalPayload.type === 'offer') {
          window.hostPeer.signal(signalPayload)
        }

        if (signalPayload.type === 'answer') {
          window.clientPeer.signal(signalPayload)
        }
      },
      copySignal () {
        if (this.isElectron) {
          clipboard.writeText(this.remotePeerId)

          // eslint-disable-next-line no-new
          new Notification('Netsix', {
            body: 'Signal copied to clipboard!'
          })
        }
      },
      handleSignal (peer, data) {
        console.log('PeerConnection: signal: peer, data', peer, data)

        this.$store.commit('UPDATE_IS_CONNECTING', false)

        if (peer.initiator) {
          // when clientPeer has signaling data, give it to hostPeer somehow
          this.$store.commit('UPDATE_LOCAL_PEER_ID', JSON.stringify(data)) // window.hostPeer.signal(data)
        } else {
          // when hostPeer has signaling data, give it to clientPeer somehow
          this.$store.commit('UPDATE_REMOTE_PEER_ID', JSON.stringify(data)) // window.clientPeer.signal(data)
        }
      },
      handleConnect (peer) {
        console.log('PeerConnection: connect: peer.initiator', peer.initiator)

        this.$store.commit('UPDATE_IS_CONNECTED', true)

        // wait for 'connect' event before using the data channel
        peer.send(JSON.stringify({
          type: 'COLLECTIONS',
          payload: this.localCollections
        }))
      },
      handleData (peer, data) {
        console.log('PeerConnection: data: peer.initiator, data', peer.initiator, data)

        if (typeof data === 'string') {
          try {
            let message = JSON.parse(data)

            switch (message.type) {
              case 'COLLECTIONS':
                // Handle the received collections
                this.$store.commit('UPDATE_REMOTE_COLLECTIONS', Object.assign({}, message.payload))
                break
              default:
                console.warn('PeerConnection: data: unknown type received')
            }
          } catch (e) {
            // It's a pure string, not a stringified JSON object
            console.err(e)
          }
        } else {
          // It's a video chunk
        }
      }
    }
  }
</script>
