import fs from 'fs';
import fetch from 'node-fetch';

const iconlist = fs.readFileSync("res.json")
const iconlistparsed = JSON.parse(iconlist)
let extension = ".png"
console.log(iconlistparsed.length)


let misword = [
    ["Hopper_Minecart", "Minecart_with_Hopper"],
    ["Tnt", "TNT"],
    ["Lapis_Ore", "Lapis_Lazuli_Ore"],
    ["Comparator", "Redstone_Comparator"],
    ["Jack_O_Lantern", "Jack_o%27Lantern"],
    ["Minecart_with_Furnace", "Furnace_Minecart"],
    ["Slime_Bball", "Slimeball"],
    ["Redstone_Block", "Block_of_Redstone"],
    ["Beef", "Cooked_Beef"],
    ["Rabbit_Foot", "Rabbit%27s_Foot"],
    ["Porkchop", "Cooked_Porkchop"],
    ["Lapis_Block", "Block_of_Lapis_Lazuli"],
    ["Iron_Block", "Block_of_Iron"],
    ["Leather_Chestplate", "Leather_Tunic"],
    ["Diamond_Block", "Block_of_Diamond"],
    ["Writable_Book", "Book_and_Quill"],
    ["Leather_Leggings", "Leather_Pants"],
    ["Coal_Block", "Block_of_Coal"],
    ["Experience_Bottle", "Bottle_o%27_Enchanting"],
    ["Repeater", "Redstone_Repeater"],
    ["Quartz_Block", "Block_of_Quartz"],
    ["Quartz", "Nether_Quartz"],
    ["Hay_Block", "Hay_Bale"],
    ["Gold_Block", "Block_of_Gold"],
    ["https://minecraft.wiki/images/Invicon_Ender_Eye.png", "https://fr.minecraft.wiki/images/Oeil_de_l%27Ender.png?a165c"],
    ["Carrot_On_A_Stick", "Carrot_on_a_Stick"],
    ["Emerald_Block", "Block_of_Emerald"]
]



function correctUrl(originalUrl) {
    for (const [wrong, correct] of misword) {
        if (originalUrl.includes(wrong)) {
            if (correct.startsWith("https://")) {
                return correct; // cas URL complète de remplacement
            } else {
                return originalUrl.replace(wrong, correct);
            }
        }
    }
    return originalUrl;
}




async function downloadImage(url, outputPath, triedGif = false) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const fileStream = fs.createWriteStream(outputPath);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        console.log(`✅ Téléchargé : ${outputPath}`);
    } catch (err) {
        if (!triedGif && url.endsWith('.png')) {
            const gifUrl = url.replace(/\.png$/, '.gif');
            const gifOutput = outputPath.replace(/\.png$/, '.gif');
            console.log(`🔁 Fallback vers .gif : ${gifUrl}`);
            extension = ".gif"
            await downloadImage(gifUrl, gifOutput, true); // récursif avec stop
        } else {
            console.log(`❌ Échec final : ${url} — ${err.message}`);
            fs.appendFileSync("logfetch.txt", `${url} — ${err.message}\n`)
        }
    }
}




// Assure-toi que le dossier existe
if (!fs.existsSync('../items')) {
    fs.mkdirSync('../items');
}

async function iter() {
    for (let i = 0; i < iconlistparsed.length; i++) {
        let url = iconlistparsed[i];
        url = correctUrl(url); // corrige si nécessaire

        const name = url
            .split('/').pop()
            .split('?')[0]
            .replace("Invicon_", "")
            .toLowerCase();
        console.log(name);

        await downloadImage(url, `../items/${name}`);
    }
}

iter(iconlistparsed.length)

