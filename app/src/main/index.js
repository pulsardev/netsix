'use strict'

import { app, BrowserWindow, ipcMain, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'
const deskmetrics = require('deskmetrics')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('auto-updater', 'checking-for-update')
})

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('auto-updater', 'update-available')
})

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('auto-updater', 'update-not-available')
})

autoUpdater.on('error', (ev, err) => {
  console.log(err)
  mainWindow.webContents.send('auto-updater', 'error')
})

autoUpdater.on('download-progress', () => {
  mainWindow.webContents.send('auto-updater', 'download-progress')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('auto-updater', 'update-downloaded')
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

// If we are in production
if (process.env.NODE_ENV === 'production') {
  // Check for updates
  app.on('ready', function () {
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('auto-updater', (event, arg) => {
    if (arg === 'check-for-update') {
      autoUpdater.checkForUpdates()
    }
  })

  // Gather statistics
  deskmetrics.start({appId: '86398312c6'}).then(function () {
    deskmetrics.setProperty('version', app.getVersion())
  })

  ipcMain.on('analytics', (event, arg) => {
    deskmetrics.send(arg.event, arg.body)
  })
}

let tray = null
app.on('ready', () => {
  let iconPath = process.env.NODE_ENV !== 'production' ? 'app/icons/icon.ico' : `${__dirname}/icons/icon.ico`
  tray = new Tray(iconPath)
  tray.setToolTip('Netsix ' + app.getVersion())

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
})
