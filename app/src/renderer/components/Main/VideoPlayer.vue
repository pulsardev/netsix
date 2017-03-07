<template>
  <div class="video-player">
    <video v-if="canPlay" :src="fileAsDataURL" ref="video" controls></video>
    <video v-if="!canPlay"></video>
  </div>
</template>

<script>
  import path from 'path'
  import * as fs from 'fs'

  export default {
    name: 'video-player',
    props: ['file'],
    data () {
      return {
        canPlay: false,
        fileAsDataURL: ''
      }
    },
    watch: {
      file: function () {
        console.log('VideoPlayer: watch: file()', this.file)

        if (Object.keys(this.file).length > 0) {
          let filePath = path.join(this.file.path + this.file.filename)
          fs.readFile(filePath, (err, data) => {
            if (err) return null
            let base64 = new Buffer(data).toString('base64')
            this.fileAsDataURL = 'data:video/mp4;base64,' + base64
            this.canPlay = true
          })
        }
      }
    }
  }
</script>

<style scoped>
  video {
    background-color: #000;
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
