<template>
  <div class="video-player">
    <video v-if="canPlay" ref="video" controls></video>
    <video v-if="!canPlay"></video>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  let ms
  let video
  let sourceBuffer
  let videoBuffer = []
  let index = 0
  let numberOfChunks = 0
  let segmentDuration = 0
  let chunkSize = 16 * 1024

  export default {
    name: 'video-player',
    props: ['file'],
    data () {
      return {
        canPlay: true,
        canAppendChunks: false,
        codecs: {}
      }
    },
    computed: mapState({
      videoBuffer: state => state.video.videoBuffer
    }),
    methods: {
      onMediaSourceOpen: function () {
        console.log('onMediaSourceOpen')
        sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="' + this.codecs.video + ', ' + this.codecs.audio + '"')
        sourceBuffer.addEventListener('updateend', this.nextSegment)

        // Reset the video element
        video.pause()
        video.currentTime = 0

        video.addEventListener('timeupdate', this.checkBuffer)
        video.addEventListener('canplay', () => {
          segmentDuration = video.duration / numberOfChunks
          video.play()
        })
      },
      nextSegment: function () {
        if (this.shouldFetchNextSegment()) {
          this.appendToBuffer(videoBuffer.shift())
          index++
          if (index > numberOfChunks) {
            sourceBuffer.removeEventListener('updateend', this.nextSegment)
            video.removeEventListener('timeupdate', this.checkBuffer)
          }
        }
      },
      appendToBuffer: function (videoChunk) {
        if (videoChunk) {
          sourceBuffer.appendBuffer(videoChunk)
        }
      },
      shouldFetchNextSegment: function () {
        return (video.currentTime > segmentDuration * index * 0.8) || (chunkSize * index < 64 * 1024 * 1024)
      },
      checkBuffer: function () {
        if (this.shouldFetchNextSegment()) {
          console.log('shouldFetchNextSegment: video.currentTime', video.currentTime)
          console.log('shouldFetchNextSegment: segmentDuration, index, segmentDuration * index * 0.8', segmentDuration, index, segmentDuration * index * 0.8)
          this.nextSegment()
        }
      }
    },
    watch: {
      videoBuffer: function () {
        console.log('videoBuffer: watch')
        console.log(this.videoBuffer.length)

        for (let value of this.videoBuffer) {
          videoBuffer.push(value)
        }

        numberOfChunks = this.videoBuffer.length
        this.canAppendChunks = true
        console.log('videoBuffer: watch: canAppendChunks', this.canAppendChunks)

        if (this.videoBuffer.length === 0) {
          this.canAppendChunks = false
        }
      },
      canAppendChunks: function () {
        console.log('canAppendChunks: watch', this.canAppendChunks)
        if (this.canAppendChunks) {
          this.appendToBuffer(videoBuffer.shift())
        }
      },
      file: function () {
        console.log('VideoPlayer: watch: file()', this.file)

        console.log('information.tracks', this.file.information.tracks)

        for (let track of this.file.information.tracks) {
          this.codecs[track.type.toLowerCase()] = track.sample_descriptions[0].codecs_string
        }

        console.log('VideoPlayer: codecs', this.codecs)

        // Now that we have the codec, we can create the MediaSource object
        ms = new MediaSource()
        video = this.$refs.video
        video.src = URL.createObjectURL(ms)

        // Reset
        index = 0

        // https://github.com/bitmovin/mse-demo/blob/master/index.html
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
