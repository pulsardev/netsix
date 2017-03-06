<template>
  <div class="col-12 col-lg-4 sidebar-offcanvas pl-lg-3 pt-3 pt-lg-0" id="sidebar">
    <div class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#remote" role="tab">Remote</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#local" role="tab">Local</a>
          </li>
        </ul>
      </div>

      <div class="card-block">
        <div class="tab-content">
          <remote-connection class="tab-pane active" id="remote" role="tabpanel"></remote-connection>
          <local-collections class="tab-pane" id="local" role="tabpanel"></local-collections>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header">Collections</div>
      <collections :collection-data="remoteCollections" collection-type="remote" class="card-block"></collections>
    </div>
  </div>
</template>

<script>
  import Collections from './Sidebar/Collections'
  import LocalCollections from './Sidebar/LocalCollections'
  import RemoteConnection from './Sidebar/RemoteConnection'

  export default {
    components: {
      Collections, LocalCollections, RemoteConnection
    },
    name: 'sidebar',
    data () {
      return {
        remoteCollections: {
          'C:/': [
            {filename: 'test.mp4', size: '5000'},
            {filename: 'test2.mp4', size: '30000'},
            {filename: 'test3.mp4', size: '500000'}
          ],
          'C:/Films/_Temp/': [
            {filename: 'test.mp4', size: '5000'},
            {filename: 'test2.mp4', size: '30000'}
          ],
          'C:/Films/Vus/HD/_Temp/': [
            {filename: 'test2.mp4', size: '30000'},
            {filename: 'test3.mp4', size: '500000'}
          ]
        }
      }
    }
  }
</script>
