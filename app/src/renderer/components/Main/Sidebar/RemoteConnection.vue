<template>
  <div>
    <h4 class="card-title">Connect to a friend</h4>
    <p class="card-text">And watch your friend's collections.</p>

    <signaling-connection v-if="useSignaling"></signaling-connection>

    <peer-connection v-if="!useSignaling" class="mt-2"></peer-connection>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import PeerConnection from './RemoteConnection/PeerConnection'
  import SignalingConnection from './RemoteConnection/SignalingConnection'

  export default {
    name: 'remote-connection',
    components: {
      SignalingConnection, PeerConnection
    },
    computed: mapState({
      useSignaling: state => state.connection.useSignaling
    })
  }
</script>
