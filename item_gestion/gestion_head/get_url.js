import fs from 'fs';

// Lire la liste des fichiers
const files = fs.readdirSync("./head");

// Vérifier argument
if (process.argv.length < 3) {
  console.error(`Usage: node ${process.argv[1]} <index>`);
  process.exit(1);
}

const index = parseInt(process.argv[2], 10);
if (isNaN(index) || index < 0 || index >= files.length) {
  console.error(`Invalid index. Must be between 0 and ${files.length - 1}`);
  process.exit(1);
}

const inputFile = ".//head/" + files[index];
const fileContents = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Nettoyage du NBT
let contentesclean = JSON.parse(
  fileContents.nbttag
    .replace(/([{,\[]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":')
    .replace(/\s*"\d+"\s*:/g, '')
    .replace(/:\s*(\d+)([bBsSlL])/g, ': "$1$2"')
);

let skullownerproperties = contentesclean.SkullOwner.Properties;
const base64 = skullownerproperties.textures[0].Value;
const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
const textureUrl = decoded.textures.SKIN.url;

console.log(fileContents.displayname+" | ",textureUrl);
