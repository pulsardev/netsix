<template>
  <div class="video-player">
    <video ref="video" controls></video>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { bus } from '../../shared/bus'

  let ms
  let video
  let sourceBuffer
  let index = 0
  let chunkDuration = 0

  export default {
    name: 'video-player',
    props: ['file'],
    data () {
      return {
        canAppendChunks: false,
        videoBuffer: []
      }
    },
    computed: {
      codecs: function () {
        let codecs = {}
        for (let track of this.file.information.tracks) {
          codecs[track.type.toLowerCase()] = track.sample_descriptions[0].codecs_string
        }
        return codecs
      },
      ...mapState({
        chunkSize: state => state.video.chunkSize
      })
    },
    mounted () {
      video = this.$refs.video

      bus.$on('video:chunk', (videoChunk) => {
        if (index === 0) {
          this.appendToBuffer(videoChunk)
          index++
        } else {
          this.videoBuffer.push(videoChunk)
          if (this.videoBuffer.length === 1 && !sourceBuffer.updating && index !== this.file.totalChunks) {
            this.nextSegment()
          }
        }
      })
    },
    methods: {
      onMediaSourceOpen: function () {
        console.log('onMediaSourceOpen')
        sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="' + this.codecs.video + ', ' + this.codecs.audio + '"')
        sourceBuffer.addEventListener('updateend', this.nextSegment)

        // Everything is ready to receive the remote video
        if (this.file.type === 'remote') {
          let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
          peer.send(JSON.stringify({
            type: 'ACK_FILE_INFORMATION',
            payload: this.file
          }))
        }

        // Reset the video element
        video.pause()
        video.currentTime = 0

        video.addEventListener('timeupdate', this.checkBuffer)
        video.addEventListener('canplay', () => {
          chunkDuration = video.duration / this.file.totalChunks
          video.play()
        })
      },
      nextSegment: function () {
        if (this.shouldFetchNextSegment()) {
          this.appendToBuffer(this.videoBuffer.shift())
          index++
          if (index === this.file.totalChunks) {
            // We have received all chunks, let's check if there is still chunks to append
            if (this.videoBuffer.length > 0) {
              this.appendToBuffer(this.videoBuffer.shift())
            } else {
              sourceBuffer.removeEventListener('updateend', this.nextSegment)
              video.removeEventListener('timeupdate', this.checkBuffer)
            }
          }
        }
      },
      appendToBuffer: function (videoChunk) {
        if (videoChunk) sourceBuffer.appendBuffer(videoChunk)
      },
      shouldFetchNextSegment: function () {
        let isCurrentTimeBehindLimit = video.currentTime > chunkDuration * index * 0.8
        let canAppendSafely = this.chunkSize * index < 128 * 1024 * 1024
        return (isCurrentTimeBehindLimit || canAppendSafely) && !sourceBuffer.updating && this.videoBuffer.length > 0
      },
      checkBuffer: function () {
        if (this.shouldFetchNextSegment()) {
          console.log('shouldFetchNextSegment: video.currentTime', video.currentTime)
          console.log('shouldFetchNextSegment: chunkDuration, index, chunkDuration * index * 0.8', chunkDuration, index, chunkDuration * index * 0.8)
          this.nextSegment()
        }
      }
    },
    watch: {
      file: function () {
        console.log('VideoPlayer: watch: file()', this.file)
        console.log('information.tracks', this.file.information.tracks)
        console.log('VideoPlayer: codecs', this.codecs)

        // Now that we have the codec, we can create the MediaSource object
        ms = new MediaSource()
        video.src = URL.createObjectURL(ms)

        // Reset
        index = 0

        // https://github.com/bitmovin/mse-demo/blob/master/index.html
        // https://github.com/nickdesaulniers/netfix/blob/gh-pages/demo/bufferWhenNeeded.html
        ms.addEventListener('sourceopen', this.onMediaSourceOpen)
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
