
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;

function getItems(directory, extension = ".json") {
  return fs.readdirSync(path.join(root, directory))
    .filter(file => file.endsWith(extension))
    .map(file => file.slice(0, -extension.length))
    .sort();
}

const manifest = {
  head: getItems("head"),
  notskull: getItems("notskull"),
  block: getItems("block/images", ".png")
};

fs.writeFileSync(
  path.join(root, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log("Manifest mis à jour !");
console.log(`Head : ${manifest.head.length} items`);
console.log(`NotSkull : ${manifest.notskull.length} items`);
console.log(`Block : ${manifest.block.length} textures`);

