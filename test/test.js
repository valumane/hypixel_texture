import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://wiki.hypixel.net/Aatrox';
const keyword = 'category:';

async function findTitleKeywordInDOM(url, keyword) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(html);

    const trs = $('tr');

    trs.each((i, tr) => {
      const cells = $(tr).children('td, th');
      cells.each((j, cell) => {
        const children = $(cell).children();
        children.each((k, child) => {
          const title = $(child).attr('title');
          if (title && title.toLowerCase().includes(keyword.toLowerCase())) {
            console.log(`✅ Mot "${keyword}" trouvé dans document.getElementsByTagName("tr")[${i}].children[${j}].children[${k}].title`);
            console.log('→ title =', title);
          }
        });
      });
    });
  } catch (err) {
    console.error('Erreur :', err.message);
  }
}

findTitleKeywordInDOM(url, keyword);
