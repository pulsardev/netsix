<template>
  <div>
    <h4 class="card-title">Connect to a friend</h4>
    <p class="card-text">And watch your friend's collections.</p>

    <signaling-connection v-if="useSignaling" v-show="!status.isConnected"></signaling-connection>

    <peer-connection v-show="!useSignaling && !status.isConnected" class="mt-2"></peer-connection>

    <chat-room v-if="status.isConnected" class="mt-4"></chat-room>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import PeerConnection from './RemoteConnection/PeerConnection'
  import SignalingConnection from './RemoteConnection/SignalingConnection'
  import ChatRoom from './RemoteConnection/ChatRoom'

  export default {
    name: 'remote-connection',
    components: {
      ChatRoom, SignalingConnection, PeerConnection
    },
    computed: mapState({
      useSignaling: state => state.connection.useSignaling,
      status: state => state.connection.status
    })
  }
</script>
