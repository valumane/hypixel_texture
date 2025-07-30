//merge tout les lien d'items dans un seul filelist.json
import fs from 'fs';

export const inputFolder = './head';
const outputFile = './filelist.json';

const files = fs.readdirSync(inputFolder)
  .filter(f => f.endsWith('.json'))
  .map(f => './head/' + f);

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2), 'utf8');
console.log(`✅ ${files.length} fichiers listés dans ${outputFile}`);