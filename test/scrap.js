import axios from 'axios';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import { basename } from 'path';

async function main() {
    const url = 'https://wiki.hypixel.net/Necromancer%27s_Brooch';

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
        const imglink = fullSrc.replace('https:/', 'https://wiki.hypixel.net/');


        // Accès au title dans la 5e ligne du tableau (index 4), 2e colonne, 1er enfant
        const title = $('tr').eq(4).children().eq(1).children().eq(0).attr('title');
        console.log("category",title)
        console.log('Title trouvé :', title);


        console.log('Image trouvée :', imglink);

        // 📥 Télécharger l'image
        const response = await axios.get(imglink, {
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        // 🔽 Nom du fichier à partir de l’URL
        const filename = basename(imglink);
        const writer = createWriteStream(`./${filename}`);

        response.data.pipe(writer);

        writer.on('finish', () => console.log(`Image téléchargée sous : ${filename}`));
        writer.on('error', (err) => console.error('Erreur de téléchargement :', err));
    } catch (err) {
        console.error('Erreur lors du scraping :', err.message);
    }
}

main();
