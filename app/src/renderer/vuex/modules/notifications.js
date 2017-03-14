import * as types from '../mutation-types'
const uuidV4 = require('uuid/v4')

/**
 * @param items - An array of notifications.
 * @type {{success: [*], info: [*], warning: [*], danger: [*]}}
 */
const state = {
  items: []
}

const mutations = {
  [types.PUSH_NOTIFICATION] (state, payload) {
    state.items.unshift({
      id: uuidV4(),
      ...payload
    })
  },
  [types.CLEAR_NOTIFICATIONS] (state, payload) {
    if (payload.type) {
      state.items = state.items.filter(notification => {
        return notification.type !== payload.type
      })
    } else {
      state.items = []
    }
  },
  [types.REMOVE_NOTIFICATION] (state, payload) {
    state.items = state.items.filter(notification => {
      return notification.id !== payload
    })
  }
}

export default {
  state,
  mutations
}
