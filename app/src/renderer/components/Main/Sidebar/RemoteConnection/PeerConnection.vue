<template>
  <div>
    <form class="form-inline justify-content-center">
      <div class="input-group">
        <input v-model="signalPayload" class="form-control" type="text" placeholder="Enter a WebRTC signal">
        <span class="input-group-btn">
        <button @click="signal()" class="btn btn-primary" type="button" :disabled="signalPayload === ''">Signal</button>
      </span>
      </div>
    </form>

    <form v-if="remotePeerId" class="form-inline justify-content-center mt-2">
      <div class="input-group">
        <input v-model="remotePeerId" class="form-control" type="text" disabled>
        <span class="input-group-btn">
        <button v-if="isElectron" @click="copySignal" class="btn btn-primary" type="button">Copy</button>
      </span>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import SimplePeer from 'simple-peer'
  import { clipboard } from 'electron'
  import { bus } from '../../../../shared/bus'

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
      this.initializePeers()
    },
    methods: {
      initializePeers () {
        this.$store.commit('UPDATE_IS_CONNECTING', true)
        window.clientPeer = new SimplePeer({initiator: true, trickle: false, objectMode: true})
        window.hostPeer = new SimplePeer({trickle: false, objectMode: true})

        // Client peer listeners
        window.clientPeer.on('signal', data => this.handleSignal(window.clientPeer, data))
        window.clientPeer.on('connect', () => this.handleConnect(window.clientPeer))
        window.clientPeer.on('data', data => this.handleData(window.clientPeer, data))
        window.clientPeer.on('close', () => this.handleClose(window.clientPeer))
        window.clientPeer.on('error', err => this.handleError(window.clientPeer, err))

        // Host peer listeners
        window.hostPeer.on('signal', data => this.handleSignal(window.hostPeer, data))
        window.hostPeer.on('connect', () => this.handleConnect(window.hostPeer))
        window.hostPeer.on('data', data => this.handleData(window.hostPeer, data))
        window.hostPeer.on('close', () => this.handleClose(window.hostPeer))
        window.hostPeer.on('error', err => this.handleError(window.hostPeer, err))
      },
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
        this.$store.commit('PUSH_NOTIFICATION', {type: 'success', message: 'You are connected to a peer!'})

        // wait for 'connect' event before using the data channel
        peer.send(JSON.stringify({
          type: 'COLLECTIONS',
          payload: this.localCollections
        }))
      },
      handleData (peer, data) {
        if (typeof data === 'string') {
          try {
            let message = JSON.parse(data)
            console.log('PeerConnection: data: peer.initiator, message', peer.initiator, message)

            switch (message.type) {
              case 'COLLECTIONS':
                // Handle the received collections
                this.$store.commit('UPDATE_REMOTE_COLLECTIONS', Object.assign({}, message.payload))
                break
              case 'CHAT_MESSAGE':
                // Handle the received collections
                this.$store.commit('PUSH_TO_CHATROOM_MESSAGES', {
                  payload: message.payload,
                  from: 'remote'
                })
                break
              case 'GET_FILE_REQUEST':
                // Handle the received file request
                this.$store.dispatch('handleGetFileRequest', message.payload)
                break
              case 'SEND_FILE_INFORMATION':
                // Handle the received file information
                this.$store.commit('UPDATE_SELECTED_FILE', Object.assign({}, message.payload))
                break
              case 'ACK_FILE_INFORMATION':
                // Handle the received file acknowledgment
                this.$store.dispatch('handleAckFileInformation', message.payload)
                break
              default:
                console.warn('PeerConnection: data: unknown type received', message.type)
            }
          } catch (e) {
            // It's a pure string, not a stringified JSON object
            console.error(e, data)
          }
        } else {
          // It's a video chunk
          bus.$emit('video:chunk', data)
        }
      },
      handleClose (peer) {
        console.log('PeerConnection: close: peer.initiator', peer.initiator)
        this.$store.commit('UPDATE_IS_CONNECTED', false)
        this.initializePeers()
      },
      handleError (peer, err) {
        console.error('PeerConnection: error: peer.initiator, err', peer.initiator, err)
        this.$store.commit('UPDATE_IS_CONNECTED', false)
        this.initializePeers()
      }
    }
  }
</script>
