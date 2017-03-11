<template>
  <div id="accordion" role="tablist" aria-multiselectable="true">
    <p class="card-text" v-if="Object.keys(collectionData).length === 0">No collections to display at the moment.</p>

    <div v-if="Object.keys(collectionData).length > 0" v-for="(value, key, index) in collectionData" class="card" :class="{ 'mb-1': index !== Object.keys(collectionData).length - 1 }">
      <div class="btn-group">
        <a class="btn btn-block btn-secondary" role="tab" :id="'heading' + uuids[index]" data-toggle="collapse" data-parent="#accordion" :href="'#collapse' + uuids[index]" aria-expanded="true" :aria-controls="'collapse' + uuids[index]">{{ key }}</a>
        <button v-if="collectionType === 'local'" @click="deleteCollection(key)" class="btn btn-danger" type="button">
          <span class="close" aria-hidden="true">&times;</span>
        </button>
      </div>
      <div :id="'collapse' + uuids[index]" class="mt-1 collapse" role="tabpanel" :aria-labelledby="'heading' + uuids[index]">
        <div class="list-group">
          <a @click.prevent="selectFile(key, item)" v-if="value.length > 0" v-for="item in value" href="#" class="list-group-item list-group-item-action flex-column align-items-start" :class="{ active: selectedFile === key + item.filename }">
            <h6 class="mb-1">{{ item.filename }}</h6>
            <small class="text-muted">{{ filesize(item.size) }}</small>
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
  import filesize from 'filesize'
  import { db } from '../../../shared/db'

  const uuidV4 = require('uuid/v4')

  export default {
    name: 'collections',
    props: ['collectionData', 'collectionType'],
    data () {
      return {
        selectedFile: 'C:/test.mp4'
      }
    },
    computed: {
      // Generate unique UUIDs for each collection
      uuids: function () {
        let uuids = []
        for (let i = 0; i < Object.keys(this.collectionData).length; i++) {
          uuids.push(uuidV4())
        }
        return uuids
      }
    },
    methods: {
      uuidV4: uuidV4,
      filesize: filesize,
      deleteCollection (collection) {
        db.unset('localCollections.' + collection).write()
        this.$store.commit('UPDATE_LOCAL_COLLECTIONS', Object.assign({}, db.get('localCollections').value()))
      },
      selectFile (collection, file) {
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
</style>
