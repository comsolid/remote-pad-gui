'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import forever from 'forever-monitor'
import path from 'path'

console.log('node electron version:', process.version)

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

const webPath = 'production/server.js'
const web = new (forever.Monitor)(webPath, {
    max: 3,
    cwd: path.join(__dirname, '../../../services/web'),
    env: {
        ELECTRON_NO_ASAR: true,
        ELECTRON_RUN_AS_NODE: true
    }
})

const brokerPath = 'src/index.js'
const broker = new (forever.Monitor)(brokerPath, {
    max: 3,
    cwd: path.join(__dirname, '../../../services/mqtt-broker'),
    env: {
        ELECTRON_NO_ASAR: true,
        ELECTRON_RUN_AS_NODE: true
    }
})

function createWindow () {
  /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    })

    mainWindow.loadURL(winURL)
    mainWindow.maximize()

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    web.start()
    broker.start()

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('process-pid', {
            module: 'web',
            pid: web.child.pid
        })

        mainWindow.webContents.send('process-pid', {
            module: 'broker',
            pid: broker.child.pid
        })
    })

    ipcMain.on('restart-process', (event, module) => {
        if (module === 'web') {
            web.restart()
        } else if (module === 'broker') {
            broker.restart()
        }

        web.once('restart', () => {
            event.sender.send('process-pid', {
                module: 'web',
                pid: web.child.pid
            })
        })

        broker.once('restart', () => {
            event.sender.send('process-pid', {
                module: 'broker',
                pid: broker.child.pid
            })
        })
    })

    // eslint-disable-next-line no-console
    console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {

    web.stop()
    broker.stop()

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
