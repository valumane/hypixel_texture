import fs from 'fs'



let wiki = JSON.parse(fs.readFileSync("wiki.json"))
let neu = JSON.parse(fs.readFileSync("neu.json"))



function wiki_not_in_neu() {
    for (let i = 0; i < wiki.length; i++) {

        let itemwiki = wiki[i].replace(".png", "")
        const found = neu.some(item =>
            item.toLowerCase().includes(itemwiki.toLowerCase())
        );

        console.log("itemwiki", itemwiki, found, "InNeu")
        if (!found) {
            fs.appendFileSync("wiki_not_in_neu", `${itemwiki}\n`)
        }
    }

}
wiki_not_in_neu()



function neu_not_in_wiki() {
    for (let i = 0; i < neu.length; i++) {

        let itemneu = neu[i].replace(".json", "")
        const found = wiki.some(item =>
            item.toLowerCase().includes(itemneu.toLowerCase())
        );

        console.log("itemneu", itemneu, found, "InWiki")
        if (!found) {
            fs.appendFileSync("neu_not_in_wiki", `${itemneu}\n`)
        }
    }
}
neu_not_in_wiki()
