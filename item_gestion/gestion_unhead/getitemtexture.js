import fs from 'fs'

const file = fs.readFileSync("./itemlist.json")
const parsed = JSON.parse(file)
const itemname = parsed[0].replace("minecraft:","")
console.log(itemname)

const imgdir = fs.readdirSync("./item")

const index = imgdir.indexOf(itemname+".png")
console.log(index)

