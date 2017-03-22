<template>
  <div>
    <div class="video-player">
      <video ref="video" controls></video>
    </div>

    <video-info v-if="Object.keys(file).length > 0" :received-size="receivedSize" :received-chunks="receivedChunks" :download-bitrate="downloadBitrate" :codecs="codecs" class="mt-3"></video-info>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { bus } from '../../shared/bus'
  import VideoInfo from './VideoPlayer/VideoInfo'
  import speedometer from 'speedometer'

  let ms
  let video
  let sourceBuffer
  let chunkDuration = 0
  let speed

  export default {
    name: 'video-player',
    props: ['file'],
    components: {
      VideoInfo
    },
    data () {
      return {
        videoBuffer: [],
        receivedChunks: 0,
        receivedSize: 0,
        downloadBitrate: 0
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
    },
    methods: {
      handleChunk: function (videoChunk) {
        this.receivedSize += videoChunk.byteLength
        this.downloadBitrate = speed(videoChunk.byteLength)
        if (this.receivedChunks === 0) {
          this.appendToBuffer(videoChunk)
          this.receivedChunks++
        } else {
          this.videoBuffer.push(videoChunk)
          if (this.videoBuffer.length === 1 && !sourceBuffer.updating && this.receivedChunks !== this.file.totalChunks) {
            this.nextSegment()
          }
        }
      },
      onMediaSourceOpen: function () {
        console.log('onMediaSourceOpen')
        sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="' + this.codecs.video + ', ' + this.codecs.audio + '"')
        sourceBuffer.addEventListener('updateend', this.nextSegment)

        // Reset the video element
        video.pause()
        video.currentTime = 0

        video.addEventListener('timeupdate', this.checkBuffer)
        video.addEventListener('canplay', () => {
          chunkDuration = video.duration / this.file.totalChunks
          video.play()
        })

        // Ready to listen to incoming chunks
        bus.$on('video:chunk', videoChunk => this.handleChunk(videoChunk))

        // Everything is ready to receive the remote video
        if (this.file.type === 'remote') {
          let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
          peer.send(JSON.stringify({
            type: 'ACK_FILE_INFORMATION',
            payload: this.file
          }))
        } else {
          this.$store.dispatch('handleAckFileInformation', this.file)
        }
      },
      nextSegment: function () {
        if (this.shouldFetchNextSegment()) {
          this.appendToBuffer(this.videoBuffer.shift())
          this.receivedChunks++
          if (this.receivedChunks === this.file.totalChunks) {
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
        try {
          if (videoChunk) sourceBuffer.appendBuffer(videoChunk)
        } catch (e) {
          console.error(e)
          this.$store.commit('PUSH_NOTIFICATION', {type: 'danger', message: e.toString()})
        }
      },
      shouldFetchNextSegment: function () {
        let isCurrentTimeBehindLimit = video.currentTime > chunkDuration * this.receivedChunks * 0.8
        let canAppendSafely = this.chunkSize * this.receivedChunks < 128 * 1024 * 1024
        return (isCurrentTimeBehindLimit || canAppendSafely) && !sourceBuffer.updating && this.videoBuffer.length > 0
      },
      checkBuffer: function () {
        if (this.shouldFetchNextSegment()) {
          console.log('shouldFetchNextSegment: video.currentTime', video.currentTime)
          console.log('shouldFetchNextSegment: chunkDuration, this.receivedChunks, chunkDuration * this.receivedChunks * 0.8', chunkDuration, this.receivedChunks, chunkDuration * this.receivedChunks * 0.8)
          this.nextSegment()
        }
      },
      reload: function () {
        // Reset
        Object.assign(this.$data, this.$options.data())
        speed = speedometer()

        // Now that we have the codec, we can create the MediaSource object
        ms = new MediaSource()
        video.src = URL.createObjectURL(ms)

        // https://github.com/bitmovin/mse-demo/blob/master/this.receivedChunks.html
        // https://github.com/nickdesaulniers/netfix/blob/gh-pages/demo/bufferWhenNeeded.html
        ms.addEventListener('sourceopen', this.onMediaSourceOpen)
      },
      checkSourceBufferAndReload: function () {
        if (sourceBuffer && sourceBuffer.updating) {
          window.setTimeout(() => {
            console.log('VideoPlayer: checkSourceBufferAndReload: setTimeout')
            this.reload()
          }, 1000)
        } else {
          this.reload()
        }
      }
    },
    watch: {
      file: function () {
        console.log('VideoPlayer: watch: file()', this.file)
        console.log('information.tracks', this.file.information.tracks)
        console.log('VideoPlayer: codecs', this.codecs)

        // Stop listening to incoming chunks
        bus.$off('video:chunk')

        // Check if we're not finishing to append a segment before requesting new segments
        this.checkSourceBufferAndReload()
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
