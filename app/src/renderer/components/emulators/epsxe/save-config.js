
import fs from 'fs'
import ini from 'ini'

export default (filepath, params, outfilepath) => {
    return new Promise((resolve, reject) => {
        try {
            const content = fs.readFileSync(filepath, 'utf-8')
            let config = ini.parse(content)

            const [width, height] = params.resolution.split('x')
            config.GPUResX = width
            config.GPUResY = height
            config.GPUFullscreen = (params.display === 'fullscreen' ? 1 : 0)

            fs.writeFileSync(outfilepath, ini.stringify(config))
            console.log(`epsxerc copied to ${outfilepath}`)
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}
