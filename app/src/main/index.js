'use strict'

import { app, BrowserWindow } from 'electron'
import PM2 from 'pm2'
import path from 'path'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

let pm2 = new PM2.custom({
    independent: true,
    daemon_mode: false
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

    pm2.connect(err => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log(err)
            process.exit(2)
        }

        pm2.start({
            name: 'remote-pad',
            script: path.join(__dirname, '../../../services/web/production/server.js')
        }, (err, apps) => {
            if (err) console.log(err)
        })

        pm2.start({
            name: 'remote-pad-server',
            script: path.join(__dirname, '../../../services/mqtt-broker/src/index.js')
        }, (err, apps) => {
            if (err) console.log(err)
        })
    })

    // eslint-disable-next-line no-console
    console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // pm2.delete('remote-pad', err => {
    //     if (err) console.error(err)
    // })

    // pm2.delete('remote-pad-server', err => {
    //     if (err) console.error(err)
    // })

    console.log('closing window')

    pm2.connect(err => {
        if (err) {
            console.log(err)
            process.exit(2)
        }
        // TODO: still having problems with destroy
        // the daemon do not exits and hangs the app
        // open.
        pm2.destroy()
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
