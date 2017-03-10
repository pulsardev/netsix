import * as types from '../mutation-types'

const state = {
  messages: []
}

const mutations = {
  [types.PUSH_TO_CHATROOM_MESSAGES] (state, payload) {
    state.messages.push(payload)
  },
  [types.CLEAR_CHATROOM_MESSAGES] (state) {
    state.messages = []
  }
}

export default {
  state,
  mutations
}
