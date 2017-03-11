<template>
  <div class="row row-offcanvas row-offcanvas-right no-gutters">
    <div class="col-12 col-lg-8">
      <video-player :file="selectedFile"></video-player>

      <div v-if="Object.keys(selectedFile).length > 0" class="card mt-3">
        <div class="card-block">
          <h4 class="card-title">{{ selectedFile.filename }}</h4>
          <h6 class="card-subtitle mb-2 text-muted">{{ selectedFile.path }}</h6>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <pre>{{ selectedFile }}</pre>
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
  import { mapState } from 'vuex'

  export default {
    components: {
      Sidebar,
      VideoPlayer
    },
    name: 'main',
    computed: mapState({
      selectedFile: state => state.video.selectedFile
    })
  }
</script>

<style scoped>
  pre {
    color: #fff;
  }
</style>
