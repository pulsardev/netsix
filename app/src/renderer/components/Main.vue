<template>
  <div class="row row-offcanvas row-offcanvas-right no-gutters">
    <div class="col-12 col-lg-8">
      <p class="float-right hidden-md-up">
        <button type="button" class="btn btn-primary btn-sm" data-toggle="offcanvas">Toggle nav</button>
      </p>

      <div class="video">
        <video controls></video>
      </div>

      <div class="card mt-3">
        <div class="card-block">
          <h4 class="card-title">Card title</h4>
          <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="card-link">Card link</a>
          <a href="#" class="card-link">Another link</a>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-4 sidebar-offcanvas pl-lg-3 pt-3 pt-lg-0" id="sidebar">
      <div class="card text-center">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" href="#">Active</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
        </div>
        <div class="card-block">
          <h4 class="card-title">Connect to a friend</h4>
          <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-block">
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
</template>

<style scoped>
  video {
    background-color: #292b2c;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video {
    height: 0;
    padding-bottom: 62.5%; /* 16:10 */
    position: relative;
  }
</style>
