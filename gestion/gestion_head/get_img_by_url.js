import http from 'http'
import https from 'https'
import fs from 'fs'

let url = process.argv[2]


if (url[4] == ":") { //url[4] -> : mean http
    http.get(url, (res) => {
        res.pipe(fs.createWriteStream('texture.png'));
    })
} else { //url[4] -> s : mean https
    https.get(url, (res) => {
        res.pipe(fs.createWriteStream('texture.png'));
    })
}
