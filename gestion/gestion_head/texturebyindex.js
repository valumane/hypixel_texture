import fs from 'fs'



const dir = fs.readdirSync('./checkgoodformat/img')
const index = process.argv[2]
console.log('.\\checkgoodformat\\img\\'+dir[index-1])
