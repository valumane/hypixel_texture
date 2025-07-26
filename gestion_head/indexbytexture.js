import fs from 'fs';

const dir = fs.readdirSync('./checkgoodformat/img');
const filename = process.argv[2];

const index = dir.indexOf(filename);
console.log(index + 1);