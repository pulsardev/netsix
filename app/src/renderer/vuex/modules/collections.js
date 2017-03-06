import * as types from '../mutation-types'

import { db } from '../../shared/db'

const state = {
  localCollections: db.get('localCollections').value() ? db.get('localCollections').value() : {},
  remoteCollections: {}
}

const mutations = {
  [types.UPDATE_LOCAL_COLLECTIONS] (state, payload) {
    state.localCollections = payload
  },
  [types.UPDATE_REMOTE_COLLECTIONS] (state, payload) {
    state.remoteCollections = payload
  }
}

export default {
  state,
  mutations
}
