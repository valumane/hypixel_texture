import fs from 'fs';

// Vérifie l'index en argument
const index = parseInt(process.argv[2], 10);
if (isNaN(index)) {
  console.error("Usage: node add_img_to_file.js <index>");
  process.exit(1);
}

// Liste les fichiers dans ./head
const files = fs.readdirSync('./head');
const inputFile = `./head/${files[index]}`;

// Lire stdin (le base64)
let base64 = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => base64 += chunk);
process.stdin.on('end', () => {
  base64 = base64.trim();

  // Charger et modifier le JSON
  const obj = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  obj.img = base64;

  // Réécriture propre
  fs.writeFileSync(inputFile, JSON.stringify(obj, null, 2));
  console.log(`✅ Image ajoutée à ${files[index]}`);
});
