const kanaRomajiTable = {
  あ: ["a"],
  い: ["i"],
  う: ["u", "wu", "whu"],
  え: ["e"],
  お: ["o"],
  か: ["ka", "ca"],
  き: ["ki"],
  く: ["ku", "cu", "qu"],
  け: ["ke"],
  こ: ["ko", "co"],
  さ: ["sa"],
  し: ["si", "shi"],
  す: ["su"],
  せ: ["se"],
  そ: ["so"],
  た: ["ta"],
  ち: ["ti", "chi"],
  つ: ["tu", "tsu"],
  て: ["te"],
  と: ["to"],
  な: ["na"],
  に: ["ni"],
  ぬ: ["nu"],
  ね: ["ne"],
  の: ["no"],
  は: ["ha"],
  ひ: ["hi"],
  ふ: ["hu", "fu"],
  へ: ["he"],
  ほ: ["ho"],
  ま: ["ma"],
  み: ["mi"],
  む: ["mu"],
  め: ["me"],
  も: ["mo"],
  や: ["ya"],
  ゆ: ["yu"],
  よ: ["yo"],
  ら: ["ra"],
  り: ["ri"],
  る: ["ru"],
  れ: ["re"],
  ろ: ["ro"],
  わ: ["wa"],
  を: ["wo"],
  ん: ["nn"],
  っ: ["xtu", "ltu"],
  ー: ["-"],
  ぁ: ["xa", "la"],
  ぃ: ["xi", "li"],
  ぅ: ["xu", "lu"],
  ぇ: ["xe", "le"],
  ぉ: ["xo", "lo"],
  ゃ: ["xya", "lya"],
  ゅ: ["xyu", "lyu"],
  ょ: ["xyo", "lyo"],
  ゎ: ["xwa", "lwa"],
  が: ["ga"],
  ぎ: ["gi"],
  ぐ: ["gu"],
  げ: ["ge"],
  ご: ["go"],
  ざ: ["za"],
  じ: ["zi", "ji"],
  ず: ["zu"],
  ぜ: ["ze"],
  ぞ: ["zo"],
  だ: ["da"],
  ぢ: ["di"],
  づ: ["du"],
  で: ["de"],
  ど: ["do"],
  ば: ["ba"],
  び: ["bi"],
  ぶ: ["bu"],
  べ: ["be"],
  ぼ: ["bo"],
  ぱ: ["pa"],
  ぴ: ["pi"],
  ぷ: ["pu"],
  ぺ: ["pe"],
  ぽ: ["po"],
  ふぁ: ["fa"],
  ふぃ: ["fi"],
  ふぇ: ["fe"],
  ふぉ: ["fo"],
  ヴぁ: ["va"],
  ヴぃ: ["vi"],
  ヴ: ["vu"],
  ヴぇ: ["ve"],
  ヴぉ: ["vo"],
  うぁ: ["wha"],
  うぃ: ["whi", "wi"],
  うぇ: ["whe", "we"],
  うぉ: ["who"],
  きゃ: ["kya"],
  きぃ: ["kyi"],
  きゃ: ["kya"],
  きゅ: ["kyu"],
  きぇ: ["kye"],
  きょ: ["kyo"],
  しゃ: ["sya", "sha"],
  しぃ: ["syi"],
  しゅ: ["syu", "shu"],
  しぇ: ["sye", "she"],
  しょ: ["syo", "sho"],
  ちゃ: ["tya"],
  ちぃ: ["tyi"],
  ちゅ: ["tyu"],
  ちぇ: ["tye"],
  ちょ: ["tyo"],
  にゃ: ["nya"],
  にぃ: ["nyi"],
  にゅ: ["nyu"],
  にぇ: ["nye"],
  にょ: ["nyo"],
  ひゃ: ["hya"],
  ひぃ: ["hyi"],
  ひゅ: ["hyu"],
  ひぇ: ["hye"],
  ひょ: ["hyo"],
  ふぁ: ["fa"],
  ふぃ: ["fi"],
  ふぇ: ["fe"],
  ふぉ: ["fo"],
  ふゃ: ["fya"],
  ふぃ: ["fyi"],
  ふゅ: ["fyu"],
  ふぇ: ["fye"],
  ふょ: ["fyo"],
  みゃ: ["mya"],
  みぃ: ["myi"],
  みゅ: ["myu"],
  みぇ: ["mye"],
  みょ: ["myo"],
  りゃ: ["rya"],
  りぃ: ["ryi"],
  りゅ: ["ryu"],
  りぇ: ["rye"],
  りょ: ["ryo"],
  ぎゃ: ["gya"],
  ぎぃ: ["gyi"],
  ぎゅ: ["gyu"],
  ぎぇ: ["gye"],
  ぎょ: ["gyo"],
  じゃ: ["zya", "jya", "ja"],
  じぃ: ["zyi", "jyi"],
  じゅ: ["zyu", "jyu", "ju"],
  じぇ: ["zye", "jye", "je"],
  じょ: ["zyo", "jo", "jo"],
  ぢゃ: ["dya"],
  ぢぃ: ["dyi"],
  ぢゅ: ["dyu"],
  ぢぇ: ["dye"],
  ぢょ: ["dyo"],
  びゃ: ["bya"],
  びぃ: ["byi"],
  びゅ: ["byu"],
  びぇ: ["bye"],
  びょ: ["byo"],
  ぴゃ: ["pya"],
  ぴぃ: ["pyi"],
  ぴゅ: ["pyu"],
  ぴぇ: ["pye"],
  ぴょ: ["pyo"],
};

function convertRomajiPart(part) {
  const romajis = kanaRomajiTable[part];
  if (romajis) {
    const partCharProduct = [];
    if (part.length > 1) {
      if (part.length > 2) {
        throw new Error(`想定外のpart: ${part}`);
      }
      const partCharRomaji = part.split("").map((char) => {
        const charRomaji = kanaRomajiTable[char];
        if (!charRomaji) {
          throw new Error(`分解不能 ${part}`);
        }
        return structuredClone(charRomaji);
      });
      for (let i of partCharRomaji[0]) {
        for (let j of partCharRomaji[1]) {
          partCharProduct.push(`${i}${j}`);
        }
      }
    }
    return structuredClone(romajis.concat(partCharProduct));
  }
  return [];
}

function convertRomaji(word) {
  const result = [];
  let cursor = 0;
  while (cursor < word.length) {
    const part3 = word.substr(cursor, 3);
    const part2 = word.substr(cursor, 2);
    const part1 = word.substr(cursor, 1);
    if (
      part3.match(/^ん/) &&
      !part3.match(/^ん$/) &&
      !part3.match(/^ん[なにぬねの]/)
    ) {
      const innerPart3 = word.substr(cursor + 1, 3);
      const innerPart2 = word.substr(cursor + 1, 2);
      const innerPart1 = word.substr(cursor + 1, 1);
      for (let part of [innerPart3, innerPart2, innerPart1]) {
        const partsResult = convertRomajiPart(part);
        if (partsResult.length) {
          const appendedPartsResult = [];
          for (let i of ["n", "nn"]) {
            for (let j of partsResult) {
              appendedPartsResult.push(`${i}${j}`);
            }
          }
          result.push({ chunk: `ん${part}`, candidates: appendedPartsResult });
          cursor += part.length + 1;
          break;
        }
      }
    } else if (false) {
      // っから始まるパターン
    } else {
      for (let part of [part3, part2, part1]) {
        const partsResult = convertRomajiPart(part);
        if (partsResult.length) {
          result.push({ chunk: part, candidates: partsResult });
          cursor += part.length;
          break;
        }
      }
    }
  }
  return JSON.stringify(result, null, "  ");
}

console.log(convertRomaji("しんねん"));
console.log(convertRomaji("しんにゅう"));
console.log(convertRomaji("ししゃ"));
console.log(convertRomaji("しんしゃ"));
// console.log(convertRomaji("たっせい"));
// console.log(convertRomaji("じっしゃ"));
// console.log(convertRomaji("しゃちょう"));
// console.log(convertRomaji("しゃしん"));
