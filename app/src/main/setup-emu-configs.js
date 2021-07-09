
import path from 'path'
import mkdirp from 'mkdirp'
import fs from 'fs'
import copy from 'recursive-copy'

export function setupEmulatorsConfig (userData) {
    const dir = path.join(userData, 'profiles')
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log('Emulators configurations not found. First time copying...')
        }
        copyEmulatorsConfig(dir)
    })

}

function copyEmulatorsConfig (dir) {
    mkdirp(dir, (err) => {
        if (err) {
            throw err
        }

        const options = {
            filter: [
                '**/mupen64plus.cfg',
                '**/snes9x.xml',
                '**/epsxerc',
                '**/GCPadNew.ini'
            ],
            overwrite: false
        }

        const src = path.join(__dirname, '../../../services/mqtt-broker/profiles')
        copy(src, dir, options)
            .then((results) => {
                console.log(`Copied ${results.length} files.`)
            })
            .catch((err) => {
                throw err
            })
    })
}
