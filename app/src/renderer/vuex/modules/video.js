import * as types from '../mutation-types'
import * as childProcess from 'child_process'
import path from 'path'
import * as fs from 'fs'
import { bus } from '../../shared/bus'

const state = {
  selectedFile: {},
  chunkSize: 64 * 1024,
  downloadBitrate: 0
}

const mutations = {
  [types.UPDATE_SELECTED_FILE] (state, payload) {
    state.selectedFile = payload
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
    const mp4box = childProcess.spawn('mp4fragment', [path.join(selectedFile.path, selectedFile.filename), path.join(fragmentedFilesDirectory, destinationFile)])

    mp4box.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    mp4box.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    mp4box.on('close', (code) => {
      console.log(`child process exited with code ${code}`)

      if (code === 0) {
        // Success, get file information to instantiate the MediaSource object
        let fileInfo = JSON.parse(childProcess.spawnSync('mp4info', ['--format', 'json', path.join(fragmentedFilesDirectory, destinationFile)], {encoding: 'utf8'}).stdout)
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

        // Send the file information to the other peer if it's a remote request
        let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer
        if (selectedFile.type === 'remote') {
          peer.send(JSON.stringify({
            type: 'SEND_FILE_INFORMATION',
            payload: file
          }))
        } else {
          readAndSendFile(commit, file)
        }
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

export default {
  state,
  mutations,
  actions
}
