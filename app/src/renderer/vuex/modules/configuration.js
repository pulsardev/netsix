import isElectron from '../../shared/is-electron'

const state = {
  isElectron: isElectron(),
  acceptedExtensions: ['mp4'] // 'mkv', 'avi', 'mp4'
}

export default {
  state
}
