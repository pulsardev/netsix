import * as types from '../mutation-types'
import { bus } from '../../shared/bus'

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
    if (state.items[0]) console.log('notifications: state.items[0].timestamp', state.items[0].timestamp)
    if (state.items[0]) console.log('notifications: Date.now() - state.items[0].timestamp', Date.now() - state.items[0].timestamp)

    // Don't emit a notification if the last one was emitted less than 250 ms ago
    if (state.items[0] && Date.now() - state.items[0].timestamp > 250 || !state.items[0]) {
      let item = {id: uuidV4(), timestamp: Date.now(), ...payload}
      state.items.unshift(item)
      bus.$emit('notification:push', item)
    }
  },
  [types.CLEAR_NOTIFICATIONS] (state, payload) {
    if (payload && payload.type) {
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
