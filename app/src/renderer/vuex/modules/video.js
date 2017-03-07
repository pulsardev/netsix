import * as types from '../mutation-types'

const state = {
  selectedFile: {}
}

const mutations = {
  [types.UPDATE_SELECTED_FILE] (state, payload) {
    state.selectedFile = payload
  }
}

export default {
  state,
  mutations
}
