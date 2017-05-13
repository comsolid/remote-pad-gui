
import fs from 'fs'

export default (filepath, outfilepath) => {
    return new Promise((resolve, reject) => {
        const readable = fs.createReadStream(filepath)
        const writable = fs.createWriteStream(outfilepath)
        const cleanup = (err) => {
            readable.destroy()
            writable.end()
            reject(err)
        }
        readable.on('error', cleanup)
        writable.on('error', cleanup)
        writable.on('finish', () => {
            resolve()
        })
        readable.pipe(writable)
    })
}
