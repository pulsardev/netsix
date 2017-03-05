<template>
  <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
    <div class="container">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <router-link to="/" class="navbar-brand">
        <img src="./assets/logo.png">
        <span>Netsix</span>
      </router-link>

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
          <span class="my-2 mr-2" style="background: rgb(66, 183, 42) none repeat scroll 0 0; border-radius: 50%; display: inline-block; height: 10px; margin-left: 4px; width: 10px;"></span>
          <input class="form-control" type="text" placeholder="Local Peer ID">
          <button v-if="isElectron()" class="btn btn-outline-success my-2 my-sm-0 ml-sm-2" type="button" @click="copyToClipboard">Copy</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
  import { clipboard } from 'electron'
  import isElectron from '../../shared/is-electron'

  export default {
    name: 'navbar',
    methods: {
      copyToClipboard () {
        if (isElectron()) {
          clipboard.writeText('Hello World!')
          let notification = new Notification('Netsix', {
            body: 'Local Peer ID copied to clipboard!'
          })
          console.log(notification)
        }
      },
      isElectron: isElectron
    }
  }
</script>

<style scoped>
  img {
    width: 24px;
  }
</style>
