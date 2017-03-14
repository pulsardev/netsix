import * as types from '../mutation-types'
const uuidV4 = require('uuid/v4')

const state = {
  localPeerId: localStorage.getItem('localPeerId') ? localStorage.getItem('localPeerId') : uuidV4(),
  remotePeerId: '',
  signalingOffer: '',
  signalingAnswer: '',
  status: {
    isConnected: false,
    isConnecting: false
  },
  useSignaling: localStorage.getItem('useSignaling') ? localStorage.getItem('useSignaling') : true
}

const mutations = {
  [types.UPDATE_LOCAL_PEER_ID] (state, payload) {
    state.localPeerId = payload
  },
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
  },
  [types.TOGGLE_SIGNALING] (state) {
    state.status.useSignaling = !state.status.useSignaling
  },
  [types.UPDATE_SIGNALING_OFFER] (state, payload) {
    state.signalingOffer = payload
  },
  [types.UPDATE_SIGNALING_ANSWER] (state, payload) {
    state.signalingAnswer = payload
  }
}

export default {
  state,
  mutations
}
