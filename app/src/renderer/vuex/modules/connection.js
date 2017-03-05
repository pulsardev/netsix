import * as types from '../mutation-types'

const state = {
  localPeerId: Math.random().toString(36).substring(7),
  remotePeerId: '',
  status: {
    isConnected: false,
    isConnecting: false
  }
}

const mutations = {
  [types.UPDATE_REMOTE_PEER_ID] (state, payload) {
    state.remotePeerId = payload
  },
  [types.SET_CONNECTION_STATUS] (state, payload) {
    state.status = payload
  }
}

export default {
  state,
  mutations
}
