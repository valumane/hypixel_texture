import fs from 'fs';
import path from 'path';

// ✅ Configuration
const FILE_LIST_PATH = './filelist.json';
const HEAD_DIR = './head';
const UNHEAD_DIR = './unhead';

// ✅ Crée les dossiers si pas existants
if (!fs.existsSync(HEAD_DIR)) fs.mkdirSync(HEAD_DIR);
if (!fs.existsSync(UNHEAD_DIR)) fs.mkdirSync(UNHEAD_DIR);

// ✅ Exclusions connues
const EXCLUDED_INDICES = new Set([2471, 4276]);

// ✅ Lire la liste des fichiers
const listFiles = JSON.parse(fs.readFileSync(FILE_LIST_PATH, 'utf8'));

let headCount = 0;
let unheadCount = 0;

for (let i = 0; i < 5; i++) {
    if (EXCLUDED_INDICES.has(i)) {
        console.log(`⚠️ Skipping excluded index ${i}`);
        continue;
    }

    const filepath = listFiles[i];
    console.log(`➡️  [${i}] Checking: ${filepath}`);

    try {
        const raw = fs.readFileSync(filepath, 'utf8');
        const json = JSON.parse(raw);

        // ✅ Nettoyer le nbttag
        const nbttagClean = JSON.parse(
            json.nbttag
                .replace(/([{,\[]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":')
                .replace(/\s*"\d+"\s*:/g, '')
                .replace(/:\s*(\d+)([bBsSlL])/g, ': "$1$2"')
        );

        // ✅ Vérifier SkullOwner
        const isHead = nbttagClean.SkullOwner !== undefined;

        // ✅ Destination
        const destDir = isHead ? HEAD_DIR : UNHEAD_DIR;
        const destPath = path.join(destDir, path.basename(filepath));

        // ✅ Déplacer le fichier
        fs.renameSync(filepath, destPath);

        if (isHead) {
            headCount++;
            console.log(`✅ HEAD ➜ ${destPath}`);
        } else {
            unheadCount++;
            console.log(`✅ UNHEAD ➜ ${destPath}`);
        }

    } catch (error) {
        console.error(`❌ ERROR at index ${i} (${filepath}) : ${error}`);
    }
}

console.log(`\n✅ TRI TERMINÉ ✅`);
console.log(`🟢 Player Heads : ${headCount}`);
console.log(`🔴 Non Heads    : ${unheadCount}`);
