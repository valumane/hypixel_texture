import puppeteer from 'puppeteer';
import fs from 'fs';
import axios from 'axios';
import { basename } from 'path';

async function test() {
    const url = "https://minecraft.wiki/wiki/Block";

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const liens = await page.evaluate(() => {
        const racine = document.getElementsByClassName("div-col columns column-width")[0];
        if (!racine) return [];

        const resultats = [];

        for (let i = 0; i < 1000; i++) {
            try {
                const href = racine.children[0]
                    .children[i]
                    .children[0]
                    .children[0]
                    .href;
                if (href) resultats.push(href);
            } catch (e) {
                // ignore les erreurs (ex : index out of range)
            }
        }

        return resultats;
    });

    // Sauvegarde des liens extraits
    fs.writeFileSync("output.json", JSON.stringify(liens, null, 2));
    console.log(`✅ ${liens.length} liens extraits.`);

    // Création du dossier "images" s'il n'existe pas
    if (!fs.existsSync("images")) {
        fs.mkdirSync("images");
    }

    // Pour chaque lien : va chercher l'image et télécharge-la
    for (let i = 0; i < liens.length; i++) {
        const lien = liens[i];
        console.log(`🔎 (${i + 1}/${liens.length}) Traitement de : ${lien}`);

        try {
            await page.goto(lien, { waitUntil: 'networkidle2' });

            const imageUrl = await page.evaluate(() => {
                const file = document.getElementById("file");
                return file?.children[0]?.href || null;
            });

            if (!imageUrl) {
                console.log("  ⚠️ Image introuvable");
                continue;
            }

            const fileName = basename(imageUrl.split('?')[0]); // Nettoie l'URL
            const filePath = `images/${fileName}`;

            const response = await axios.get(imageUrl, { responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`  ✅ Image téléchargée : ${fileName}`);
        } catch (err) {
            console.log(`  ❌ Erreur : ${err.message}`);
        }
    }

    await browser.close();
}

await test();
