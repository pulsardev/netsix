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

let fragmentedFilesDirectory, binPath, destinationFile, destinationPath, timeout

const actions = {
  handleGetFileRequest: ({commit}, selectedFile) => {
    console.log('handleGetFileRequest', selectedFile)

    // Stop sending chunks
    if (readStream) readStream.pause()
    clearTimeout(timeout)

    // Create a directory to store fragmented files if it doesn't exist already
    fragmentedFilesDirectory = path.join(selectedFile.path, '.netsix')
    if (!fs.existsSync(fragmentedFilesDirectory)) {
      fs.mkdirSync(fragmentedFilesDirectory)
    }

    // The final file must be a mp4
    destinationFile = selectedFile.filename.split('.').shift() + '.mp4'
    destinationPath = path.join(fragmentedFilesDirectory, destinationFile)

    // The folder where the mp4 tools' binaries are stored
    binPath = process.env.NODE_ENV === 'production' ? 'resources/app/dist' : 'app/dist'

    // Check if a fragmented version of the selected already exists
    if (!fs.existsSync(destinationPath)) {
      // mp4fragment input.mp4 .netsix/output.mp4
      childProcess.execFile(path.join(binPath, mp4fragmentPath), [path.join(selectedFile.path, selectedFile.filename), destinationPath], (error, stdout, stderr) => {
        if (error) console.error(`error: ${error}`)
        if (stdout) console.log(`stdout: ${stdout}`)
        if (stderr) console.log(`stderr: ${stderr}`)

        if (error) {
          // Error, reset the state
          commit(types.UPDATE_REQUESTED_FILE, Object.assign({}, {}))
          commit('PUSH_NOTIFICATION', {type: 'danger', message: 'An error occurred during the file fragmentation process.'})
        }

        // Success, get file information to instantiate the MediaSource object
        generateFileInformation(commit, selectedFile)
      })
    } else {
      // A fragmented version of the selected file already exists
      // No need to fragment again, just get the file information
      generateFileInformation(commit, selectedFile)
    }
  },
  handleAckFileInformation: ({commit}, file) => {
    console.log('handleAckFileInformation', file)
    readAndSendFile(commit, file)
  }
}

const generateFileInformation = function (commit, selectedFile) {
  let fileInfo = JSON.parse(childProcess.execFileSync(path.join(binPath, mp4infoPath), ['--format', 'json', destinationPath], {encoding: 'utf8'}))
  console.log('fileInfo', fileInfo)

  let size = fs.statSync(destinationPath).size
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
    checkBufferAndSendFileInformation(file)
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
        timeout = setTimeout(() => {
          readStream.resume()
        }, 1000)
      }
    }

    // Emit a chunk if we are not connected locally (through a manuel connection for example) to track the upload progress
    if (!(window.clientPeer._pcReady && window.hostPeer._pcReady)) bus.$emit('video:chunk', chunk)
  }).on('end', function () {
    console.log('readStream: end')
  })
}

const checkBufferAndSendFileInformation = function (file) {
  let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
  if (peer._channel.bufferedAmount > 0) {
    setTimeout(() => {
      checkBufferAndSendFileInformation(file)
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
