<template>
  <div>
    <h4 class="card-title">Local parameters</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>

    <collections collection-type="local" class="card-block"></collections>
  </div>
</template>

<script>
  import Collections from './Collections'

  export default {
    components: {
      Collections
    },
    name: 'local-collections'
  }
</script>
