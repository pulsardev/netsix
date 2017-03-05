<template>
  <div class="video-player">
    <video controls></video>
  </div>
</template>

<script>
  export default {
    name: 'video-player'
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

  .video-player {
    height: 0;
    padding-bottom: 62.5%; /* 16:10 */
    position: relative;
  }
</style>
