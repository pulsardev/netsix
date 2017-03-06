<template>
  <div id="accordion" role="tablist" aria-multiselectable="true">
    <p class="card-text" v-if="!collectionData">No collections to display at the moment.</p>

    <div v-if="collectionData" v-for="(value, key, index) in collectionData" class="card" :class="{ 'mb-1': index !== Object.keys(collectionData).length - 1 }">
      <a class="btn btn-secondary" role="tab" :id="'heading' + index + stringifyPath(key)" data-toggle="collapse" data-parent="#accordion" :href="'#collapse' + index + stringifyPath(key)" aria-expanded="true" :aria-controls="'collapse' + index + stringifyPath(key)">
        {{ key }}
      </a>
      <div :id="'collapse' + index + stringifyPath(key)" class="mt-1 collapse" role="tabpanel" :aria-labelledby="'heading' + index + stringifyPath(key)">
        <div class="list-group">
          <a v-if="value.length > 0" v-for="item in value" href="#" class="list-group-item list-group-item-action flex-column align-items-start" :class="{ active: selectedFile === key + item.filename }">
            <h6 class="mb-1">{{ item.filename }}</h6>
            <small class="text-muted">{{ item.size }}</small>
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
</style>
