import fs from 'fs';
import http from 'http'
import https from 'https'
import { argv } from 'process';

let wrongjson = [43, 69, 83, 89, 319, 369, 374, 480, 530, 548, 567, 592, 617, 937, 976, 980, 1010, 1072, 1327, 1328, 1329, 1335, 1354, 1355, 1411, 1439, 1473, 1537, 1719, 1776, 1794, 1798, 1800, 1878, 2028, 2051, 2085, 2266, 2281, 2293, 2303, 2304, 2369, 2379, 2383, 2437, 2440, 2452, 2453, 2454, 2456, 2594, 2596, 2647, 2664, 2671, 2674, 2688, 2726, 2728, 3076, 3375, 3376, 3377, 3378, 3379, 3423, 3501, 3523, 3535, 3582, 3642, 3650, 3653, 3903, 4024, 4088, 4090, 4133, 4138, 4250, 4293, 4342, 4376]
let wrongsize = []
let res = []

let max = parseInt(process.argv[2])


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dowloadImg(textureUrl, file) {
    if (textureUrl[4] === ":") {
        http.get(textureUrl, (res) => {
            res.pipe(fs.createWriteStream(file));
        }).on('error', (err) => {
            console.error(`HTTP error at ${i}: ${err.message}`);
            blocklist.push(i);
        });
    } else {
        https.get(textureUrl, (res) => {
            res.pipe(fs.createWriteStream(file));
        }).on('error', (err) => {
            console.error(`HTTPS error at ${i}: ${err.message}`);
            blocklist.push(i);
        });
    }
}

function getsize(file) {
    const buffer = fs.readFileSync(file);
    let size
    if (buffer.toString('ascii', 12, 16) === 'IHDR') {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        size = '(' + width + ',' + height + ')';
    }
    return size
}

function getimgurl(clean) {
    let skullownerproperties = clean.SkullOwner.Properties;
    const base64 = skullownerproperties.textures[0].Value;

    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));

    const textureUrl = decoded.textures.SKIN.url;

    return textureUrl
}

function cleancontent(inputFile) {
    const fileContents = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    let contentesclean = JSON.parse(
        fileContents.nbttag
            .replace(/([{,\[]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":')
            .replace(/\s*"\d+"\s*:/g, '')
            .replace(/:\s*(\d+)([bBsSlL])/g, ': "$1$2"')
    );
    return contentesclean
}


let time = 100
async function check(max) {
    for (let i = 2639; i < max; i++) {
        if (wrongjson.includes(i) || wrongsize.includes(i)) {
            console.log(i, "blocked")
        } else {
            try {
                //get and clean json file
                const dir = fs.readdirSync('../head')
                const dirimg = fs.readdirSync('./img')


                const inputFile = "..//head/" + dir[i];

                let clean = cleancontent(inputFile)
                //console.log("cleancontent")
                await sleep(time)

                //get url img
                let imgurl = getimgurl(clean)
                //console.log("getimgurl")
                await sleep(time)

                //get img
                const file = "./img/" + dir[i].replace("json", "png");

                await dowloadImg(imgurl, file)
                //console.log("downloaded")
                await sleep(time)

                //get img size
                let size = getsize(file)
                console.log(i, dir[i], size);

                //compar img size
                if (size.includes("32")) {
                    fs.appendFileSync('ressize.txt', i + ",")
                    res.push(i)
                    console.log(size + "-------------------------------")
                }

            } catch (e) {
                wrongjson.push(i)
                console.log(`${e.message}`)
                fs.appendFileSync('log.txt',`${e.message} \n`)
            }
        }
        //console.log("--------------")
    }
    console.log("wrongsize", res)
    // console.log("wrongjson", wrongjson)
}
await check(max)
