import * as types from '../mutation-types'
import * as childProcess from 'child_process'
import path from 'path'
import * as fs from 'fs'

const state = {
  selectedFile: {},
  videoBuffer: []
}

const mutations = {
  [types.UPDATE_SELECTED_FILE] (state, payload) {
    state.selectedFile = payload
  },
  [types.UDPATE_VIDEO_BUFFER] (state, payload) {
    state.videoBuffer = payload
  }
}

const actions = {
  handleGetFileRequest: ({commit}, selectedFile) => {
    console.log('handleGetFileRequest', selectedFile)

    // Empty the buffer
    commit(types.UDPATE_VIDEO_BUFFER, [])

    // Create a directory to store fragmented files if it doesn't exist already
    let fragmentedFilesDirectory = path.join(selectedFile.path, '.netsix')
    if (!fs.existsSync(fragmentedFilesDirectory)) {
      fs.mkdirSync(fragmentedFilesDirectory)
    }

    let destinationFile = selectedFile.filename.split('.').shift() + '-fragmented.mp4'

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

        commit(types.UPDATE_SELECTED_FILE, Object.assign({}, {
          ...selectedFile,
          path: fragmentedFilesDirectory,
          filename: destinationFile,
          information: fileInfo
        }))

        // Finally, read the file chunk by chunk, store the chunks and send them
        let readStream = fs.createReadStream(path.join(fragmentedFilesDirectory, destinationFile), {highWaterMark: 16 * 1024})

        let temporaryVideoBuffer = []
        readStream.on('data', function (chunk) {
          console.log('readStream: data', chunk.byteLength)
          temporaryVideoBuffer.push(chunk)
          // Ideally, we should send the chunks to the other peer here
        }).on('end', function () {
          commit(types.UDPATE_VIDEO_BUFFER, temporaryVideoBuffer)
          // We can now send the chunks contained in state.videoBuffer
          console.log('readStream: end')
        })
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
