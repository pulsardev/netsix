<template>
  <div>
    <navbar></navbar>

    <div class="container pt-3">
      <h1>Welcome.</h1>

      <hr>

      <footer>
        <p>&copy; Company 2017</p>
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
