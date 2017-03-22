<template>
  <div>
    <navbar></navbar>

    <div class="container pt-3">
      <router-view></router-view>

      <hr>

      <footer>
        <p>&copy; Netsix 2017 | {{ appVersion }} | <a @click.prevent="checkForUpdates" href="#">Check for updates</a> | {{ autoUpdateStatus }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
  import Navbar from './LandingPageView/Navbar'
  import { ipcRenderer, remote } from 'electron'

  export default {
    components: {
      Navbar
    },
    name: 'landing-page',
    data () {
      return {
        appVersion: remote.app.getVersion(),
        autoUpdateStatus: ''
      }
    },
    mounted () {
      ipcRenderer.on('auto-updater', (event, arg) => {
        this.autoUpdateStatus = arg
      })

      // Add useful shortcuts
      document.addEventListener('keydown', function (e) {
        if (e.which === 123) {
          remote.getCurrentWindow().toggleDevTools()
        } else if (e.which === 116) {
          location.reload()
        }
      })
    },
    methods: {
      checkForUpdates: function () {
        ipcRenderer.send('auto-updater', 'check-for-update')
        ipcRenderer.send('analytics', {event: 'check-for-update'})
      }
    }
  }
</script>
