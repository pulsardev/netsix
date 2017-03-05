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
          <div class="tab-pane active" id="remote" role="tabpanel">
            <h4 class="card-title">Connect to a friend</h4>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>

          <div class="tab-pane" id="local" role="tabpanel">
            <h4 class="card-title">Local parameters</h4>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header">Collections</div>
      <div class="card-block" id="accordion" role="tablist" aria-multiselectable="true">

        <div class="card">
          <a class="btn btn-secondary" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            C:/Films
          </a>
          <div id="collapseOne" class="collapse show" role="tabpanel" aria-labelledby="headingOne">
            <div class="list-group">
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
                <h6 class="mb-1">test.mp4</h6>
                <small class="text-muted">5 Mo</small>
              </a>
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <h6 class="mb-1">test2.mp4</h6>
                <small class="text-muted">30 Mo</small>
              </a>
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <h6 class="mb-1">test3.mp4</h6>
                <small class="text-muted">500 Mo</small>
              </a>
            </div>
          </div>
        </div>

        <div class="card">
          <a class="btn btn-secondary collapsed" role="tab" id="headingTwo" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            C:/Films/Vus/HD/_Temp
          </a>
          <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
            <div class="list-group">
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
                <h6 class="mb-1">test.mp4</h6>
                <small class="text-muted">5 Mo</small>
              </a>
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <h6 class="mb-1">test2.mp4</h6>
                <small class="text-muted">30 Mo</small>
              </a>
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <h6 class="mb-1">test3.mp4</h6>
                <small class="text-muted">500 Mo</small>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sidebar'
  }
</script>
