<template>
  <div class="card">
    <div class="card-block">
      <h4 class="card-title">{{ file.filename }}</h4>
      <h6 class="card-subtitle mb-2 text-muted">{{ file.path }}</h6>
      <p class="card-text">
        <span class="badge badge-pill badge-primary">{{ codecs.video }}</span>
        <span class="badge badge-pill badge-success">{{ codecs.audio }}</span>
        <span class="badge badge-pill badge-default">{{ receivedChunks }} / {{ file.totalChunks }}</span>
        <span class="badge badge-pill badge-default">{{ filesize(receivedSize) }} / {{ filesize(file.size) }}</span>
        <span class="badge badge-pill badge-default">{{ receivedPercentage }} %</span>
        <span class="badge badge-pill badge-info">{{ filesize(downloadBitrate) }}/s</span>
      </p>
      <div class="progress">
        <div class="progress-bar" role="progressbar" :style="{ width: receivedPercentage + '%' }" style="height: 2px;" :aria-valuenow="receivedPercentage" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import filesize from 'filesize'

  export default {
    name: 'video-info',
    props: ['receivedSize', 'receivedChunks', 'downloadBitrate', 'codecs'],
    computed: {
      receivedPercentage: function () {
        return parseInt(this.receivedSize * 100 / this.file.size)
      },
      ...mapState({
        file: state => state.video.selectedFile
      })
    },
    methods: {
      filesize: filesize
    }
  }
</script>
