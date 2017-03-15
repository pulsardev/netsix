import * as types from '../mutation-types'
import * as childProcess from 'child_process'
import path from 'path'
import * as fs from 'fs'
import { bus } from '../../shared/bus'

const mp4fragmentPath = require('../../assets/bin/mp4fragment.exe')
const mp4infoPath = require('../../assets/bin/mp4info.exe')

const state = {
  selectedFile: {},
  chunkSize: 64 * 1024,
  requestedFile: {}
}

const mutations = {
  [types.UPDATE_SELECTED_FILE] (state, payload) {
    state.selectedFile = payload
  },
  [types.UPDATE_REQUESTED_FILE] (state, payload) {
    state.requestedFile = payload
  }
}

const actions = {
  handleGetFileRequest: ({commit}, selectedFile) => {
    console.log('handleGetFileRequest', selectedFile)

    // Stop sending chunks
    if (readStream) readStream.pause()

    // Create a directory to store fragmented files if it doesn't exist already
    let fragmentedFilesDirectory = path.join(selectedFile.path, '.netsix')
    if (!fs.existsSync(fragmentedFilesDirectory)) {
      fs.mkdirSync(fragmentedFilesDirectory)
    }

    // The final file must be a mp4
    let destinationFile = selectedFile.filename.split('.').shift() + '.mp4'

    // mp4fragment input.mp4 .netsix/output.mp4
    let binPath = process.env.NODE_ENV === 'production' ? 'resources/app.asar/dist' : 'app/dist'
    childProcess.execFile(path.join(binPath, mp4fragmentPath), [path.join(selectedFile.path, selectedFile.filename), path.join(fragmentedFilesDirectory, destinationFile)], (error, stdout, stderr) => {
      if (error) console.error(`error: ${error}`)
      if (stdout) console.log(`stdout: ${stdout}`)
      if (stderr) console.log(`stderr: ${stderr}`)

      if (error) {
        // Error, reset the state
        commit(types.UPDATE_REQUESTED_FILE, Object.assign({}, {}))
        commit('PUSH_NOTIFICATION', {type: 'danger', message: 'An error occurred during the file fragmentation process.'})
      }

      // Success, get file information to instantiate the MediaSource object
      let fileInfo = JSON.parse(childProcess.execFileSync(path.join(binPath, mp4infoPath), ['--format', 'json', path.join(fragmentedFilesDirectory, destinationFile)], {encoding: 'utf8'}))
      console.log('fileInfo', fileInfo)

      let size = fs.statSync(path.join(fragmentedFilesDirectory, destinationFile)).size
      let totalChunks = Math.ceil(size / state.chunkSize)

      let file = {
        ...selectedFile,
        path: fragmentedFilesDirectory,
        filename: destinationFile,
        size: size,
        totalChunks: totalChunks,
        information: fileInfo
      }

      commit(types.UPDATE_SELECTED_FILE, Object.assign({}, file))
      commit(types.UPDATE_REQUESTED_FILE, Object.assign({}, {}))

      // Send the file information to the other peer if it's a remote request
      if (selectedFile.type === 'remote') {
        checkBufferAndSend(file)
      } else {
        readAndSendFile(commit, file)
      }
    })
  },
  handleAckFileInformation: ({commit}, file) => {
    console.log('handleAckFileInformation', file)
    readAndSendFile(commit, file)
  }
}

let readStream

const readAndSendFile = function (commit, file) {
  // Finally, read the file chunk by chunk, store the chunks and send them
  readStream = fs.createReadStream(path.join(file.path, file.filename), {highWaterMark: state.chunkSize})

  readStream.on('data', function (chunk) {
    console.log('readStream: data', chunk.byteLength)
    // Ideally, we should send the chunks to the other peer here
    if (file.type === 'remote') {
      let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
      peer.send(chunk)
      if (peer._channel.bufferedAmount > 0) console.log('readStream: bufferedamount', peer._channel.bufferedAmount)
      if (peer._channel.bufferedAmount >= 8 * 1024 * 1024) {
        readStream.pause()
        setTimeout(() => {
          readStream.resume()
        }, 1000)
      }
    } else {
      bus.$emit('video:chunk', chunk)
    }
  }).on('end', function () {
    // We can now send the chunks contained in state.videoBuffer
    console.log('readStream: end')
  })
}

const checkBufferAndSend = function (file) {
  let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
  if (peer._channel.bufferedAmount > 0) {
    setTimeout(() => {
      checkBufferAndSend(file)
    }, 1000)
  } else {
    peer.send(JSON.stringify({
      type: 'SEND_FILE_INFORMATION',
      payload: file
    }))
  }
}

export default {
  state,
  mutations,
  actions
}
