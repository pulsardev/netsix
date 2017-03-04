<template>
  <div>
    <navbar></navbar>

    <div class="container pt-3">
      <router-view></router-view>

      <hr>

      <footer>
        <p>&copy; Netsix 2017</p>
      </footer>
    </div>
  </div>
</template>

<script>
  import Navbar from './LandingPageView/Navbar'

  export default {
    components: {
      Navbar
    },
    name: 'landing-page'
  }
</script>
