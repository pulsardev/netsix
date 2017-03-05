<template>
  <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
    <div class="container">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <router-link to="/" class="navbar-brand"><img src="./assets/logo.png"> Netsix</router-link>

      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
          <router-link tag="li" to="/" class="nav-item" exact>
            <a class="nav-link">Home</a>
          </router-link>
          <router-link tag="li" to="/about" class="nav-item" exact>
            <a class="nav-link">About</a>
          </router-link>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Help</a>
            <div class="dropdown-menu" aria-labelledby="dropdown01">
              <a class="dropdown-item disabled" href="#">Guide</a>
              <a class="dropdown-item" href="#">Reset connection</a>
              <a class="dropdown-item" href="#">Refresh components</a>
            </div>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <span v-if="status.isConnected" class="my-2 mr-2 status" title="Connected"></span>
          <span v-if="!status.isConnected" class="my-2 mr-2 status status--error" title="Disconnected"></span>
          <input :value="localPeerId" class="form-control" type="text" placeholder="Local Peer ID" disabled>
          <button v-if="isElectron" class="btn btn-outline-success my-2 my-sm-0 ml-sm-2" type="button" @click="copyToClipboard">Copy</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapState } from 'vuex'
  import { clipboard } from 'electron'

  export default {
    name: 'navbar',
    computed: mapState({
      localPeerId: state => state.connection.localPeerId,
      status: state => state.connection.status,
      isElectron: state => state.configuration.isElectron
    }),
    methods: {
      copyToClipboard () {
        if (this.isElectron) {
          clipboard.writeText(this.localPeerId)
          // eslint-disable-next-line no-new
          new Notification('Netsix', {
            body: 'Local Peer ID copied to clipboard!'
          })
        }
      }
    }
  }
</script>

<style scoped>
  img {
    width: 24px;
  }

  .status {
    background: rgb(66, 183, 42) none repeat scroll 0 0;
    border-radius: 50%;
    display: inline-block;
    height: 10px;
    margin-left: 4px;
    width: 10px;
  }

  .status--error {
    background: rgb(228, 55, 37) none repeat scroll 0 0;
  }
</style>
