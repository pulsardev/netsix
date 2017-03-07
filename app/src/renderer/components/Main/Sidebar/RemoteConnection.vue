<template>
  <div>
    <h4 class="card-title">Connect to a friend</h4>
    <p class="card-text">And watch your friend's collections.</p>

    <form class="form-inline">
      <fieldset>
        <input :value="remotePeerId" @input="updateRemotePeerId" class="form-control mr-2" type="text" placeholder="Enter a friend's ID">
        <button @click="connect()" class="btn btn-primary" type="button" :disabled="remotePeerId === ''">Connect</button>
      </fieldset>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'remote-connection',
    computed: mapState({
      remotePeerId: state => state.connection.remotePeerId
    }),
    methods: {
      updateRemotePeerId (e) {
        this.$store.commit('UPDATE_REMOTE_PEER_ID', e.target.value)
      },
      connect () {
        localStorage.setItem('remotePeerId', this.remotePeerId)
      }
    }
  }
</script>

<style scoped>
  .form-control {
    width: 50%;
  }
</style>
