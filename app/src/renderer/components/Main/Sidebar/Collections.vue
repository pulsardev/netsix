<template>
  <div id="accordion" role="tablist" aria-multiselectable="true">
    <p class="card-text" v-if="!collectionData">No collections to display at the moment.</p>

    <div v-if="collectionData" v-for="(value, key, index) in collectionData" class="mb-1 card">
      <a class="btn btn-secondary" role="tab" :id="'heading' + index" data-toggle="collapse" data-parent="#accordion" :href="'#collapse' + index" aria-expanded="true" :aria-controls="'collapse' + index">
        {{ key }}
      </a>
      <div :id="'collapse' + index" class="mt-1 collapse" role="tabpanel" :aria-labelledby="'heading' + index">
        <div class="list-group">
          <a v-for="item in value" href="#" class="list-group-item list-group-item-action flex-column align-items-start" :class="{ active: selectedFile === key + item.filename }">
            <h6 class="mb-1">{{ item.filename }}</h6>
            <small class="text-muted">{{ item.size }}</small>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'collections',
    props: ['collectionData', 'collectionType'],
    data () {
      return {
        selectedFile: 'C:/test.mp4'
      }
    }
  }
</script>

<style scoped>
  .btn[role="tab"] {
    text-align: left;
  }
</style>
