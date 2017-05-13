'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import forever from 'forever-monitor'
import path from 'path'
import { WaitForAll } from 'ewait'
import settings from 'electron-settings'
import { setupEmulatorsConfig } from './setup-emu-configs.js'

console.log('node electron version:', process.version)

let mainWindow

// ensure Single Instance App
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore()
        }
        mainWindow.focus()
    }
})

if (shouldQuit) {
    app.quit()
}

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

    setupEmulatorsConfig(app.getPath('userData'))

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

            web.once('restart', () => {
                event.sender.send('process-pid', {
                    module: 'web',
                    pid: web.child.pid
                })
            })
        } else if (module === 'broker') {
            broker.restart()

            broker.once('restart', () => {
                event.sender.send('process-pid', {
                    module: 'broker',
                    pid: broker.child.pid
                })
            })
        }
    })

    settings.defaults({
        emulators: {
            mupen64plus: {
                binary: '',
                resolution: '800x600',
                display: 'windowed'
            },
            snes9x: {
                binary: ''
            },
            epsxe: {
                binary: '',
                bios: '',
                resolution: '',
                display: '',
                ignorePreviousConfiguration: false
            },
            dolphin: {
                binary: '',
                ignorePreviousConfiguration: false
            }
        }
    })
    settings.applyDefaults()

    // eslint-disable-next-line no-console
    console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        let wait = new WaitForAll({
            timeout: 2000,
            event: 'stop'
        })
        wait.add([web, broker])
        web.stop()
        broker.stop()

        wait.once('done', () => {
            console.log('all services exited')
            app.quit()
        })

        wait.once('timeout', () => {
            dialog.showErrorBox('Fail to stop services',
                'The Web Server and MQTT Broker services took long than 2 seconds to exit.')
            app.quit()
        })

        wait.wait()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
