import fs, { readFileSync } from 'fs'


const dir = fs.readdirSync('./unhead');
let res = []
let max = process.argv[2]

function toPascalCase(name) {
    return name
        .split('_')                                   // sépare par underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // majuscule 1ère lettre
        .join('_');                                   // recompose avec _
}



function check() {
    for (let i = 0; i < max; i++) {
        const file = dir[i]
        const parsed = JSON.parse(readFileSync("./unhead/" + file))
        let contentesclean = JSON.parse(
            parsed.nbttag
                .replace(/([{,\[]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":')
                .replace(/\s*"\d+"\s*:/g, '')
                .replace(/:\s*(\d+)([bBsSlL])/g, ': "$1$2"')
        );
        let displayname = parsed.displayname
        let itemmodel = contentesclean.ItemModel

        if (itemmodel !== undefined) {
            res.push(itemmodel)
        }
        console.log(displayname, "|", itemmodel)


    }
    const uniques = [...new Set(res)];

    console.log(uniques.length);
    for (let i = 0; i < uniques.length; i++) {
        let itemname = toPascalCase(uniques[i].replace("minecraft:", ""))
        console.log(itemname)
        fs.appendFileSync("res.txt", `https://minecraft.wiki/images/Invicon_${itemname}.png\n`)
    }

    console.log(uniques.length)
    console.log(res.length)
}
check()