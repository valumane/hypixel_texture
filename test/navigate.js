import fs from 'fs'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import { basename } from 'path';
import { log } from 'console';

const file = JSON.parse(fs.readFileSync("urls.json"))


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function findTitleKeywordInDOM(url) {
    const matches = [];

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const $ = cheerio.load(html);
        const trs = $('tr');

        trs.each((i, tr) => {
            const cells = $(tr).children('td, th');
            cells.each((j, cell) => {
                const children = $(cell).children();
                children.each((k, child) => {
                    const title = $(child).attr('title');
                    if (title && title.toLowerCase().includes("category")) {
                        matches.push({
                            title: title,
                            domPath: `tr[${i}].children[${j}].children[${k}]`
                        });
                    }
                });
            });
        });

        if (matches.length === 0) {
            console.log("❌ Aucun title contenant 'category' trouvé.");
            return null;
        }

        // Tri par ordre d’apparition dans la page (ou par règle personnalisée)
        // Ici on prend le plus COURT (option modifiable)
        matches.sort((a, b) => a.title.length - b.title.length);

        const chosen = matches[0];
        console.log(`✅ Le title sélectionné : ${chosen.title}`);
        console.log(`→ depuis ${chosen.domPath}`);
        return chosen.title;

    } catch (err) {
        console.error('Erreur :', err.message);
        return null;
    }
}


async function main(n) {
    //console.log("🔗 URL :", url);
    let url = file[n]

    const logEntry = {
        url: url,
        category: null,
        img: null,
        isEvent: null,
    };


    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
            }
        });

        const $ = cheerio.load(html);
        const th = $('th').eq(1);
        const img = th.find('img').first();
        const src = img.attr('src');
        const fullSrc = src?.startsWith('http') ? src : `https:${src}`;
        let imglink = fullSrc.replace("https:/", "https://wiki.hypixel.net/");
        logEntry.img = imglink;


        let category = await findTitleKeywordInDOM(url);
        logEntry.category = category
        //console.log("category : ", category)

        let isEvent = category && category.toLowerCase().includes("event");
        logEntry.isEvent = isEvent;

        if (category == null) {
            logEntry.category = "null";
            logEntry.isEvent = "null";

        }

        if (category !== null) {
            if (isEvent) {
                console.log('event');
            } else {

                //console.log("category", category)
                //console.log('Image trouvée :', imglink);


                if (category == undefined || imglink == undefined) {
                    //console.log("title ou imglink undefined")
                    //console.log(category, imglink)
                } else {
                    // 📥 Télécharger l'image
                    const response = await axios.get(imglink, {
                        responseType: 'stream',
                        headers: {
                            'User-Agent': 'Mozilla/5.0'
                        }
                    });

                    // 🔽 Nom du fichier à partir de l’URL
                    const filename = basename(imglink);
                    const writer = createWriteStream(`./img/${filename}`);

                    response.data.pipe(writer);

                    writer.on('finish', () => console.log(`Image téléchargée sous : ${filename}`));
                    writer.on('error', (err) => console.error('Erreur de téléchargement :', err));
                }
            }
        }
    } catch (err) {
        console.error('Erreur lors du scraping :', err.message);
    }
    console.log("")
    console.log(logEntry)


    fs.appendFileSync("log.json", '{"url":' + '"' + logEntry.url + '"' + ",\n")
    fs.appendFileSync("log.json", '"category":' + '"' + logEntry.category + '",\n')
    fs.appendFileSync("log.json", '"img":' + '"' + logEntry.img + '",\n')
    fs.appendFileSync("log.json", '"isEvent"' + ':"' + logEntry.isEvent + '"},\n')
}

for (let i = 0; i < process.argv[2]; i++) {
    console.log( (i/process.argv[2])*100+"%" ) 
    await main(i)
    await wait(300)
}
