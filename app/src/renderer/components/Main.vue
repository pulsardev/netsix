<template>
  <div class="row row-offcanvas row-offcanvas-right no-gutters">
    <div class="col-12 col-lg-8">
      <div class="video">
        <video controls></video>
      </div>

      <div class="card mt-3">
        <div class="card-block">
          <h4 class="card-title">Card title</h4>
          <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="card-link">Card link</a>
          <a href="#" class="card-link">Another link</a>
        </div>
      </div>
    </div>

    <sidebar></sidebar>
  </div>
</template>

<script>
  import Sidebar from './Main/Sidebar'

  export default {
    components: {
      Sidebar
    },
    name: 'main'
  }
</script>

<style scoped>
  video {
    background-color: #292b2c;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video {
    height: 0;
    padding-bottom: 62.5%; /* 16:10 */
    position: relative;
  }
</style>
