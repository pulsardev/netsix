<template>
  <div>
    <li>
      <a href="#" class="nav-link" data-toggle="modal" data-target="#optionsModal">Options</a>
    </li>

    <div id="optionsModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="optionsModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="optionsModalLabel">Options</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" :checked="useSignaling" @change="toggleSignaling">
                  Use PubNub for signaling
                </label>
                <small id="useSignalingHelp" class="form-text text-muted">If you uncheck this option, you'll switch to a manual connection mode that doesn't require any servers but requires more steps to create the connection.</small>
              </div>
              <fieldset class="form-group">
                <legend>PubNub options</legend>
                <div class="form-group row">
                  <label for="publishKey" class="col-sm-3 col-form-label">Publish Key</label>
                  <div class="col-sm-9">
                    <input v-model="publishKey" type="text" class="form-control" id="publishKey" placeholder="Publish Key">
                  </div>
                </div>
                <div class="form-group row">
                  <label for="subscribeKey" class="col-sm-3 col-form-label">Subscribe Key</label>
                  <div class="col-sm-9">
                    <input v-model="subscribeKey" type="text" class="form-control" id="subscribeKey" placeholder="Subscribe Key">
                  </div>
                </div>
                <small id="signalingOptionsHelp" class="form-text text-muted">A refresh is necessary for changes to these fields to be effective.</small>
              </fieldset>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button @click="saveOptions" type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'options',
    data () {
      return {
        publishKey: localStorage.getItem('publishKey') ? localStorage.getItem('publishKey') : '',
        subscribeKey: localStorage.getItem('subscribeKey') ? localStorage.getItem('subscribeKey') : ''
      }
    },
    computed: mapState({
      useSignaling: state => state.connection.useSignaling
    }),
    methods: {
      toggleSignaling () {
        this.$store.commit('TOGGLE_SIGNALING')
      },
      saveOptions () {
        localStorage.setItem('useSignaling', this.useSignaling)

        // Save the PubNub options
        if (this.publishKey !== '' && this.subscribeKey !== '') {
          localStorage.setItem('publishKey', this.publishKey)
          localStorage.setItem('subscribeKey', this.subscribeKey)
        } else {
          localStorage.removeItem('publishKey')
          localStorage.removeItem('subscribeKey')
        }

        window.$('#optionsModal').modal('hide')
      }
    }
  }
</script>

<style scoped>
  fieldset:last-child, fieldset:last-child .form-group:last-child {
    margin-bottom: 0;
  }
</style>
