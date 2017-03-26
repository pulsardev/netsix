<template>
  <div id="accordion" role="tablist" aria-multiselectable="true">
    <p class="card-text" v-if="Object.keys(collectionData).length === 0">No collections to display at the moment.</p>

    <div v-if="Object.keys(collectionData).length > 0" v-for="(value, key, index) in collectionData" class="card" :class="{ 'mb-1': index !== Object.keys(collectionData).length - 1 }">
      <div class="btn-group">
        <a class="btn btn-block btn-secondary" role="tab" :id="'heading' + uuids[index]" data-toggle="collapse" data-parent="#accordion" :href="'#collapse' + uuids[index]" aria-expanded="true" :aria-controls="'collapse' + uuids[index]">{{ key }}</a>
        <button v-if="collectionType === 'local'" @click.prevent="openLocalDirectory(key)" class="btn btn-warning btn-sm" type="button">
          <i class="fa fa-folder-open" aria-hidden="true"></i>
        </button>
        <button v-if="collectionType === 'local'" @click.prevent="deleteCollection(key)" class="btn btn-danger btn-sm" type="button">
          <span class="close" aria-hidden="true">&times;</span>
        </button>
      </div>
      <div :id="'collapse' + uuids[index]" class="mt-1 collapse" role="tabpanel" :aria-labelledby="'heading' + uuids[index]">
        <div class="list-group">
          <a @click.prevent="selectFile(key, item)" v-if="value.length > 0" v-for="item in value" href="#" class="list-group-item list-group-item-action flex-column align-items-start" :class="{ active: isFileSelected(key, item), disabled: requestedFile.id }">
            <div class="d-flex w-100 justify-content-between text-left" data-toggle="tooltip" data-placement="top" data-trigger="hover" :title="item.filename">
              <div class="d-flex flex-column w-75">
                <h6 class="mb-1 text-truncate">{{ item.filename }}</h6>
                <small class="text-muted">{{ filesize(item.size) }}</small>
                <div v-if="requestedFile.id === item.id && transcodingProgress > 0" class="row align-items-center no-gutters progress-row">
                  <div class="col">
                    <div class="progress">
                      <div class="progress-bar" role="progressbar" :style="{ width: transcodingProgress + '%' }" style="height: 2px;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <button @click.stop.prevent="cancelTranscoding" type="button" class="btn btn-link"><i class="fa fa-times-circle" aria-hidden="true"></i></button>
                  </div>
                </div>
              </div>
              <div v-if="requestedFile.id === item.id" class="align-self-center">
                <i class="fa fa-circle-o-notch fa-spin fa-fw text-success"></i>
              </div>
            </div>
          </a>

          <a v-if="value.length === 0" class="list-group-item list-group-item-action flex-column align-items-start">
            No items in this collection.
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import filesize from 'filesize'
  import path from 'path'
  import { db } from '../../../shared/db'
  import { shell } from 'electron'

  const uuidV4 = require('uuid/v4')

  export default {
    name: 'collections',
    props: ['collectionData', 'collectionType'],
    computed: {
      // Generate unique UUIDs for each collection
      uuids: function () {
        let uuids = []
        for (let i = 0; i < Object.keys(this.collectionData).length; i++) {
          uuids.push(uuidV4())
        }
        return uuids
      },
      ...mapState({
        selectedFile: state => state.video.selectedFile,
        requestedFile: state => state.video.requestedFile,
        transcodingProgress: state => state.video.transcodingProgress
      })
    },
    mounted () {
      this.initTooltips()
    },
    methods: {
      uuidV4: uuidV4,
      filesize: filesize,
      deleteCollection (collection) {
        db.unset('localCollections.' + collection).write()
        this.$store.commit('UPDATE_LOCAL_COLLECTIONS', Object.assign({}, db.get('localCollections').value()))
      },
      selectFile (collection, file) {
        if (!this.requestedFile.id) {
          this.$store.commit('UPDATE_REQUESTED_FILE', Object.assign({}, file))

          if (this.collectionType === 'local') {
            this.$store.dispatch('handleGetFileRequest', {
              type: this.collectionType,
              path: collection,
              ...file
            })
          } else {
            let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer

            let message = {
              type: 'GET_FILE_REQUEST',
              payload: {
                type: this.collectionType,
                path: collection,
                ...file
              }
            }

            peer.send(JSON.stringify(message))
          }
        }
      },
      isFileSelected (filePath, file) {
        if (this.selectedFile.filename) {
          let selectedFile = path.join(this.selectedFile.path, this.selectedFile.filename.split('.').shift())
          let currentFile = path.join(filePath, '.netsix', file.filename.split('.').shift())
          return selectedFile === currentFile
        } else {
          return false
        }
      },
      initTooltips () {
        window.$('[data-toggle="tooltip"]').tooltip({
          delay: {'show': 750, 'hide': 50}
        })
      },
      cancelTranscoding () {
        if (this.collectionType === 'local') {
          this.$store.dispatch('handleCancelTranscodingInformation')
        } else {
          let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
          peer.send(JSON.stringify({type: 'CANCEL_TRANSCODING_REQUEST'}))
        }
      },
      openLocalDirectory (folderPath) {
        shell.openExternal(folderPath)
      }
    },
    watch: {
      collectionData: function () {
        this.initTooltips()
      },
      selectedFile: function () {
        window.scrollTo(0, 0)
      }
    }
  }
</script>

<style scoped>
  .btn[role="tab"] {
    text-align: left;
    overflow: hidden;
  }

  .card {
    border: none;
  }

  .list-group-item {
    overflow: hidden;
  }

  .close {
    line-height: 0.75;
  }

  .progress-row {
    margin-bottom: -0.5rem;
  }

  .btn-group .btn {
    cursor: pointer;
  }
</style>
