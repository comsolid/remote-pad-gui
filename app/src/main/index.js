'use strict'

import { app, BrowserWindow } from 'electron'
import pm2 from 'pm2'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

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

    pm2.connect(err => {
        if (err) console.error(err)

        pm2.start({
            name: 'remote-pad',
            script: 'services/web/production/server.js'
        }, (err, apps) => {
            if (err) console.error(err)
        })

        pm2.start({
            name: 'remote-pad-server',
            script: 'services/mqtt-broker/src/index.js'
        }, (err, apps) => {
            if (err) console.error(err)
        })
    })

    // eslint-disable-next-line no-console
    console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    pm2.stop('remote-pad', err => {
        if (err) console.error(err)
    })

    pm2.stop('remote-pad-server', err => {
        if (err) console.error(err)
    })

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
