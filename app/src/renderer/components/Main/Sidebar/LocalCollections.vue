<template>
  <div>
    <h4 class="card-title">Local collections</h4>
    <p class="card-text">Add collections to share with your friends.</p>
    <button v-if="isElectron" @click="addCollection" class="btn btn-primary" type="button">Add collection</button>

    <collections :collection-data="localCollections" collection-type="local" class="card-block"></collections>
  </div>
</template>

<script>
  import Collections from './Collections'
  import { mapState } from 'vuex'
  import * as fs from 'fs'
  const {dialog} = require('electron').remote
  import { db } from '../../../shared/db'
  import path from 'path'

  export default {
    components: {
      Collections
    },
    name: 'local-collections',
    data () {
      return {
        acceptedExtensions: ['mkv', 'avi', 'mp4']
      }
    },
    computed: mapState({
      isElectron: state => state.configuration.isElectron,
      localCollections: state => state.collections.localCollections
    }),
    methods: {
      addCollection () {
        let collectionPath = dialog.showOpenDialog({
          filters: [{name: 'Movies', extensions: this.acceptedExtensions}],
          properties: ['openDirectory']
        })

        console.log('LocalCollections: addCollection(): collectionPath', collectionPath)

        if (collectionPath) {
          let folder = collectionPath[0] + path.sep

          fs.readdir(folder, (err, dir) => {
            if (!err) {
              // Exclude files with non-accepted extensions
              let acceptedFiles = dir.filter((file) => {
                let fileExtension = file.split('.').pop()
                return this.acceptedExtensions.includes(fileExtension)
              })

              // Create a file object with the size
              acceptedFiles = acceptedFiles.map((file) => {
                let fileStats = fs.statSync(path.join(folder, file))
                return {filename: file, size: fileStats.size}
              })

              console.log('LocalCollections: addCollection(): acceptedFiles', acceptedFiles)

              db.get('localCollections').set(folder, acceptedFiles).write()
              this.$store.commit('UPDATE_LOCAL_COLLECTIONS', Object.assign({}, db.get('localCollections').value()))
            }
          })
        }
      }
    }
  }
</script>
