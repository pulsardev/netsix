<template>
  <div class="row row-offcanvas row-offcanvas-right no-gutters">
    <div class="col-12 col-lg-8">
      <video-player :file="selectedFile"></video-player>
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
