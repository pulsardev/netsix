import * as types from '../mutation-types'

const state = {
  localPeerId: localStorage.getItem('localPeerId') ? localStorage.getItem('localPeerId') : Math.random().toString(36).substring(7),
  remotePeerId: localStorage.getItem('remotePeerId') ? localStorage.getItem('remotePeerId') : '',
  status: {
    isConnected: false,
    isConnecting: false
  }
}

const mutations = {
  [types.UPDATE_REMOTE_PEER_ID] (state, payload) {
    state.remotePeerId = payload
  },
  [types.UPDATE_CONNECTION_STATUS] (state, payload) {
    state.status = payload
  },
  [types.UPDATE_IS_CONNECTED] (state, payload) {
    state.status.isConnected = payload
  },
  [types.UPDATE_IS_CONNECTING] (state, payload) {
    state.status.isConnecting = payload
  }
}

export default {
  state,
  mutations
}
