<template>
  <div class="row row-offcanvas row-offcanvas-right no-gutters">
    <div class="col-12 col-lg-8">
      <video-player></video-player>

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
  import VideoPlayer from './Main/VideoPlayer'

  export default {
    components: {
      Sidebar,
      VideoPlayer
    },
    name: 'main'
  }
</script>
