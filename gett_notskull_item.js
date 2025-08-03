import { readdir, readFile, mkdir, copyFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

// __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dossier source des fichiers JSON
const itemsDir = 'C:/Users/lucas/AppData/Roaming/.minecraft/config/notenoughupdates/repo/items';
// Dossier de destination pour les non-skulls
const outputDir = join(__dirname, 'notskull');

// Créer le dossier ./notskull s’il n’existe pas
if (!existsSync(outputDir)) {
  await mkdir(outputDir);
  console.log('📁 Dossier ./notskull créé');
}

try {
  const files = await readdir(itemsDir);

  for (const file of files) {
    const filePath = join(itemsDir, file);

    if (extname(file) === '.json') {
      try {
        const content = await readFile(filePath, 'utf8');
        const data = JSON.parse(content);

        if (data.itemid && data.itemid !== 'minecraft:skull') {
          const destPath = join(outputDir, file);
          await copyFile(filePath, destPath);
        }

      } catch (err) {
        console.error(`❌ Erreur dans ${file} : ${err.message}`);
      }
    }
  }

  console.log('✅ Tous les fichiers non-skull ont été copiés dans ./notskull');

} catch (err) {
  console.error('❌ Erreur globale :', err.message);
}
