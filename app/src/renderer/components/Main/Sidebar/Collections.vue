<template>
  <div id="accordion" role="tablist" aria-multiselectable="true">
    <p class="card-text" v-if="Object.keys(collectionData).length === 0">No collections to display at the moment.</p>

    <div v-if="Object.keys(collectionData).length > 0" v-for="(value, key, index) in collectionData" class="card" :class="{ 'mb-1': index !== Object.keys(collectionData).length - 1 }">
      <div class="btn-group">
        <a class="btn btn-block btn-secondary" role="tab" :id="'heading' + index + stringifyPath(key)" data-toggle="collapse" data-parent="#accordion" :href="'#collapse' + index + stringifyPath(key)" aria-expanded="true" :aria-controls="'collapse' + index + stringifyPath(key)">{{ key }}</a>
        <button v-if="collectionType === 'local'" @click="deleteCollection(key)" class="btn btn-danger" type="button">
          <span class="close" aria-hidden="true">&times;</span>
        </button>
      </div>
      <div :id="'collapse' + index + stringifyPath(key)" class="mt-1 collapse" role="tabpanel" :aria-labelledby="'heading' + index + stringifyPath(key)">
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
  import path from 'path'
  import filesize from 'filesize'
  import { db } from '../../../shared/db'

  export default {
    name: 'collections',
    props: ['collectionData', 'collectionType'],
    data () {
      return {
        selectedFile: 'C:/test.mp4'
      }
    },
    methods: {
      stringifyPath (folder) {
        return folder.replace(new RegExp('\\' + path.sep, 'g'), '').replace(new RegExp(':', 'g'), '').toLowerCase()
      },
      filesize: filesize,
      deleteCollection (collection) {
        db.unset('localCollections.' + collection).write()
        this.$store.commit('UPDATE_LOCAL_COLLECTIONS', Object.assign({}, db.get('localCollections').value()))
      },
      selectFile (collection, file) {
        this.$store.dispatch('handleGetFileRequest', {
          type: this.collectionType,
          path: collection,
          ...file
        })
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
