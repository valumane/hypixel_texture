import fs from 'fs';
import { parseStringPromise } from 'xml2js';

async function main() {
  try {
    // Lis le XML depuis ton fichier
    const xml = fs.readFileSync('sitemap.xml', 'utf-8');

    // Parse en objet JavaScript
    const result = await parseStringPromise(xml);

    // Récupère toutes les URLs dans un tableau
    const urls = result.urlset.url.map(entry => entry.loc[0]);

    // Écris le tableau dans un fichier JSON
    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2), 'utf-8');

    console.log(`✅ ${urls.length} URLs exportées dans urls.json`);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
}

main();
