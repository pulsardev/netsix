// https://github.com/electron/electron/issues/2288
function isElectron () {
  console.log('isElectron')
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true
  }

  return !!(typeof process !== 'undefined' && process.versions && !!process.versions.electron)
}

export default isElectron
